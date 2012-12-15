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
         * TODO - maybe trigger listeners on a different context (ex. background to content or vice versa)
         *
         * @param {String} evtTypeStr
         * @params {*} argsList comma-separated arguments to pass to callback
         * @return {Boolean}
         */
        trigger: function (evtTypeStr) {
//            if (evtTypeStr === 'APP_STARTED_WORKING') {
//                debugger;
//            }
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

                if (args.length > 0) {
                    console.log(evtTypeStr, listenerObj.context, args);
                } else {
                    console.log(evtTypeStr, listenerObj.context);
                }

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