/**
 * Url Helper
 */
(function() {
    $$.klass(function Url () {
        this.startingUrlArr = [
            'http://www.treasuretrooper.com/members/earn/offers'
        ];
        this.currentUrlStr = '';
    }, {
        _static: true,
        init: function () {

        },
        /**
         * Return current url or url nested in optional tab argument
         * @param {Tab} tab
         * @return {String}
         */
        getUrl: function (tab) {
            if (!tab) {
                return this.getCurrentUrl();
            }
            return tab.url;
        },

        /**
         * @return {String}
         */
        getCurrentUrl: function () {
            return this.currentUrlStr;
        },

        /**
         * @param {Tab} tab
         * @return {String}
         */
        setCurrentUrl: function (tab) {
            this.currentUrlStr = tab.url;
        },

        /**
         * Checks to see if url is contained within
         *   the startingUrlArr
         * @param {String} url
         * @return {Boolean}
         */
        isStartingUrl: function (url) {
            url = url || this.getCurrentUrl();
            for (var i in this.startingUrlArr) {
                if (!this.startingUrlArr.hasOwnProperty(i)) {
                    continue;
                }
                if (url.indexOf(this.startingUrlArr[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }
    }, {
        _static: true
    });
}());
