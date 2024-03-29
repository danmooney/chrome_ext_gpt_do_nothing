(function() {
    'use strict';
    $$.klass(function Offer () {
        var
            /**
             * @type {Object}
             */
            offer,
            /**
             * @type {jQuery}
             */
            forms,
            /**
             * @param {Boolean}
             */
            debugging = false,
            preventSuccessiveStartsBool,
            successiveStartsNum = 0;


        this.setDebugging = function (debugBool) {
            debugging = debugBool;
        };

        /**
         * @return {Boolean}
         */
        this.isDebugging = function () {
            return debugging;
        };

        /**
         * Parse the offer forms,
         * find 'the right form',
         * set the form info and then
         * fill them out!
         *
         * Every time it is called, 'the right form' will always be unique
         * and will have never filled out before.
         */
        this.lookForForms = function () {
            var that = this;

            this.trigger('GOING_ONTO_ANOTHER_FORM');

            /**
             * Evaluate form elements on page and enumerate through lastForms array to make
             * sure we are not filling out the same form twice
             */
            $$('OfferForm').evaluateForms(function (formEls) {
                forms = formEls;
                // DEBUG - get from user options!
                $$('OfferForm').setFormInfo(null, function () {
                // END DEBUG
                    var form,
                        inputEls;

                    if (formEls.length === 0) {
                        alert('Form length: ' + formEls.length);

                        inputEls = $$('OfferForm').evaluateFormInputs();

                        if (inputEls.length > 0) {
                            $$('OfferForm').fillOutForm();
                        } else {
                            // click in random places
                            $$('OfferNoform').clickAround();
                        }
                    } else {
                        if (formEls.length === 1) {
                            form = formEls.eq(0);
                        } else {
                            // find out which one to evalute
                            form = that.getTheRightForm(formEls);
                        }

                        /**
                         * Add form to lastFormsArr and fillOutForm as callback
                         */
                        $$('OfferForm').setLastFormsArr(form, function () {
                            $$('OfferForm').fillOutForm(form);
                        });
                    }
                });
            });
        };

        /**
         * Offer isn't worth pursuing, do the next one
         */
        this.skipOffer = function (submitBool) {
            alert('skipping offer');

            submitBool = $$.util.isBool(submitBool)
                ? submitBool
                : false;

            if (true === this.isDebugging()) {
                alert('ABORTING PARSING OFFER IN DEBUG MODE');
                return;
            }

            $$('OfferForm').removeLastFormsArr(function () {
                $$('Storage').getItem('currentGptTabId', function (gptTabId) {
                    $$('Message').sendMessage({
                        klass: 'Message',
                        method: 'sendMessage',
                        args: [
                            {
                                klass: 'GptSiteOffer',
                                method: 'siteOfferExpired',
                                tabId: gptTabId,
                                args: [
                                    submitBool
                                ]
                            }
                        ]
                    })
                });
            });
        };

        /**
         * @param {Boolean} [debugBool]
         */
        this.start = function (debugBool) {
             var that = this;

            // this function MUST NOT be executed more than once in a given time period!
            if (true === preventSuccessiveStartsBool) {
                successiveStartsNum += 1;
                console.log('Successive Start #' + successiveStartsNum);

                if (successiveStartsNum > 1) {
                    return;
                }

                setTimeout(function () {
                    successiveStartsNum = 0;
                    preventSuccessiveStartsBool = false;
                }, 4000);
            }

            preventSuccessiveStartsBool = true;

            if (true === debugBool) {
                this.setDebugging(true);
            }

            $$('Storage').getItem('currentOffer', function (offerObj) {
                offer = offerObj;

                if (location.hostname === 'gpt-tests') {
                    return that.lookForForms.call(that);
                }

                if (true === that.seemsLikeOfferExpired()) {
                    return that.skipOffer(false);
                } else if (false === that.seemsLikeARedirect()) { // this is a legitimate offer... start parsing it!
                    return that.lookForForms.call(that);
                }

                // it's a redirect... do some waiting

                // DEBUG
                if (true === that.isDebugging()) {
                    alert('interpreted as redirect');
                }
                // END DEBUG
            });
        };
    }, {
        _static: true,
        /**
         * If multiple visible forms on the page, find out which one is the best one
         */
        getTheRightForm: function (formEls) {
            /**
             * Sort the forms by name input count
             * NOTE - this doesn't seem like the right criteria to go by!
             */
            function getTheRightFormByNameCount () {
                var mostNameElsCount = 0,
                    mostNameElsForm  = formEls.eq(0); // just a default

                formEls.each(function () {
                    var el = $(this),
                        nameElsCount = el.find('[name]').not('[type="hidden"]');

                    if (nameElsCount > mostNameElsCount) {
                        mostNameElsCount = nameElsCount;
                        mostNameElsForm = el;
                    }
                });

                return mostNameElsForm;
            }

            /**
             * Sort the forms by square pixelage
             */
            function getTheRightFormByPixelCount () {
                var mostPixelsCount  = 0,
                    mostPixelsElForm = formEls.eq(0); // just a default

                formEls.each(function () {
                    var el = $(this),
                        pixelCount = el.width() * el.height();

                    if (0 === pixelCount) {
                        pixelCount = el.width() || el.height();
                    }

                    if (pixelCount > mostPixelsCount) {
                        mostPixelsCount  = pixelCount;
                        mostPixelsElForm = el;
                    }
                });

                return mostPixelsElForm;
            }

            return getTheRightFormByPixelCount();
//            return getTheRightFormByNameCount();
        },
        /**
         * Go by some criteria for seeing if an offer has expired or is unavailable
         * @param {Boolean} getIdxBool fetch index of expired string occurrence for seemsLikeARedirect to utilize
         * @return {Boolean|Number}
         * TODO - time to do a loop and make a config file of all the expired keywords!!
         */
        seemsLikeOfferExpired: function (getIdxBool) {
            getIdxBool = $$.util.isBool(getIdxBool)
                ? getIdxBool
                : false;

            var body = $('body'),
                bodyText = $.trim(body.text()).toLowerCase(),
                isExpiredBool;

            if (body.find('*').length > 25) {  // if there's more than 25 elements, then there's GOTTA be some pertinent info on here...
                return false;
            }

            isExpiredBool = (
                 $.trim(bodyText) === '' ||
                 body.find('*').length === 0 ||
                 bodyText.indexOf('expir') !== -1 ||
                 bodyText.indexOf('no longer') !== -1 ||
                 bodyText.indexOf('reached its cap')

            ) &&
                 body.clone().find('script').remove().end().html().length < 2500;  // the body html length must be under 2500 characters because some pages can say "no longer" and still be valid??...

            if (false === getIdxBool) {
                return isExpiredBool;
            } else if (false === isExpiredBool) {
                return -1;
            } else if (true === isExpiredBool) {
                return bodyText.indexOf('expir') !== -1
                    ? bodyText.indexOf('expir')
                    : bodyText.indexOf('no longer') !== -1
                        ? bodyText.indexOf('no longer')
                        : bodyText.indexOf('reached its cap') !== -1
                            ? bodyText.indexOf('reached its cap')
                            : -1;
            }
        },

        /**
         * Offers seem to go through a bunch of redirects before
         * they actually go to the main page.
         * This method checks for a meta refresh tag somewhere
         * TODO - what if there is no meta refresh and it still is a redirect page and assumes user has JS enabled?
         * TODO - if there is a meta refresh tag, check for the content (seconds before redirect)... there are valid redirect pages that may need to get clickArounds to speed things up!
         */
        seemsLikeARedirect: function () {
            var redirectBool = ($('meta[http-equiv="refresh"]').length > 0),
                redirectStrIdxNum,
                expiredStrIdxNum;

            if (false === redirectBool) {
                $('noscript').each(function () {
                    var el = $(this),
                        elTxtStr = el.text().toLowerCase();
                    if (elTxtStr.indexOf('http-equiv') !== -1 &&
                        elTxtStr.toLowerCase().indexOf('refresh') !== -1
                    ) {

                        redirectStrIdxNum = (elTxtStr.indexOf('refresh') !== -1)
                                    ? elTxtStr.indexOf('refresh')
                                    : elTxtStr.indexOf('redirect');

                        redirectBool = true;
                        // break out of the loop
                        return false;
                    }
                });

                // check for a single anchor tag which has refresh-like language in the text
                if (false === redirectBool) {
                    if ($('a').length <= 2) {
                        $('a').each(function () {
                            var el = $(this),
                                elTxtStr = el.text().toLowerCase();;
                            if (elTxtStr.indexOf('refresh')  !== -1 ||
                                elTxtStr.indexOf('redirect') !== -1
                            ) {

                                redirectStrIdxNum = (elTxtStr.indexOf('refresh') !== -1)
                                    ? elTxtStr.indexOf('refresh')
                                    : elTxtStr.indexOf('redirect');

                                redirectBool = true;
                                // break out of loop
                                return false;
                            }
                        });
                    }
                }
            }

            return redirectBool;
        }
    });
}());