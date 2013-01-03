(function() {
    'use strict';

    $$.klass(function GptSiteOffer () {
        var currentSiteOffer = {},
            // TODO - need to be able to stop timer if page is loading/redirecting???????????
            minTimeLimitToComplete = /*50*/ 9999 * 1000, // 50 seconds
            timeLimitToComplete = 2 * 60 * 1000, // 2 minutes by default, will be gauged and overwritten based on price
            offerTimeout;

        this.setSiteOfferTimeout = function () {
            var that = this;
            offerTimeout = setTimeout(function () {
                that.offerTimedOut();
            }, this.getTimeLimitToComplete());
        };

        this.clearSiteOfferTimeout = function () {
            clearTimeout(offerTimeout);
        };

        this.getTimeLimitToComplete = function () {
            return timeLimitToComplete;
        };

        /**
         * Calculate time limit on offer based on its price
         */
        this.calculateAndSetTimeLimitToComplete = function (offer) {
            offer = offer || this.getCurrentSiteOffer();

            var price = parseFloat(/[\.]?[\d]+/.exec(offer.price)[0]),  // gets any decimal/digit combo from the unsanitized string
                priceTimeMultiplier = .12, // so $1.00 will take 120 seconds, $.50 will take 60 seconds
                calculatedTimeLimit; // in milliseconds

            calculatedTimeLimit = (price * priceTimeMultiplier * 1000);

            // check if calculated is less than minimum time limit to complete
            if (calculatedTimeLimit < minTimeLimitToComplete) {
                calculatedTimeLimit = minTimeLimitToComplete;
            }
            console.warn('setting time to complete to ' + calculatedTimeLimit);
            timeLimitToComplete = calculatedTimeLimit;
        };

        this.setCurrentSiteOffer = function (offerObj) {
            currentSiteOffer = offerObj;
        };

        this.getCurrentSiteOffer = function () {
            return currentSiteOffer;
        };
    }, {
        _static: true,
        /**
         * Spent maximum amount of time on offer.
         * Close all tabs except for GPT Site tab id and
         * work on next offer.
         */
        offerTimedOut: function (offer) {
            offer = offer || this.getCurrentSiteOffer();

            var that = this;

            $$('Message').sendMessage({
                klass: 'Window',
                method: 'removeAllTabsInWindowExceptGptTab'
            }, function () {
                that.submitSiteOffer(offer);
            });
        },
        /**
         * Callback when offer completes, which happens only when offer times out.
         * Hits the submit button on the offer
         */
        submitSiteOffer: function (offer) {
            offer = offer || this.getCurrentSiteOffer();
            $$('Storage').setItem('currentGptRedirectUrl', window.location.href, function () {
                offer.formEl.submit();
            });
        },

        skipSiteOffer: function (submitBool) {
            this.clearSiteOfferTimeout();

            var that = this;

            $$('Message').sendMessage({
                klass: 'Window',
                method: 'removeAllTabsInWindowExceptGptTab'
            }, function () {
                if (true === submitBool) {
                    that.submitSiteOffer();
                } else {
                    that.trigger('OFFER_DONE');
                }
            });
        },

        /**
         * Site Offer expired (or done... TODO - maybe refactor method name??)
         * @return {*}
         */
        siteOfferExpired: function () {
            alert('OFFER EXPIRED');
            return this.skipSiteOffer(true);  // just submit the stupid thing so it won't appear on the list
        },

        /**
         * @param {Object} offer
         */
        completeSiteOffer: function (offer) {
            offer = offer || this.getCurrentSiteOffer();

            if (!offer) {
                alert('NO offer exists in completeOffer??');
                return $$('GptSite').goToNextPage();
            }

            var Storage = $$('Storage'),
                Message = $$('Message'),
                tabData = {},
                linkEl = offer.linkEl,
                href,
                hasOnClick,
                that = this;

            if (!linkEl) {
                this.skipSiteOffer(false);
            }

            href = linkEl.attr('href');

            if (!href) {
                this.skipSiteOffer(false);
            }

            hasOnClick = $$.util.isString(linkEl.attr('onclick'));
            if (true === hasOnClick) {
                linkEl.trigger('click');
            }

            this.calculateAndSetTimeLimitToComplete();

            Storage.getItem('currentGptWindowId', function (windowId) {
                tabData.windowId = windowId;
                tabData.url = href;
                tabData.active = true;

                // open new tab, and set offerTab in storage
                Message.sendMessage({
                    klass: 'Tab',
                    method: 'createNewTab',
                    args: [tabData]
                }, function (tab) {
                    Storage.setItem('offerTab', tab, function () {
                        that.setSiteOfferTimeout();
                    });
                });
            });
        },
        /**
         * Iterate through filtered offers and async call nextOffer when offer
         * is done through timeout
         * @param {Array} offers
         */
        completeSiteOffers: function (offers) {
            var that = this,
                i = 0;

            if (offers.length === 0) {
                $$('GptSite').goToNextPage();
            }

            function storeSiteOffer (offer, callback) {
                that.setCurrentSiteOffer(offer);
                $$('Storage').setItem('currentOffer', offer, function () {
                    callback.call(that);
                });
            }

            // TODO - This will never be executed unless filtered offer is skipped, because the submit will force a page refresh and all will be lost!
            this.listen('OFFER_DONE', function nextOffer () {
                i += 1;

                if (i === offers.length) {
                    $$('GptSite').goToNextPage();
                } else {
                    storeSiteOffer(offers[i], that.completeSiteOffer);
                }
            });


            storeSiteOffer(offers[i], that.completeSiteOffer);
        }
    });
}());