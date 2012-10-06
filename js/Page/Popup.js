/**
 * Popup Page
 */
(function() {
    'use strict';
    $$.klass(function PagePopup () {
        /**
         * Format popup page based on status/locale, etc.
         */
        this.formatHTML = function () {
            $$.instance('Url').getCurrentUrl();
        };
    }, {
        _static: true,
        init: function () {
            this.formatHTML();
        }
    }).inheritFrom('Page');
}());