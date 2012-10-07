/**
 * Popup Page
 */
(function() {
    'use strict';
    $$.klass(function PagePopup () {
        /**
         * Set logo based on current icon image
         */
        this.setLogo = function (iconPathStr) {
            var bg = this.getBgPage(),
                iconObj = bg.$$.instance('Icon').getIconData();

            $('#logo, #status-text').attr('class', iconObj.iconClassStr);
        };

        this.setStatus = function () {
            var bg = this.getBgPage(),
                Locale = $$.instance('Locale'),
                messageHeadingStr = Locale.getMessage('popupStatusHeading'),
                iconObj = bg.$$.instance('Icon').getIconData();

            $('#status-heading').text(messageHeadingStr);
            $('#status-text').attr('class', iconObj.iconClassStr);
        }
    }, {
        _static: true,
        init: function () {
//            this.listen('ICON_SET', this.setLogo);
            this.setLogo();
            this.setStatus();
        }
    }).inheritFrom('Page');
}());