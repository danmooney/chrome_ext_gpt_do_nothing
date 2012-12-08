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
            this.colorOffers(); // debug

            var Site = $$.instance('GptSite'),
                offersArr = [],
                navigation = this.getNavigation(),
                offerEls = $(navigation.offerSelectorStr);

            console.warn(navigation);

            function setupOffer (offerEl) {
                var newOffer = {};
                newOffer.title = $.trim(offerEl.find(navigation.nameSelectorStr).text());
                newOffer.description = $.trim(offerEl.find(navigation.descriptionSelectorStr).text());
                newOffer.price = $.trim(offerEl.find(navigation.priceSelectorStr).text());

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
         * Used purely as a debug to make sure jQuery selectors are proper
         */
        colorOffers: function () {
            var navigation = this.getNavigation(),
                offerEls = $(navigation.offerSelectorStr);

            offerEls.css('background', 'red');
            offerEls.find(navigation.nameSelectorStr).each(function () {
                $(this).css('background', 'orange');
            });
            offerEls.find(navigation.descriptionSelectorStr).each(function () {
                $(this).css('background', 'yellow');
            });
            offerEls.find(navigation.priceSelectorStr).each(function () {
                $(this).css('background', 'green');
            });
            offerEls.find(navigation.doneSelectorStr).each(function () {
                $(this).css('background', 'pink');
            });
            $(navigation.nextBtnSelectorStr).each(function () {
                $(this).css('background', 'blue');
            });
        }
    });
}());