(function() {
    'use strict';
    $$.klass(function GptSiteLanguage () {
        var language = {};

        this.setLanguage = function (languageObj) {
            language = languageObj;
        };

        this.getLanguage = function () {
            return language;
        };
    }, {
        _static: true,
        /**
         * Check if offer is valid based on language
         *
         * @param {Object} offer
         * @return {Boolean}
         */
        filter: function (offer) {
            var language        = this.getLanguage(),
                whitelistArr    = language.whitelistArr || [],
                blacklistArr    = language.blacklistArr || [],
                descriptionStr  = offer.description     || '';

            function parseDescription (description) {

            }

            parseDescription(descriptionStr);
            return true;
        }

    });
}());