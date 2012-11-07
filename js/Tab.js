/**
 * Tab Logic
 */
(function() {
    'use strict';
    $$.klass(function Tab () {
        this.currentlySelectedTabId = 0;
    }, {
        _static: true,
        init: function () {
            var that = this;
            this.listen('CURRENT_URL_SET', this.setCurrentlySelectedTabId);
        },
        getCurrentlySelectedTabId: function (callback) {
            if (this.currentlySelectedTabId > 0) {
                return callback(this.currentlySelectedTabId);
            } else {
                chrome.tabs.getSelected(null, function (tab) {
                    return callback(tab.id);
                });
            }
        },
        setCurrentlySelectedTabId: function (tabId) {
            this.currentlySelectedTabId = tabId;
        },
        getTabById: function (tabId, callback) {
            return chrome.tabs.get(tabId, callback);
        },
        getTabUrl: function (tab, callback) {
            var tabId = $$.util.isNumber(tab.tabId)
                ? tab.tabId
                : tab;

            if ($$.util.isDefined(tab.url)) {  // if url already exists, just execute callback
                return callback.call(null, tab.url);
            } else if ($$.util.isNumber(tabId)) {
                return this.getTabById(tabId, function (tab) {
                    return callback.call(null, tab.url);
                });
            } else if ($$.util.isString(tab)) {
                return callback.call(null, tab);
            } else {
                throw new AppTabError('Unable to get tab url from ' + tab);
            }
        },

        /**
         * @param {Number} windowId
         * @param {Function} callback
         */
        getAllTabsByWindowId: function (windowId, callback) {
            chrome.tabs.getAllInWindow(windowId, callback);
        },

        getAllTabsInAllWindows: function (callback) {
            var Window = $$.instance('Window');

            Window.getAllWindowIds(function (windowIdsArr) {
                var allTabsArr = [],
                    i;
                for (i = 0; i < windowIdsArr.length; i += 1) {
                    this.getAllTabsByWindowId(windowIdsArr[i], function (tabsArr) {
                        allTabsArr.push(tabsArr);
                    });
                }
                allTabsArr = $$.util.flattenArr(allTabsArr);
                console.log(allTabsArr);
                return callback(allTabsArr);
            });
        }
    });
}());