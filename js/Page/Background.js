/**
 * Popup Page
 */
(function() {
    'use strict';
    $$.klass(function PageBackground () {
        /**
         * Stored reference to Extension Window
         */
        this.bgPage = null;
    }, {
        _static: true,
        init: function () {
            this.bgPage = chrome.extension.getBackgroundPage();
            if (this.isBgPage()) {
//                $$.instance('Storage').clearItems();
            }
        }
    }).inheritFrom('Page');
}());