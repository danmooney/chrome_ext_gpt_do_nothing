(function() {
    'use strict';
    $$.klass(function Injector () {
        var that = this,
            popupCheckingInterval = 200,
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
                 * Submit the form from the content window context.
                 * (Form submission triggering doesn't exactly work from the partially sandboxed extension context.)
                 *
                 * NOTE: jQuery should probably be avoided in this case.
                 *       It isn't wise to add it because it might override some existing legacy jQuery site JS.
                 *
                 * @param {jQuery} formEl
                 * @param {jQuery} submitButtonEls
                 */
                injectSubmit: function (formEl, submitButtonEls) {
                    var attrs,
                        attr,
                        attrsArr = [],
                        i;

                    submitButtonEls.each(function () {
                        attrs = this.attributes;

                        for (i = 0; i < attrs.length; i += 1) {
                            attr = attrs.item(i);

                            attrsArr.push({
                                'name': attr.nodeName,
                                'value': attr.nodeValue
                            });
                        }
                    });

                    formEl = formEl[0];
                    attrs = formEl.attributes;

                    for (i = 0; i < attrs.length; i += 1) {
                        attr = attrs.item(i);

                        attrsArr.push({
                            'name': attr.nodeName,
                            'value': attr.nodeValue
                        });
                    }

                    eval('(function() {' +
                        '    function submitForm () {' +
                        '        var attrsArr = ' + JSON.stringify(attrsArr) + ';' +
                        '        ' + // TODO - FINISH HERE
                        '    }' +
                        '    var script = document.createElement("script");' +
                        '    script.onload = function () {' +
                        '        var myJQuery = jQuery.noConflict();' +
                        '        submitForm();' +
                        '    }' +
                        '    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";' +
                        '    document.documentElement.appendChild(script);' +
                        '}());'
                    );


                    function evalHere () {
                        for (var i = 0; i < submitButtonEls.length; i += 1) {
                            submitButtonEls[0].length
                        }
                    }

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

        this.getPopupCheckingInterval = function () {
            return popupCheckingInterval;
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

        checkForInterceptedPopupsAndTrigger: function () {
            var that = this;
            return setInterval(function () {
                var interceptedPopups = $('.gpt-popup-box'),
                    triggerStr;

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

                    console.warn("TRIGGERING " + triggerStr);
                    that.trigger(triggerStr, popupEl.text());
                    popupEl.remove();
                });
            }, that.getPopupCheckingInterval());
        },
        /**
         * Inject a function call to be executed within the context of the content window.
         * Ultra-sneaky solution!
         * @param fnStr
         */
        inject: function (fnStr) {
            var script = document.createElement('script');
            script.appendChild(document.createTextNode('('+ this.getScript(fnStr) +'());'));
            document.documentElement.appendChild(script);

            return this;
        }
    });
}());