(function() {
    'use strict';
    $$.app.defaultInheritance.set('EvtBus');
    setInterval($$.app.namespace, 10);

    // override window.confirm
    window.confirmLegacy = window.confirm;
    window.confirm = function (textStr) {
        alert('INTERCEPTED A WINDOW CONFIRM');
        return true;
    };
}());