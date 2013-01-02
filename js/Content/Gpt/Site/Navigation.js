(function() {
    'use strict';
    $$.klass(function GptSiteNavigation () {
        var navigation = {};

        this.setNavigation = function (navigationObj) {
            navigation = navigationObj;
        };

        this.getNavigation = function () {
            return navigation;
        };

    }, {
        _static: true,
        init: function () {
            this.listen('GPT_SITE_READY', this.navigateSite);
        },
        /**
         * Go through offers list
         */
        navigateSite: function () {
            var Site = $$('GptSite'),
                offersArr = [],
                navigation = this.getNavigation(),
                offerEls = $(navigation.offerSelectorStr);

            console.warn(navigation);

            function setupOffer (offerEl) {
                var newOffer = {};
                newOffer.title = $.trim(offerEl.find(navigation.nameSelectorStr).text());
                newOffer.description = $.trim(offerEl.find(navigation.descriptionSelectorStr).text());
                newOffer.price = $.trim(offerEl.find(navigation.priceSelectorStr).text());

                newOffer.linkEl = offerEl.find('a[target="_blank"]');

                newOffer.offerEl = offerEl;
//                newOffer.priceEl = offerEl.find(navigation.priceSelectorStr);
                newOffer.doneEl = offerEl.find(navigation.doneSelectorStr);

                if (newOffer.doneEl.attr('type') === 'submit') {
                    newOffer.formEl = newOffer.doneEl.closest('form');
                }

                offersArr.push(newOffer);
            }

            offerEls.each(function () {
                var el = $(this);
                setupOffer(el);
            });

            console.warn('offersArr');
            console.log(offersArr);

            Site.setOffers(offersArr);
            this.trigger('GPT_SITE_DONE_NAVIGATING');
        },

        /**
         * Used purely as a DEBUG to make sure jQuery selectors are proper
         */
        colorOffers: function (offersArr) {
            var navigation = this.getNavigation(),
                offerEls = [],
                i;

            if ($$.util.isArray(offersArr)) {
                for (i = 0; i < offersArr.length; i += 1) {
                    offerEls.push(offersArr[i].offerEl[0]);
                }
                offerEls = $(offerEls);
            } else {
                offerEls = $(navigation.offerSelectorStr);
            }

            function colorOffers () {
                offerEls.css('background', 'red');
                offerEls.find(navigation.nameSelectorStr).css('background', 'orange');
                offerEls.find(navigation.descriptionSelectorStr).css('background', 'yellow');
                offerEls.find(navigation.priceSelectorStr).css('background', 'green');
                offerEls.find(navigation.doneSelectorStr).css('background', 'pink');
                $(navigation.nextBtnSelectorStr).css('background', 'blue');
            }

            colorOffers();
        }
    });
}());