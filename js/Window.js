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
                console.warn('NEW WINDOW TAB ID: ' + tabId);
                windowCreateObj.tabId = tabId;
                chrome.windows.create(windowCreateObj, function (window) {
                    console.log(window);
                    var Storage = $$.instance('Storage'),
                        Message = $$.instance('Message');
                    Storage.setItem({
                        currentGptWindowId: window.id
                    }, function () {
                        Message.sendMessage({
                            klass: 'GptSite',
                            method: 'start'
                        });
                    });
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