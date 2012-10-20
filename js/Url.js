/**
 * Url Helper
 */
(function() {
    'use strict';
    $$.klass(function Url () {
        /**
         * Combined urls of every GPT site
         * @type {Array}
         */
        this.startingUrlArr = [];
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
         * Sets the current Url after a tab onActivated/onUpdated event
         * Everything starts here based on the tab events registered in EvtTab
         * @param {Object|Number} tab data
         * @return {String}
         */
        setCurrentUrl: function (tab) {
            var that = this,
                oldUrlStr = this.getCurrentUrl(),
                tabId = tab.tabId || tab;

            this.getUrl(tab, function (url) {
                console.log('Current URL: ' + url);
                if ((/^http[s]?:/.test(url))) {    // if url matches http/https patern, set currentUrlStr

                }
                that.currentUrlStr = url;
                that.trigger('CURRENT_URL_SET', tabId);
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
            var urlRegExp,
                i;

            for (i in this.startingUrlArr) {
                if (!this.startingUrlArr.hasOwnProperty(i)) {
                    continue;
                }
                urlRegExp = new RegExp(this.startingUrlArr[i]);
                if (url.indexOf(this.startingUrlArr[i]) !== -1 ||
                    urlRegExp.test(url) ||
                    urlRegExp.test(url.replace('www.', ''))
                ) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Add starting url to this.startingUrlArr array
         * // TODO - Enforce array uniqueness!
         * @param {String} urlStr
         */
        addStartingUrl: function (urlStr) {
            this.startingUrlArr.push(urlStr);
        }
    }, {
        _static: true,
        init: function () {
            console.log($$.getApplicationGlobal());
        }
    });
}());
