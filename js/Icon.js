/**
 * Icon (the browser action, or extension icon) klass
 */
(function() {
    $$.klass(function Icon () {
        var bwIconPathStr = 'img/icon_bw_48.png',
            greenIconPathStr = 'img/icon_48.png',
            redIconPathStr = 'img/icon_red_48.png';

        this.getIcon = function () {

        };

        this.setIcon = function () {
            var Url = $$.instance('Url'),
                iconPathStr = '';

            // TODO - check if content scripts are working on GPT aspects

            if (Url.isStartingUrl()) {
                iconPathStr = greenIconPathStr;
            } else {
                iconPathStr = bwIconPathStr;
            }

            return chrome.browserAction.setIcon({
                path: iconPathStr
            });
        };
    }, {
        _static: true,
        init: function () {
            this.listen('CURRENT_URL_SET', this.setIcon);
        }
    });
}());