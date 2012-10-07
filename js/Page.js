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
        }
    });
}());