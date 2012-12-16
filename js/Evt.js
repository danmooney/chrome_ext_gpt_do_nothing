/**
 * Chrome Events can be registered through here
 * This klass is also used to prevent duplicate events from being registered
 */

(function() {
    $$.klass(function Evt () {
        var eventsArr = [];

        /**
         * Adds event to eventsArr
         * @param evtTypeStr
         * @param chromeStr
         * @param callback
         */
        this.setEvent = function (evtTypeStr, chromeStr, callback) {
            eventsArr.push({
                evtTypeStr: evtTypeStr,
                chromeStr: chromeStr,
                callback: callback
            });
        };

        /**
         * @return {Array}
         */
        this.listEvents = function () {
            return eventsArr;
        };

        /**
         * Checks for whether event is already registered or not
         * Looks inside a nested object of the chrome global
         * @return {Boolean}
         */
        this.eventExists = function (chromeObj, callback) {
            return chromeObj.findListener_(callback) >= 0;
        };

    }, {
        _static: true,
        init: function () {

        },
        /**
         * Register events on chrome
         * @param {String} evtTypeStr
         * @param {String} chromeStr nested inside chrome global
         * @param {Function} callback
         * @param {Object} context call callback within this context
         */
        registerEvent : function (evtTypeStr, chromeStr, callback, context) {
            var Evt = $$('Evt');

            /**
             * Force call within the context of the calling klass
             */
            function closureCallback () {
                return callback.apply(context || window, arguments);
            }

            if ($$.util.isUndefined(chrome[chromeStr]) ||
                $$.util.isUndefined(chrome[chromeStr][evtTypeStr])
            ) {
                throw new ReferenceError(chromeStr + '.' + evtTypeStr + ' is undefined');
            }

            if (Evt.eventExists(chrome[chromeStr][evtTypeStr], callback)) {
                console.log('event exists already');
                return false;
            }

            chrome[chromeStr][evtTypeStr].addListener(closureCallback);

            return Evt.setEvent(evtTypeStr, chromeStr, callback);
        }
    });
}());