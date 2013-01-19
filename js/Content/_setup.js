(function() {
    'use strict';
    $$.app.defaultInheritance.set('EvtBus');
    setInterval($$.app.namespace, 10);

    $$.app.debug = true;

    // override alert in extension context
    window.alertLegacy = window.alert;

    window.alert = function (msg) {
        if ($$.app.debug === true) {
            alertLegacy(msg);
        }
    };
}());