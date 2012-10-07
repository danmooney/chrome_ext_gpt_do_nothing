/**
 * Popup Page
 */
(function() {
    'use strict';
    $$.klass(function PagePopup () {
        /**
         * Set logo based on current icon image
         */
        this.setLogo = function () {
            var bg = this.getBgPage(),
                iconObj = bg.$$.instance('Icon').getIconData();

            $('#logo, #status-text').attr('class', iconObj.iconClass);
        };

        /**
         * Set popup status text
         */
        this.setStatusText = function () {
            var bg = this.getBgPage(),
                App = bg.$$.instance('App'),
                status = App.getStatus();

            $('#status-text').attr('data-118n', 'popupStatus' + App.getStatus());
        }
    }, {
        _static: true,
        init: function () { // sort of an onload measure, since this is triggered everytime popup.html is loaded
            this.setLogo();
            this.setStatusText();
        }
    }).inheritFrom('Page');
}());