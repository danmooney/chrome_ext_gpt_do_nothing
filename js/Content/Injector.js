(function() {
    'use strict';
    $$.klass(function Injector () {
        var content = {
            overrideAlert: function () {
                var win = window;

                win.alert = function (msg) {
                    console.log(msg);
                }
            },
            overrideConfirm: function () {
                var win = window;

                win.confirm = function (msg) {
                    console.log(msg);
                }
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