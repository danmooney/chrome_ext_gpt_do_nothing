/**
 * Url Helper
 */
(function() {
    'use strict';
    $$.klass(function Url () {

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
        getUrlFromTab: function (tab, callback) {
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

            this.getUrlFromTab(tab, function (url) {
                console.log('Current URL: ' + url);
                that.currentUrlStr = url;
                that.trigger('CURRENT_URL_SET', tabId);
            });
        },

        /**
         * Checks to see if url is contained within
         *   the startingUrlArr
         * @param {String} url
         * @param {Function} url
         * @return {Boolean}
         */
        isStartingUrl: function (url, callback) {
            url = url || this.getCurrentUrl();
            var that = this,
                i;

            this.fetchStartingUrlsObj(function (startingUrlsObj) {
                var startingUrlsArr,
                    startingUrlObj,
                    urlStr,
                    urlRegExp,
                    j;

                for (i in startingUrlsObj) {
                    if (!startingUrlsObj.hasOwnProperty(i)) {
                        continue;
                    }
                    startingUrlsArr = startingUrlsObj[i];

                    if (startingUrlsArr.length === 0) {
                        continue;
                    }

                    for (j in startingUrlsArr) {
                        if (!startingUrlsArr.hasOwnProperty(j)) {
                            continue;
                        }
                        startingUrlObj = startingUrlsArr[j];

                        urlStr = startingUrlObj.url;
                        urlRegExp = new RegExp(urlStr);
                        if (url.indexOf(urlStr) !== -1 ||
                            urlRegExp.test(url) ||
                            urlRegExp.test(url.replace('www.', ''))
                        ) {
                            that.trigger('GPT_KLASS_CHANGED', i);
                            return callback(true);
                        }
                    }

                }
                return callback(false);
            });
        },

        fetchStartingUrlsObj: function (callback) {
            var Storage = $$.instance('Storage');
            return Storage.getItem('startingUrls', callback);
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
