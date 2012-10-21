(function() {
    'use strict';
    $$.app.defaultInheritance.set('EvtBus');
    setInterval($$.app.namespace, 100);
    $(function () {
        // send message to bg page telling it that content has loaded
        var Message = $$.instance('Message');
        Message.sendMessage({
            klass: 'App',
            method: 'setContentLoaded',
            args: [true]
        });
    });
}());
//
//bg = function (callback) {
//    try {
//        var page = chrome.extension.getBackgroundPage();
//
//    } catch (e) {
//        throw e;
//    }
//};