(function() {
    'use strict';
    $$.app.defaultInheritance.set('EvtBus');
    setInterval($$.app.namespace, 100);

    $(document).ready(function () {
        var Message = $$.instance('Message');
        Message.sendMessage({
           klass: 'Url',
           method: 'setCurrentUrl',
           args: [
               window.location.href
           ]
        });

        // send message to bg page telling it that content has loaded
        setTimeout(function () {
            Message.sendMessage({
                klass: 'App',
                method: 'setContentLoaded',
                args: [true]
            });
        }, 5000);
    });
}());