/**
 * Icon (the browser action, or extension icon) klass
 */
(function() {
    'use strict';
    $$.klass(function Icon () {
        var bwIconPathStr = 'img/icon_bw_48.png',
            greenIconPathStr = 'img/icon_48.png',
            redIconPathStr = 'img/icon_red_48.png';

        this.getIcon = function () {

        };

        this.setIcon = function (tabId) {
            var Url = $$.instance('Url'),
                iconPathStr = '',
                setIconOptionsObj = {};

            // TODO - check if content scripts are working on GPT aspects

            if (Url.isStartingUrl()) {
                iconPathStr = greenIconPathStr;
            } else {
                iconPathStr = bwIconPathStr;
            }

            setIconOptionsObj = {
                path: iconPathStr
            };

            if ($$.util.isNumber(tabId)) {
                setIconOptionsObj.tabId = tabId;
            }

            chrome.browserAction.setIcon(setIconOptionsObj);
            this.trigger('ICON_SET', iconPathStr, tabId);
        };

        this.setTitle = function (iconPathStr, tabId) {
            switch (iconPathStr) {

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