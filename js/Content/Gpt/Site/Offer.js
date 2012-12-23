(function() {
    'use strict';

    $$.klass(function GptSiteOffer () {
        var currentOffer = {},
        // TODO - need to be able to stop timer if page is loading/redirecting???????????
            minTimeLimitToComplete = 50 * 1000,
            timeLimitToComplete = 2 * 60 * 1000, // 2 minutes by default, will be gauged by price
            offerTimeout;

        this.setOfferTimeout = function () {
            var that = this;
            offerTimeout = setTimeout(function () {
                that.offerTimedOut();
            }, this.getTimeLimitToComplete());
        };

        this.clearOfferTimeout = function () {
            clearTimeout(offerTimeout);
        };

        this.getTimeLimitToComplete = function () {
            return timeLimitToComplete;
        };

        /**
         * Calculate time limit on offer based on its price
         */
        this.calculateAndSetTimeLimitToComplete = function (offer) {
            offer = offer || this.getCurrentOffer();

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

        this.setCurrentOffer = function (offerObj) {
            currentOffer = offerObj;
        };

        this.getCurrentOffer = function () {
            return currentOffer;
        };
    }, {
        _static: true,
        /**
         * Spent maximum amount of time on offer.
         * Close all tabs except for GPT Site tab id and
         * work on next offer.
         */
        offerTimedOut: function (offer) {
            offer = offer || this.getCurrentOffer();

            var that = this;

            $$('Message').sendMessage({
                klass: 'Window',
                method: 'removeAllTabsInWindowExceptGptTab'
            }, function () {
                that.offerDone();
            });
        },
        /**
         * Hit the submit button on the offer
         */
        submitOffer: function (offer, callback) {
            offer = offer || this.getCurrentOffer();
            $$('Storage').setItem('currentGptRedirectUrl', window.location.href, function () {
                offer.formEl.submit();
            });
        },

        /**
         * Callback when offer completes.  This is only when offer times out
         */
        offerDone: function () {
            this.submitOffer();
        },

        offerSkip: function () {
            this.clearOfferTimeout();

            var that = this;

            $$('Message').sendMessage({
                klass: 'Window',
                method: 'removeAllTabsInWindowExceptGptTab'
            }, function () {
                that.trigger('OFFER_DONE')
            });
        },

        offerExpired: function () {
            alert('OFFER EXPIRED');
//            return this.offerSkip();
            return this.offerTimedOut();  // just submit the stupid thing so it won't appear on the list
        },

        /**
         * @param {Object} offer
         */
        completeOffer: function (offer) {
            offer = offer || this.getCurrentOffer();

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
                this.offerSkip();
            }

            href = linkEl.attr('href');

            if (!href) {
                this.offerSkip();
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
                        that.setOfferTimeout();
                    });
                });
            });
        },
        /**
         * Iterate through filtered offers and async call nextOffer when offer
         * is done through timeout
         * @param {Array} offers
         */
        completeOffers: function (offers) {
            var that = this,
                i = 0;

            if (offers.length === 0) {
                $$('GptSite').goToNextPage();
            }

            function storeOffer (offer, callback) {
                that.setCurrentOffer(offer);
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
                    storeOffer(offers[i], that.completeOffer);
                }
            });


            storeOffer(offers[i], that.completeOffer);
        }
    });
}());