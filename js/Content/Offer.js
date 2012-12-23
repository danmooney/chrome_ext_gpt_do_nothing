(function() {
    'use strict';
    $$.klass(function Offer () {
        var offer,
            forms = [];

        this.parseOffer = function () {
            forms = $('GptOfferForm').evaluateForms();

            if (forms.length === 0) { // hmm... click in random places???
                alert('Absolutely... NO FORMS!')
            } else {
                alert(forms.length);
            }
        };

        this.start = function () {
            var that = this;
            $$('Storage').getItem('currentOffer', function (offerObj) {
                offer = offerObj;
                if (true === that.seemsLikeARedirect()) {
                    // just wait it out until it does redirect
                    return;
                } else if (true === that.seemsLikeOfferExpired()) { // go to next offer
                    $$('Storage').getItem('currentGptTabId', function (gptTabId) {
                        $$('Message').sendMessage({
                            klass: 'Message',
                            method: 'sendMessage',
                            args: [
                                {
                                    klass: 'GptSiteOffer',
                                    method: 'offerExpired',
                                    tabId: gptTabId
                                }
                            ]
                        })
                    });
                } else { // this is a legitimate offer
                    that.parseOffer.call(that);
                }
            });
        };
    }, {
        _static: true,
        seemsLikeOfferExpired: function () {
            var body = $('body'),
                bodyText = $.trim(body.text());
            if (body.children().length > 0) {
                return false;
            }

            if (bodyText === '' ||
                bodyText.toLowerCase().indexOf('expir') !== -1 ||
                bodyText.toLowerCase().indexOf('no longer ') !== -1 ||
                body.html().length < 2500
            ) {
                return true;
            }
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