(function() {
    'use strict';

    $$.klass(function GptSiteOffer () {
        var currentOffer = {},
        // TODO - need to be able to stop timer if page is loading???????????
            minTimeLimitToComplete = 20 * 1000,
            timeLimitToComplete = 2 * 60 * 1000; // 2 minutes by default, will be gauged by price

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
         * TODO
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
        submitOffer: function (offer) {
            offer = offer || this.getCurrentOffer();
        },
        offerDone: function () {
            console.warn('OFFER DONE');
            console.log(this.getCurrentOffer());
            this.trigger('OFFER_DONE');
        },
        /**
         * TODO - set Timeout limit per offer
         * @param {Object} offer
         */
        completeOffer: function (offer) {
            offer = offer || this.getCurrentOffer();
            var Storage = $$('Storage'),
                Message = $$('Message'),
                tabData = {},
                linkEl = offer.linkEl,
                href,
                hasOnClick,
                that = this;

            if (!linkEl) {
                this.offerDone();
            }

            href = linkEl.attr('href');

            if (!href) {
                this.offerDone();
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
                        setTimeout(function () {
                            that.offerTimedOut.call(that);
                        },  that.getTimeLimitToComplete());
                    });
                });

            });
        },
        /**
         * Iterate through offers and async call nextOffer when offer
         * is done through timeout
         * @param {Array} offers
         */
        completeOffers: function (offers) {
            var that = this,
                i = 0;

            function storeOffer (offer, callback) {
                that.setCurrentOffer(offer);
                $$('Storage').setItem('currentOffer', offer, function () {
                    callback.call(that);
                })
            }

            this.listen('OFFER_DONE', function nextOffer () {
                i += 1;

                storeOffer(offers[i], that.completeOffer);
            });


            storeOffer(offers[i], that.completeOffer);
        }
    });
}());