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
            forms;

        this.parseOffer = function () {
            var that = this;

            $$('GptOfferForm').evaluateForms(function (formEls) {
                forms = formEls;
                $$('GptOfferForm').setFormInfo(null, function () {
                    var form,
                        inputEls;

                    if (formEls.length === 0) {
                        alert('Form length: ' + formEls.length);

                        inputEls = $$('GptOfferForm').evaluateFormInputs();

                        if (inputEls.length > 0) {
                            $$('GptOfferForm').fillOutForm();
                        } else {
                            // click in random places
                            $$('GptOfferForm').clickAround();
                        }
                    } else {
                        if (formEls.length === 1) {
                            form = formEls.eq(0);
                        } else {
                            // find out which one to evalute
                            form = that.getTheRightForm(formEls);
                        }

                        $$('GptOfferForm').setFormString(form.serialize(), function () {
                            $$('GptOfferForm').fillOutForm(form);
                        });
                    }
                });
            });
        };

        /**
         * Offer isn't worth pursuing, do the next one
         */
        this.skipOffer = function () {
            console.log($('body').html());
            alert('skipping offer');
            $$('Storage').getItem('currentGptTabId', function (gptTabId) {
                $$('Message').sendMessage({
                    klass: 'Message',
                    method: 'sendMessage',
                    args: [
                        {
                            klass: 'GptSiteOffer',
                            method: 'offerExpired',
                            tabId: gptTabId,
                            args: [
                                true // submitBool
                            ]
                        }
                    ]
                })
            });
        };

        this.start = function () {
            var that = this;
            $$('Storage').getItem('currentOffer', function (offerObj) {
                offer = offerObj;
                if (true === that.seemsLikeOfferExpired()) {
                    that.skipOffer();
                } else if (true === that.seemsLikeARedirect()) { // go to next offer
                    // just wait it out until it does redirect
                    return;
                } else { // this is a legitimate offer... start parsing it!
                    that.parseOffer.call(that);
                }
            });
        };
    }, {
        _static: true,
        /**
         * If multiple visible forms on the page, find out which one is the best one
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