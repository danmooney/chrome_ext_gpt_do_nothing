/**
 * Icon (the browser action, or extension icon) klass
 */
(function() {
    'use strict';
    $$.klass(function Icon () {
        var iconObj = {
            bw: {
                iconPathStr: 'img/icon_bw_48.png',
                iconMessageKeyStr: 'NotReady',
                iconClassStr: 'not-ready'
            },
            green: {
                iconPathStr: 'img/icon_48.png',
                iconMessageKeyStr: 'Ready',
                iconClassStr: 'ready'
            },
            red: {
                iconPathStr: 'img/icon_red_48.png',
                iconMessageKeyStr: 'Working',
                iconClassStr: 'working'
            }
        },
        currentIconKeyStr = 'bw';

        this.getIconData = function () {
            return iconObj[currentIconKeyStr];
        };

        this.setIcon = function (tabId) {
            var Url = $$.instance('Url'),
                iconPathStr = '',
                iconObjKeyStr = '',
                setIconOptionsObj;

            // TODO - check if content scripts are working on GPT aspects
            if (Url.isStartingUrl()) {
                iconObjKeyStr = 'green';
            } else {
                iconObjKeyStr = 'bw';
            }

            if (currentIconKeyStr === iconObjKeyStr) { // icons are the same
                return;
            }

            currentIconKeyStr = iconObjKeyStr;

            iconPathStr = iconObj[iconObjKeyStr].iconPathStr;

            setIconOptionsObj = {
                path: iconPathStr
            };

            if ($$.util.isNumber(tabId)) {
                setIconOptionsObj.tabId = tabId;
            }

            chrome.browserAction.setIcon(setIconOptionsObj);
            this.trigger('ICON_SET', iconObjKeyStr, tabId);
        };

        this.setTitle = function (iconObjKeyStr, tabId) {
            var Url = $$.instance('Url'),
                setTitleOptionsObj,
                messageKeyStr,
                titlePrefixStr = 'iconTitle',
                titleStr = '';

            messageKeyStr = iconObj[iconObjKeyStr].iconMessageKeyStr;

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
            this.listen('CURRENT_URL_SET', this.setIcon);
            this.listen('ICON_SET', this.setTitle);
        }
    });
}());