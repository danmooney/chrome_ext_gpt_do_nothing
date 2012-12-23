(function() {
    'use strict';
    $$.klass(function GptSite () {
        var offers = [];

        this.setOffers = function (offersArr) {
            offers = offersArr;
        };

        this.getOffers = function () {
            return offers;
        };

        /**
         * @type {String}
         */
        this.currentGptKlassStr = '';

        /**
         * @type {Object}
         */
        this.currentGptUrlObj = {};

        /**
         * Gather information and trigger on ready
         */
        this.start = function () {
            var Gpt = $$('Gpt'),
                Navigation = $$('GptSiteNavigation'),
                Language = $$('GptSiteLanguage'),
                that = this;

            function composeSubclasses () {
                console.warn('in composeSubclasses');
                console.warn(that.currentGptUrlObj.navigation);
                Navigation.setNavigation(that.currentGptUrlObj.navigation);
                Language.setLanguage(that.currentGptUrlObj.language);
            }

            Gpt.getCurrentGptKlass(function (currentGptKlassStr) {
                that.currentGptKlassStr = currentGptKlassStr;
                Gpt.getCurrentGptUrlObjIdxNum(function (currentGptUrlObjIdxNum) {
                    that.currentGptUrlObj = $$(currentGptKlassStr).urlArr[currentGptUrlObjIdxNum];
                    composeSubclasses();
                    console.warn(that.currentGptUrlObj);
                    // setTimeout is purely a debug
                    setTimeout(function () {
                        that.trigger('GPT_SITE_READY');
                    }, 5000);
                });
            });
        };
    }, {
        _static: true,
        init: function () {
            this.listen('GPT_SITE_DONE_NAVIGATING', this.filterOffers);
            this.listen('GPT_SITE_DONE_FILTERING', function () {
                var Navigation = $$('GptSiteNavigation'),
                    Offer = $$('GptSiteOffer'),
                    offers = this.getOffers();

                Navigation.colorOffers(offers);
                Offer.completeOffers(offers);
            });
        },
        /**
         * Hit the next button
         */
        goToNextPage: function () {
            var navigation = $$('GptSiteNavigation').getNavigation(),
                nextBtnEl = $(navigation.nextBtnSelectorStr);

            // if no navigation button
            if (nextBtnEl.length === 0) {
                $$('Message').sendMessage({
                    klass: 'App',
                    method: 'stopWorking',
                    args: [
                        'notificationAppStoppedReasonDone'
                    ]
                });
            } else {
                nextBtnEl.trigger('click').submit();
            }
        },
        filterOffers: function () {
            var Language = $$('GptSiteLanguage'),
                offers = this.getOffers(),
                filteredOffers = [],
                filteredOffersLength,
                isAllowedBool,
                i;

            // filter based on filterCallback in GPT object
            if ($$.util.isFunc(this.currentGptUrlObj.filterCallback)) {
                for (i = 0; i < offers.length; i += 1) {
                    isAllowedBool = this.currentGptUrlObj.filterCallback(offers[i]);

                    if (true === isAllowedBool) {
                        filteredOffers.push(offers[i]);
                    }
                }
            }

            filteredOffersLength = filteredOffers.length;

            // Filter based on Language white/blacklist of GPT Object
            for (i = 0; i < filteredOffersLength; i += 1) {
                isAllowedBool = Language.filter(offers[i]);

                if (false === isAllowedBool) {
                    filteredOffers[i] = null;
                }
            }

            filteredOffers = filteredOffers.filter(function (element) {
                return element;
            });

            this.setOffers(filteredOffers);
            console.warn('filteredOffersArr');
            console.log(filteredOffers);
            this.trigger('GPT_SITE_DONE_FILTERING');
        }
    });
}());