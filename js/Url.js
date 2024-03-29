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
            // TODO - figure out better place to put this!  EDIT: Why is it commented out? - DM - 011312
            this.listen('IS_STARTING_URL', function (gptKlassStr) {
//                var Message = $$('Message');
//                Message.sendMessage({
//                    klass: 'Gpt',
//                    method: 'setCurrentGptKlass',
//                    args: [
//                        gptKlassStr
//                    ]
//                });
            });
        },
        /**
         * Return current url or url nested in optional tab argument
         * @param {*} tab
         * @param {Function} callback
         * @return {String}
         */
        getUrlFromTab: function (tab, callback) {
            return $$('Tab').getTabUrl(tab, callback);
        },

        /**
         * @return {String}
         */
        getCurrentUrl: function () {
            return this.currentUrlStr;
        },

        setCurrentUrl: function (urlStr) {
            this.currentUrlStr = urlStr;
        },

        /**
         * Sets the current Url after a tab onActivated/onUpdated event
         * Everything starts here based on the tab events registered in EvtTab
         * @param {Object|Number} tab data
         * @return {String}
         */
        setCurrentUrlByTab: function (tab) {
            var that = this,
                oldUrlStr = this.getCurrentUrl(),
                tabId = tab.tabId || tab;

            // TODO - THIS IS A DEBUG, REMOVE
            $$('Message').sendMessage({
                klass: 'Debug',
                method: 'setTitleToTabId',
                args: [tabId],
                tabId: tabId
            });

            this.getUrlFromTab(tab, function (urlStr) {
                console.log('Current URL: ' + urlStr);
                if (/^http(s)?:/.test(urlStr) &&
                    urlStr.indexOf('chrome-devtools') === -1 /*&&
                    urlStr.indexOf('chrome://chrome/' === -1)*/
                ) {
                    that.setCurrentUrl(urlStr);
                    that.trigger('CURRENT_URL_SET', tabId);
                } else { // scheme is something like 'chrome://'
//                    console.warn('SETTING STATUS TO NOT READY BECAUSE SCHEME IS NOT HTTP');
                    $$('App').setStatus('NotReady');
                }
            });
        },

        /**
         * Checks to see if url is contained within
         *   the startingUrlArr
         * @param {String} url
         * @param {Function} callback
         * @return {Boolean}
         */
        isStartingUrl: function (url, callback) {
            url = url || this.getCurrentUrl();
            var that = this,
                Message = $$('Message'),
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

                    for (j = 0; j < startingUrlsArr.length; j += 1) {
                        startingUrlObj = startingUrlsArr[j];

                        urlStr = startingUrlObj.url;
                        urlRegExp = new RegExp(urlStr);
                        if (url.indexOf(urlStr) !== -1 ||
                            urlRegExp.test(url) ||
                            urlRegExp.test(url.replace('www.', ''))
                        ) {
                            return callback(true, i, j/*startingUrlObj*/); // can't store functions in local storage!! how fucking absurd!
                        }
                    }

                }
                return callback(false);
            });
        },

        fetchStartingUrlsObj: function (callback) {
            var Storage = $$('Storage');
            return Storage.getItem('startingUrls', callback);
        }
    });
}());
