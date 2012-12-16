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



            this.trigger('OFFER_DONE');
        },
        /**
         * Hit the submit button on the offer
         */
        submitOffer: function (offer) {
            offer = offer || this.getCurrentOffer();

        },
        offerDone: function () {
            this.trigger('OFFER_DONE');
        },
        /**
         * TODO - set Timeout limit per offer
         * @param {Object} offer
         */
        completeOffer: function (offer) {
            this.setCurrentOffer(offer);

            var Storage = $$('Storage'),
                Message = $$('Message'),
                tabData = {},
                linkEl = offer.linkEl,
                href,
                hasOnClick;

            if (!linkEl) {
                this.offerDone();
            }

            href = linkEl.attr('href');

            if (!href) {
                this.offerDone();
            }

            hasOnClick = linkEl.attr('onclick');
            if (true === hasOnClick) {
                linkEl.trigger('click');
            }

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

            setTimeout(this.offerTimedOut, this.getTimeLimitToComplete());
        },
        /**
         * @param {Array} offers
         */
        completeOffers: function (offers) {
            var that = this,
                i = 0;

            this.listen('OFFER_DONE', function () {
                i += 1;
                that.completeOffer(offers[i]);
            });

            this.completeOffer(offers[i]);
        }
    });
}());