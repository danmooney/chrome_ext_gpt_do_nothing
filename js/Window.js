// Interface for chrome.windows
(function() {
    'use strict';
    $$.klass(function Window () {
        var currentlySelectedWindowId = 0;

        this.setCurrentlySelectedWindowId = function (windowId) {
            var that = this;
            if ($$.util.isNumber(windowId)) {
                currentlySelectedWindowId = windowId;
            } else {
                this.getCurrentlySelectedWindow(function (window) {
                    that.setCurrentlySelectedWindowId(window.id);
                });
            }
        };

        this.getCurrentlySelectedWindowIdSync = function () {
            return currentlySelectedWindowId;
        };

        this.getCurrentlySelectedWindow = function (callback) {
            chrome.windows.getCurrent(null, callback);
        };

        this.removeAllTabsInWindowExceptGptTab = function (callback) {
            $$('Storage').getItem('currentGptWindowId', function (windowId) {
                $$('Tab').getAllTabsByWindowId(windowId, function (tabs) {
                    $$('Storage').getItem('currentGptTabId', function (gptTabId) {
                        var tabsLength = tabs.length - 1, // exclude gptTabId!
                            i = 0,
                            j;

                        function onRemoved () {
                            i += 1;
                            if (i >= tabsLength) {
                                callback();
//                                $$('Message').sendMessage({
//                                    klass: 'GptSiteOffer',
//                                    method: 'trigger',
//                                    args: ['OFFER_DONE']
//                                });
                            }
                        }

                        for (j = 0; j < tabs.length; j += 1) {
                            if (tabs[j].id === gptTabId) {
                                continue;
                            }
                            chrome.tabs.remove(tabs[j].id, onRemoved);
                        }
                    });
                });
            });
        };

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

        // can't do this because cookies need to persist.. user must START in incognito window!
        this.openIncognitoWindow = function () {
            var Tab = $$('Tab'),
                that = this;
//                windowCreateObj = {
//                    incognito: true,
//                    focused: /*false*/ true
//                };

            function windowCreateCallback (window) {
                var Storage = $$('Storage'),
                    Message = $$('Message');

                console.warn('CURRENT WINDOW ID: ' + window.id);
                Storage.setItem('currentGptWindowId', window.id, function () {
                    console.warn('GOING TO SEND MESSAGE TO START NOW');
                    Message.sendMessage({
                        klass: 'GptSite',
                        method: 'start'
                    });
                });
            }

            Tab.getCurrentlySelectedTabId(function (tabId) {
                console.warn('NEW WINDOW TAB ID: ' + tabId);

                Tab.storeGptKlassTabId(tabId, function () {
                    Tab.addRemovedListener(function checkIfTabIdIsGptSite (thisTabId) {
                        var App = $$('App');
                        if (!App.isWorking()) {
                            chrome.tabs.onRemoved.removeListener(checkIfTabIdIsGptSite);
                            return;
                        } else if (thisTabId !== tabId) {
                            return;
                        } else {
                            chrome.tabs.onRemoved.removeListener(checkIfTabIdIsGptSite);
                            App.stopWorking('notificationAppStoppedReasonTabClosed');
                        }
                    });

                    that.getCurrentlySelectedWindow(windowCreateCallback);
                });
            });

        };
    }, {
        _static: true,
        init: function () {
            this.listen('CURRENT_URL_SET',     this.setCurrentlySelectedWindowId);
            this.listen('APP_STARTED_WORKING', this.openIncognitoWindow);
        }
    });
}());