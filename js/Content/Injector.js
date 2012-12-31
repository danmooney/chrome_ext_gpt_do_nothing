// TODO - this doesn't seem to be overriding the defaults at all!... maybe execute these methods sooner than document.ready?
(function() {
    'use strict';
    $$.klass(function Injector () {
        var that = this,
            content = {
                overrideAlert: function () {
                    var win = window;

                    win.alertLegacy = win.alert;

                    win.alert = function (msg) {
                        console.warn('ALERTED ALERTED ALERTED');
                        win.alertLegacy('intercepted alert: \n\n' + msg);
                        that.trigger('onalert', msg);
                    };
                },
                overrideConfirm: function () {
                    var win = window;

                    win.confirmLegacy = win.confirm;

                    win.confirm = function (msg) {
                        console.warn('CONFIRMED CONFIRMED CONFIRMED');
                        win.alertLegacy('intercepted confirm: \n\n' + msg);
                        that.trigger('onconfirm', msg);
                    };
                },
                /**
                 * Prevent form.submit from happening more than once if
                 * GPT Offer site using JS for its submissions
                 */
                overrideOnBeforeUnload: function () {
//                    var win = window;
//
//                    if (win.onbeforeunload !== null) {
//                        return;
//                    }
//
//                    win.onbeforeunload = function () {
//                        var div = document.createElement('div');
//                        div.setAttribute('id', 'gpt-offer-form-submitted');
//                        document.body.appendChild(div);
//                        return true;
//                    };
                }
            };

        this.getScript = function (fnStr) {
           return content[fnStr];
        };

    }, {
        _static: true,
        inject: function (fnStr) {
            var script = document.createElement('script');
            script.appendChild(document.createTextNode('('+ this.getScript(fnStr) +'());'));
            document.documentElement.appendChild(script);

            return this;
        }
    });
}());