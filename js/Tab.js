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
            this.listen('CURRENT_URL_SET', this.setCurrentlySelectedTabId);
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
        }
    });
}());