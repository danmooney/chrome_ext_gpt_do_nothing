/**
 * Icon (the browser action, or extension icon) klass
 * // TODO - Icon is storing way too much info about the status of the app.... move these calls to App klass!
 */
(function() {
    'use strict';
    $$.klass(function Icon () {
        var iconStatusObj = {
            NotReady: {
                iconPath: 'img/icon_bw_48.png',
                iconColor: 'bw',
                iconClass: 'not-ready'
            },
            Ready: {
                iconPath: 'img/icon_green_48.png',
                iconColor: 'green',
                iconClass: 'ready'
            },
            Working: {
                iconPath: 'img/icon_red_48.png',
                iconColor: 'red',
                iconClass: 'working'
            }
        },

        currentIconStatusStr = $$.instance('App').getStatus();

        this.allIconsSetBool = false;

        /**
         * @return {String}
         */
        this.getIconData = function () {
            return iconStatusObj[currentIconStatusStr];
        };

        this.setIconOnTabByTabId = function (tabId) {
            var Url = $$.instance('Url'),
                App = $$.instance('App'),
                iconPathStr,
                setIconOptionsObj;

            currentIconStatusStr = App.getStatus();

//            if (currentIconStatusStr === oldIconStatusStr) { // icons are the same
//                return;
//            }

            iconPathStr = iconStatusObj[currentIconStatusStr].iconPath;

            setIconOptionsObj = {
                path: iconPathStr
            };

            if ($$.util.isNumber(tabId)) {
                setIconOptionsObj.tabId = tabId;
            }

            chrome.browserAction.setIcon(setIconOptionsObj);
        };

        /**
         * Set image on browser action for a particular tab
         * @param tabId
         */
        this.setIcon = function (tabId) {
            tabId = tabId || null;

            var App = $$.instance('App'),
                oldIconStatus = currentIconStatusStr;

            currentIconStatusStr = App.getStatus();

            if (null === tabId) {
                if ('Working' === currentIconStatusStr) {
                    this.setIconOnAllTabs();
                    this.allIconsSetBool = true;
                } else if ('Working' === oldIconStatus) {
                    this.allIconsSetBool = false;
                    this.setIconOnAllTabs('NotReady');
                    this.allIconsSetBool = true;
                }
            } else {
                this.setIconOnTabByTabId(tabId);
                this.allIconsSetBool = false;
            }

            this.trigger('ICON_SET', currentIconStatusStr, tabId);
        };

        this.setIconOnAllTabs = function (iconStatusStr) {
            if (true === this.allIconsSetBool) {
                return;
            }

            var that = this;

            $$.instance('Tab').getAllTabsInAllWindows(function (tabsArr) {
                var iconPathStr,
                    setIconOptionsObj,
                    i;

                for (i = 0; i < tabsArr.length; i += 1) {
                    iconPathStr = iconStatusObj[currentIconStatusStr].iconPath || iconStatusObj[iconStatusStr].iconPath;
                    setIconOptionsObj = {
                        path: iconPathStr,
                        tabId: tabsArr[i].id
                    };
                    console.log('setting browser icon', setIconOptionsObj);
                    chrome.browserAction.setIcon(setIconOptionsObj);
                }
            });
        };

        /**
         * Set title on browser action
         * @param currentIconStatusStr
         * @param tabId
         */
        this.setTitle = function (currentIconStatusStr, tabId) {
            var Url = $$.instance('Url'),
                setTitleOptionsObj,
                messageKeyStr,
                titlePrefixStr = 'iconTitle',
                titleStr;

            messageKeyStr = currentIconStatusStr;

            if (titleStr = $$.instance('Locale').getMessage(titlePrefixStr + messageKeyStr)) {
                setTitleOptionsObj = {
                    title: titleStr
                };

                if ($$.util.isNumber(tabId)) {
                    setTitleOptionsObj.tabId = tabId;
                }

                chrome.browserAction.setTitle(setTitleOptionsObj);
                this.trigger('TITLE_SET');
            }
        };
    }, {
        _static: true,
        init: function () {
            this.listen('APP_STATUS_CHANGED', this.setIcon);
            this.listen('ICON_SET',           this.setTitle);
        }
    });
}());