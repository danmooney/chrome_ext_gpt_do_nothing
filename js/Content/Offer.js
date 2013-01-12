(function() {
    'use strict';
    // TODO - serialize form names into JSON and store in Storage so that bot doesn't keep submitting the same form if something goes wrong
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
            debugging = false;


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
         * Parse the offer forms, set the form info and then fill them out
         */
        this.parseOfferForms = function () {
            var that = this;

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
                            $$('OfferForm').clickAround();
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
        this.skipOffer = function () {
            if (true === this.isDebugging()) {
                alert('DONE PARSING OFFER, ABORTING....');
            }

//            console.log($('body').html());

            alert('skipping offer');
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
                                    true // submitBool
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
            // this function MUST NOT be executed more than once!
            this.start = function () {};

            var that = this;

            if (true === debugBool) {
                this.setDebugging(true);
            }

            $$('Storage').getItem('currentOffer', function (offerObj) {
                offer = offerObj;
                if (true === that.seemsLikeOfferExpired()) {
                    that.skipOffer();
                } else if (false === that.seemsLikeARedirect()) { // this is a legitimate offer... start parsing it!
                    that.parseOfferForms.call(that);
                }

            });
        };
    }, {
        _static: true,
        /**
         * If multiple visible forms on the page, find out which one is the best one
         * TODO - sort by square footage!
         */
        getTheRightForm: function (formEls) {
            var mostNameElsCount = 0,
                mostNameElsForm;

            formEls.each(function () {
                var el = $(this),
                    nameElsCount = el.find('[name]').not('[type="hidden"]');

                if (nameElsCount > mostNameElsCount) {
                    mostNameElsCount = nameElsCount;
                    mostNameElsForm = el;
                }
            });

            return mostNameElsForm || formEls.eq(0);
        },
        seemsLikeOfferExpired: function () {
            var body = $('body'),
                bodyText = $.trim(body.text());
            if (body.find('*').length > 25) {
                return false;
            }

            return (
                bodyText === '' ||
                bodyText.toLowerCase().indexOf('expir') !== -1 ||
                bodyText.toLowerCase().indexOf('no longer') !== -1 ||
                body.html().length < 2500
            );
        },

        /**
         * Offers seem to go through a bunch of redirects before
         * they actually go to the main page.
         * This method checks for a meta refresh tag somewhere
         * TODO - what if there is no meta refresh and it still is a redirect page and assumes user has JS enabled?
         */
        seemsLikeARedirect: function () {
            var redirectBool = ($('meta[http-equiv="refresh"]').length > 0);

            if (false === redirectBool) {
                $('noscript').each(function () {
                    var el = $(this);
                    if (el.text().toLowerCase().indexOf('http-equiv') !== -1 &&
                        el.text().toLowerCase().indexOf('refresh') !== -1
                    ) {
                        redirectBool = true;
                        // break out of the loop
                        return false;
                    }
                });

                // check for a single anchor tag which has refresh-like language in the text
                if (false === redirectBool) {
                    if ($('a').length <= 2) {
                        $('a').each(function () {
                            var el = $(this);
                            if (el.text().toLowerCase().indexOf('refresh') !== -1 ||
                                el.text().toLowerCase().indexOf('redirect') !== -1
                            ) {
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