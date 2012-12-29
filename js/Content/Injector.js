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
                    alert('intercepted alert: \n\n' + msg);
                    that.trigger('onalert', msg);
                };
            },
            overrideConfirm: function () {
                var win = window;

                win.confirmLegacy = win.confirm;

                win.confirm = function (msg) {
                    console.warn('CONFIRMED CONFIRMED CONFIRMED');
                    alert('intercepted confirm: \n\n' + msg);
                    that.trigger('onconfirm', msg);
                };
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