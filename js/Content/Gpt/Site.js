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
         * Gather information
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
                Gpt.getCurrentGptUrlObj(function (currentGptUrlObj) {
                    that.currentGptUrlObj = currentGptUrlObj;
                    composeSubclasses();
                    console.warn(currentGptUrlObj);
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
        },
        filterOffers: function () {
            var Language = $$.instance('GptSiteLanguage'),
                offers = this.getOffers(),
                filteredOffers = [],
                isAllowedBool,
                i;

            if ($$.util.isFunc(this.currentGptUrlObj.filterCallback)) {
                for (i = 0; i < offers.length; i += 1) {
                    isAllowedBool = this.currentGptUrlObj.filterCallback(offers[i]);

                    if (true === isAllowedBool) {
                        filteredOffers.push(offers[i]);
                    }
                }
            }

            for (i = 0; i < offers.length; i += 1) {
                isAllowedBool = Language.filter(offers[i]);
                if (true === isAllowedBool) {
                    filteredOffers.push(offers[i]);
                }
            }

            this.setOffers(filteredOffers);
            console.warn('filteredOffersArr');
            console.log(filteredOffers);
        }
    });
}());