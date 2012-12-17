(function() {
    'use strict';
    $$.klass(function GptSiteOffer () {
        var currentOffer = {},
            timeLimitToComplete = 2 * 60 * 1000; // 2 minutes

        this.getTimeLimitToComplete = function () {
            return timeLimitToComplete;
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

            Storage.getItem('currentGptWindowId', function (windowId) {
                tabData.windowId = windowId;
                tabData.url = href;
                tabData.active = true;

//            Storage.setItem({
//
//            });
                Message.sendMessage({
                    klass: 'Tab',
                    method: 'createNewTab',
                    args: [tabData]
                });

                setTimeout(function () {
                    that.offerTimedOut.call(that);
                },  that.getTimeLimitToComplete());
            });
        },
        /**
         * @param {Array} offers
         */
        completeOffers: function (offers) {
            var that = this,
                i = 0;

            function storeOffer (offer, callback) {
                that.setCurrentOffer(offer);
                $$('Storage').setItem({
                    currentOffer: offer
                }, function () {
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