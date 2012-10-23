(function() {
    'use strict';
    $$.klass(function App () {
        this.getApplicationGlobal = function () {
            return $$.getApplicationGlobal();
        };
    });
}());