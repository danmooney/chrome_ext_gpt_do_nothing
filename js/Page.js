/**
 * Page klass
 */
(function() {
    'use strict';
    $$.klass(function Page () {

    }, {
        _static: true,
        getBgPage: function () {
            return $$.instance('PageBackground').bgPage;
        },
        /**
         * Compare bg page to window
         * @return {Boolean}
         */
        isBgPage: function () {
            return this.getBgPage() === window;
        }
    });
}());