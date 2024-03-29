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
            var that = this,
                ctor = $$.ctor('Tab');
            if (this instanceof ctor) {
                this.listen('CURRENT_URL_SET',     this.setCurrentlySelectedTabId);
            }
        },
        createNewTab: function (tabData) {
            tabData = tabData || {};
            chrome.tabs.create(tabData);
        },
        storeGptKlassTabId: function (tabId, callback) {
            console.warn("SETTING GPT TAB ID: " + tabId);
            var Storage = $$('Storage');
            Storage.setItem('currentGptTabId', tabId, callback);
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
        /**
         * @deprecated
         */
        getCurrentlySelectedTabIdSync: function () {
            throw new AppError('getCurrentlySelectedTabIdSync is deprecated');
//            return this.currentlySelectedTabId;
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
            var Window = $$('Window'),
                that = this;

            Window.getAllWindowIds(function (windowIdsArr) {
                var allTabsArr = [],
                    i;
                for (i = 0; i < windowIdsArr.length; i += 1) {
                    that.getAllTabsByWindowId(windowIdsArr[i], function (tabsArr) {
                        allTabsArr.push(tabsArr);
                        if (allTabsArr.length === windowIdsArr.length) {  // time to return
                            console.log('ALL TABS BEFORE FLATTEN: ' + allTabsArr);
                            allTabsArr = $$.util.flattenArr(allTabsArr);
                            console.log('ALL TABS: ' + allTabsArr);
                            return callback(allTabsArr);
                        }
                    });
                }
            });
        },

        addRemovedListener: function (listenerFn) {
            chrome.tabs.onRemoved.addListener(listenerFn);
        }
    });
}());