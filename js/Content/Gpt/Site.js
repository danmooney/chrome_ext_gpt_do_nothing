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
                    alert('ready, freddy!');
                    console.warn(currentGptUrlObj);
                    that.ready();
                });
            });
        };

        /**
         * Go through offers list
         */
        this.ready = function () {
            var navigation = this.currentGptUrlObj.navigation;
            $(navigation.offerSelectorStr).each(function () {
                console.log($(this));
                $(this).css('background', 'red');
            });
        };
    });
}());