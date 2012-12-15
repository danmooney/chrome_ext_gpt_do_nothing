// background page setup
(function() {
    'use strict';

    $$.app.defaultInheritance.set('EvtBus');
    setInterval($$.app.namespace, 100);

    // register starting urls
//    function ready () {
//        $(document).ready(function () {
//            var Message = $$.instance('Message');
//
//            Message.sendMessage({
//                klass: 'App',
//                method: 'getApplicationGlobal'
//            }, function (appGlobal) {
//                for (var i in appGlobal.Gpt) {
//                    if (!appGlobal.Gpt.hasOwnProperty(i)) {
//                        continue;
//                    }
//                    if ($$.util.isFunc(appGlobal.Gpt[i].init)) {
//                        appGlobal.Gpt[i].init();
//                    }
//                }
//            });
//        });
//    }
//    ready();
//    $$.instance('Storage').clearItems(ready);
}());