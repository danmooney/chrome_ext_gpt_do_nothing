(function() {
    'use strict';
    $$.klass(function GptSite () {
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
                that = this;
            Gpt.getCurrentGptKlass(function (currentGptKlassStr) {
                that.currentGptKlassStr = currentGptKlassStr;
                Gpt.getCurrentGptUrlObj(function (currentGptUrlObj) {
                    that.currentGptUrlObj = currentGptUrlObj;
                    console.warn(currentGptUrlObj);
                    that.navigateSite();
                });
            });
        };

        /**
         * Go through offers list
         */
        this.navigateSite = function () {
            var navigation = this.currentGptUrlObj.navigation,
                offerEls = $(navigation.offerSelectorStr);

            offerEls.each(function () {
                console.log($(this));
                $(this).css('background', 'red');
            });
            offerEls.find(navigation.nameSelectorStr).each(function () {
                console.log($(this));
                $(this).css('background', 'orange');
            });
            offerEls.find(navigation.descriptionSelectorStr).each(function () {
                console.log($(this));
                $(this).css('background', 'yellow');
            });
            offerEls.find(navigation.priceSelectorStr).each(function () {
                console.log($(this));
                $(this).css('background', 'green');
            });
            offerEls.find(navigation.doneSelectorStr).each(function () {
                console.log($(this));
                $(this).css('background', 'pink');
            });
            $(navigation.nextBtnSelectorStr).each(function () {
                console.log($(this));
                $(this).css('background', 'blue');
            });
        };
    });
}());