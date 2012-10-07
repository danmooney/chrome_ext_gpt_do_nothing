/**
 * Event Bus / PubSub
 */
(function() {
    $$.klass(function EvtBus () {
        this.listenersArr = [];

    }, {
        _static: true,

        /**
         * Execute function on all listeners
         * @param {String} evtTypeStr
         * @params {*} argsList comma-separated arguments to pass to callback
         * @return {Boolean}
         */
        trigger: function (evtTypeStr) {
            var EvtBus = $$.instance('EvtBus'),
                listenerArr = EvtBus.listenersArr[evtTypeStr],
                listenerObj,
                args = $$.util.arrayify(arguments),
                i;

            args = args.slice(1);

            if ($$.util.isUndefined(listenerArr)) {
                return false;
            }

            i = listenerArr.length;

            while (--i >= 0) {
                listenerObj = listenerArr[i];
                console.log(evtTypeStr, listenerObj.context, args);
                listenerObj.callback.apply(listenerObj.context, args);
            }
            return true;
        },

        /**
         * Add listener for event type
         * @param {String} evtTypeStr
         * @param {Function} callback
         */
        listen: function (evtTypeStr, callback) {
            var EvtBus = $$.instance('EvtBus'),
                listenerArr = EvtBus.listenersArr[evtTypeStr];

            if ($$.util.isUndefined(listenerArr)) {
                EvtBus.listenersArr[evtTypeStr] = listenerArr = [];
            }

            listenerArr.push({
                context: this,
                callback: callback
            });
        }
    });
}());