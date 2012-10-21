(function() {
    'use strict';
    $$.app.defaultInheritance.set('EvtBus');
    setInterval($$.app.namespace, 100);
    $(function () {
        // send message to bg page telling it that content has loaded
        setTimeout(function () {
            var Message = $$.instance('Message');
            Message.sendMessage({
                klass: 'App',
                method: 'setContentLoaded',
                args: [true]
            });
        }, 5000);
    });
}());