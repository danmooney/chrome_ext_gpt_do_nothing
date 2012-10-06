/**
 * Popup Page
 */
(function() {
    'use strict';
    $$.klass(function PagePopup () {
        this.setLogo = function (iconPathStr) {

        };
    }, {
        _static: true,
        init: function () {
            this.listen('ICON_SET', this.setLogo);
        }
    }).inheritFrom('Page');
}());