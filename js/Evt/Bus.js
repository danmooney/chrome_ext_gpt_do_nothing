/**
 * Event Bus / PubSub
 */
(function() {
    $$.klass(function EvtBus () {
        this.triggersArr = [];
        this.listenersArr = [];

    }, {
        _static: true,

        /**
         * Execute function on all listeners
         * @param {String} evtTypeStr
         * @return {Boolean}
         */
        trigger: function (evtTypeStr) {
            var EvtBus = $$.instance('EvtBus'),
                listenerArr = EvtBus.listenersArr[evtTypeStr],
                listenerObj,
                i;

            if ($$.util.isUndefined(listenerArr)) {
                return false;
            }

            i = listenerArr.length;

            while (--i >= 0) {
                listenerObj = listenerArr[i];
                listenerObj.callback.apply(listenerObj.context, listenerObj.args);
            }
            return true;
        },

        /**
         * Add listener for event type
         * @param {String} evtTypeStr
         * @params {*} argsList comma-separated arguments to pass to callback
         * @param {Function} callbackFn
         */
        listen: function (evtTypeStr, argsList, callbackFn) {
            var EvtBus = $$.instance('EvtBus'),
                listenerArr = EvtBus.listenersArr[evtTypeStr],
                args = $$.util.arrayify(arguments).slice(1),
                callback = args.pop();

            if ($$.util.isUndefined(listenerArr)) {
                EvtBus.listenersArr[evtTypeStr] = listenerArr = [];
            }

            listenerArr.push({
                context: this,
                args: args,
                callback: callback
            });
        }
    });
}());