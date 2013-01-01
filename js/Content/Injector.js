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
//                        win.alertLegacy('intercepted alert: \n\n' + msg);
//                        that.trigger('onalert', msg);
                        addContentToDiv('gpt-offer-alert', msg);
                        return false;
                    };
                },
                overrideConfirm: function () {
                    var win = window;

                    win.confirmLegacy = win.confirm;

                    win.confirm = function (msg) {
                        console.warn('CONFIRMED CONFIRMED CONFIRMED');
//                        win.alertLegacy('intercepted confirm: \n\n' + msg);
                        addContentToDiv('gpt-offer-confirm', msg);
                        return true;
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

        /**
         * This is for the purposes of message passing when a confirm or an alert happens
         * TODO - is there a better way to send messages?
         */
        function addContentToDiv (idStr, contentStr) {
            if ($('#' + idStr).length === 0) {
                $('<div></div>').attr({
                    'id': idStr,
                    'class': 'gpt-popup-box'
                }).appendTo($('body'));
            }

            $('#' + idStr).text(contentStr);
        }
    }, {
        _static: true,

        init: function () {
            setInterval(this.checkForInterceptedPopupsAndTrigger, 200);
        },
        checkForInterceptedPopupsAndTrigger: function () {
            var interceptedPopups = $('.gpt-popup-box'),
                triggerStr,
                that = this;

            if (interceptedPopups.length === 0) {
                return;
            }

            interceptedPopups.each(function () {
                var popupEl = $(this);

                switch (popupEl.attr('id')) {
                    case 'gpt-offer-alert':
                        triggerStr = 'onalert';
                        break;
                    case 'gpt-offer-confirm':
                        triggerStr = 'onconfirm';
                        break;
                }

                that.trigger(triggerStr, popupEl.text());
                popupEl.remove();
            });
        },
        inject: function (fnStr) {
            var script = document.createElement('script');
            script.appendChild(document.createTextNode('('+ this.getScript(fnStr) +'());'));
            document.documentElement.appendChild(script);

            return this;
        }
    });
}());