/**
 * Event Bus / PubSub
 */
(function() {
    'use strict';
    $$.klass(function EvtBus () {
        this.listenersArr = [];

        /**
         * Check for duplicate callback functions in evtTypeStr inside this.listenersArr
         * @return {Boolean}
         */
        this.listenerAlreadyExists = function (evtTypeStr, callbackFn) {
            var listenerTypeArr = this.listenersArr[evtTypeStr],
                listenerObj,
                callbackStr = callbackFn.toString(),
                i;

            for (i = 0; i < listenerTypeArr; i += 1) {
                listenerObj = listenerTypeArr[i];
                if (listenerObj.callback.toString() === callbackStr) {
                    return true;
                }
            }

            return false;
        };

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
            var EvtBus = $$('EvtBus'),
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
                    console.log(evtTypeStr, listenerObj.context.constructor.name, args);
                } else {
                    console.log(evtTypeStr, listenerObj.context.constructor.name);
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
        // don't allow listener to register the same listener twice TODO - TEST the implementation
        listen: function (evtTypeStr, callback) {
            var EvtBus = $$('EvtBus'),
                listenerArr = EvtBus.listenersArr[evtTypeStr];

            if ($$.util.isUndefined(listenerArr)) {
                EvtBus.listenersArr[evtTypeStr] = listenerArr = [];
            }

            if (EvtBus.listenerAlreadyExists(evtTypeStr, callback)) {
                console.warn('Listener already exists.  Aborting...');
                return;
            }

            listenerArr.push({
                context: this,
                callback: callback
            });
        },

        removeListener: function (evtTypeStr) {
            var EvtBus = $$('EvtBus');

            EvtBus.listenersArr[evtTypeStr] = undefined;
        }
    });
}());