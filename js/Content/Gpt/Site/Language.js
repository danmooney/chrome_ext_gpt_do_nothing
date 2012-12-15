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
                whitelistLen    = whitelistArr.length,
                blacklistArr    = language.blacklistArr || [],
                blacklistLen    = blacklistArr.length,
                descriptionStr  = offer.description     || '',
                allowedBool,
                i;

            function parseDescription (description) {
                var regexp;
                for (i = 0; i < blacklistLen; i += 1) {
                    regexp = new RegExp(blacklistArr[i], 'i');
                    if (true === regexp.test(description)) {
                        return false;
                    }
                }

                for (i = 0; i < whitelistLen; i += 1) {
                    regexp = new RegExp(whitelistArr[i], 'i');
                    if (false === regexp.test(description)) {
                        return false;
                    }
                }

                return true;
            }

            allowedBool = parseDescription(descriptionStr);
            return allowedBool;
        }
    });
}());