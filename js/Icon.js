/**
 * Icon (the browser action, or extension icon) klass
 * // TODO - Icon is storing way too much info about the status of the app.... move these calls to App klass!
 * // TODO - change default icon (green) to include this color in filename, i.e. icon_green_48.png
 */
(function() {
    'use strict';
    $$.klass(function Icon () {
        var /*iconObj = {
            bw: {
                iconPathStr: 'img/icon_bw_48.png',
                iconMessageKeyStr: 'NotReady',
                iconClassStr: 'not-ready'
            },
            green: {
                iconPathStr: 'img/icon_green_48.png',
                iconMessageKeyStr: 'Ready',
                iconClassStr: 'ready'
            },
            red: {
                iconPathStr: 'img/icon_red_48.png',
                iconMessageKeyStr: 'Working',
                iconClassStr: 'working'
            }
        },*/
        iconStatusObj = {
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
//        currentIconKeyStr = 'bw',
        currentIconStatusStr = $$.instance('App').getStatus();

        /**
         * @return {String}
         */
        this.getIconData = function () {
            return iconStatusObj[currentIconStatusStr];
        };

        /**
         * Set image on browser action for a particular tab
         * @param tabId
         */
        this.setIcon = function (tabId) {
            var Url = $$.instance('Url'),
                oldIconStatusStr = currentIconStatusStr,
                iconPathStr = '',
                iconObjKeyStr = '',
                setIconOptionsObj;

//            if (Url.isStartingUrl()) {
//                iconObjKeyStr = 'green';
//            } else {
//                iconObjKeyStr = 'bw';
//            }

            currentIconStatusStr = $$.instance('App').getStatus();

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
            this.trigger('ICON_SET', currentIconStatusStr, tabId);
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
            this.listen('STATUS_CHANGED', this.setIcon);
            this.listen('ICON_SET',       this.setTitle);
        }
    });
}());