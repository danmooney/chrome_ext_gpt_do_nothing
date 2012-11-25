// Interface for chrome.windows
(function() {
    'use strict';
    $$.klass(function Window () {
        /**
         * @param {Function} callback
         * @return {Array}
         */
        this.getAllWindowIds = function (callback) {
            chrome.windows.getAll(function (windows) {
                var idsArr = [],
                    i;
                console.log('ALL WINDOWS: ' + windows);
                for (i = 0; i < windows.length; i += 1) {
                    idsArr.push(windows[i].id);
                }

                return callback(idsArr);
            });
        };

        this.openIncognitoWindow = function () {
            var Tab = $$.instance('Tab'),
                windowCreateObj = {
                    incognito: true,
                    focused: /*false*/ true
                };

            Tab.getCurrentlySelectedTabId(function (tabId) {
                windowCreateObj.tabId = tabId;
                chrome.windows.create(windowCreateObj, function (window) {
                    console.log(window);
                    var Storage = $$.instance('Storage');
                    Storage.setItem('currentGptWindowId', window.id);
                });
            });

        };
    }, {
        _static: true,
        init: function () {
            this.listen('APP_STARTED_WORKING', this.openIncognitoWindow);
        }
    });
}());