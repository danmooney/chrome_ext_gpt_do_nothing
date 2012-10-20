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
            try {
                return this.getBgPage() === window;
            } catch (e) {
                return false;
            }
        }
    });
}());