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
            var Gpt = $$.instance('Gpt'),
                Navigation = $$.instance('GptSiteNavigation'),
                Language = $$.instance('GptSiteLanguage'),
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
                    that.currentGptUrlObj = $$.instance(currentGptKlassStr).urlArr[currentGptUrlObjIdxNum];
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
                var Navigation = $$.instance('GptSiteNavigation');
                Navigation.colorOffers(this.getOffers());
            });
        },
        filterOffers: function () {
            var Language = $$.instance('GptSiteLanguage'),
                offers = this.getOffers(),
                filteredOffers = [],
                filteredOfferLength = 0,
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

            filteredOfferLength = filteredOffers.length;

            // Filter based on Language white/blacklist of GPT Object
            for (i = 0; i < filteredOfferLength; i += 1) {
                isAllowedBool = Language.filter(filteredOffers[i]);

                if (false === isAllowedBool) {
                    filteredOffers.splice(i, 1);
                }
            }

            this.setOffers(filteredOffers);
            console.warn('filteredOffersArr');
            console.log(filteredOffers);
            this.trigger('GPT_SITE_DONE_FILTERING');
        }
    });
}());