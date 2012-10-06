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
         * @param {*} tab
         * @param {Function} callback
         * @return {String}
         */
        getUrl: function (tab, callback) {
            return $$.instance('Tab').getTabUrl(tab, callback);
        },

        /**
         * @return {String}
         */
        getCurrentUrl: function () {
            return this.currentUrlStr;
        },

        /**
         * @param {Object} tab data
         * @return {String}
         */
        setCurrentUrl: function (tab) {
            var that = this;
            this.getUrl(tab, function (url) {
                that.currentUrlStr = url;
                that.trigger('CURRENT_URL_SET', tab.tabId);
            });
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
