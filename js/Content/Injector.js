(function() {
    'use strict';
    $$.klass(function Injector () {
        var that = this,
            popupCheckingInterval = 200,
            injectedJQueryBool = false,
            content = {
                evalScript: function (scriptToEvalStr) {
                    eval(scriptToEvalStr);
                },
                /**
                 * This is for the purposes of message passing when a confirm or an alert happens
                 */
                addContentToDiv: function () {
                    var win = window;

                    win.addContentToDiv = function (idStr, contentStr) {
                        var $ = gptJQuery;

                        if ($('#' + idStr).length === 0) {
                            $('<div></div>').attr({
                                'id': idStr,
                                'class': 'gpt-popup-box'
                            }).appendTo($('body'));
                        }

                        $('#' + idStr).text(contentStr);
                    };
                },
                /**
                 * Inject jQuery
                 */
                jquery: function () {
                    var win = window,
                        script = document.createElement("script");

                    script.setAttribute('class', 'gpt-script');

                    script.onload = function () {
                        win.gptJQuery = jQuery.noConflict();

                        var $ = gptJQuery;

                        $('<div></div>').attr({
                            'id': 'gpt-my-jquery',
                            'class': 'gpt-popup-box'
                        }).appendTo($('body'));
                    };

                    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js";  // TODO - script.onerror goes to another CDN?
                    document.documentElement.appendChild(script);
                },
                overrideAlert: function () {
                    var win = window;

                    win.alertLegacy = win.alert;

                    // win.alert should be the more useful one, because it may indicate form validation errors
                    win.alert = function (msg) {
//                        win.alertLegacy('intercepted alert: \n\n' + msg);
                        win.addContentToDiv('gpt-offer-alert', msg);
                        return false;
                    };
                },

                overrideConfirm: function () {
                    var win = window;
                    win.confirmLegacy = win.confirm;

                    // win.confirm should always return true.  it's mainly used for when you try to exit a window
                    win.confirm = function (msg) {
//                        win.alertLegacy('intercepted confirm: \n\n' + msg);
                        win.addContentToDiv('gpt-offer-confirm', msg);
                        return true;
                    };
                },
                
                /**
                 * Prevent form.submit from happening more than once if
                 * GPT Offer site using JS for its submissions
                 * TODO - Finish!  This will allow us to only submit the form once and to prevent further submits from other forms!
                 */
                overrideOnBeforeUnload: function () {
                    var win = window;

                    if (win.onbeforeunload !== null) {
                        return;
                    }

                    win.onbeforeunload = function () {
                        var div = document.createElement('div');
                        div.setAttribute('id', 'gpt-offer-form-submitted');
                        document.body.appendChild(div);
                        return true;
                    };
                }
            };

        this.setInjectedJQuery = function (jQueryBool) {
            injectedJQueryBool = jQueryBool;
        };

        this.hasJQueryBeenInjected = function () {
            return injectedJQueryBool;
        };

        this.getScript = function (fnStr) {
           return content[fnStr];
        };

        this.getPopupCheckingInterval = function () {
            return popupCheckingInterval;
        };

        /**
         * Get the attributes of an element
         * @param {jQuery} el
         * @return {Array}
         */
//        this.getAttributesOfEl = function (el) {
//            var attrs = el.attributes,
//                attr,
//                attrsArr = [];
//
//            for (i = 0; i < attrs.length; i += 1) {
//                attr = attrs.item(i);
//
//                attrsArr.push({
//                    'name': attr.nodeName,
//                    'value': attr.nodeValue
//                });
//
//                formSelectorStr += '[' + attr.nodeName + '=' + '\\"' + attr.nodeValue + '\\"]';
//            }
//        };


    }, {
        _static: true,
        init: function () {
            this.listen('onalert', function (msg) {
                console.log('onalert listen');
                console.dir(arguments);
            });

            this.listen('onconfirm', function (msg) {
                console.log('onconfirm listen');
                console.dir(arguments);
            });

            // remove gpt-script classes, just in case a site is evaluating number of script tags in the DOM
            setInterval(function () {
                $('script.gpt-script').remove();
            }, 1);
        },
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
                        case 'gpt-my-jquery':  // jQuery loaded ??
                            if (false === that.hasJQueryBeenInjected()) {
                                that.setInjectedJQuery(true);
                                triggerStr = 'onjquery';
                                that
                                    .inject('addContentToDiv')
                                    .inject('overrideAlert')
                                    .inject('overrideConfirm')
                                    .checkForInterceptedPopupsAndTrigger();
                            }
                            break;
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
         * Inject click trigger on an input
         * @param {jQuery|String} inputEl or jQuery selector string
         * @param {jQuery} [parentEl]
         */
        injectClickInput: function (inputEl, parentEl) {
            var inputElSelectorStr,
                parentElSelectorStr,
                scriptToEvalStr;

            if (!$$.util.isString(inputEl)) {
                inputElSelectorStr = $$.util.makeJQuerySelector(inputEl);
            } else {
                inputElSelectorStr = inputEl;
            }

            if ($$.util.isDefined(parentEl)) {
                if (!$$.util.isString(parentEl)) {
                    parentElSelectorStr = $$.util.makeJQuerySelector(parentEl);
                } else {
                    parentElSelectorStr = parentEl;
                }
            }

            inputElSelectorStr = inputElSelectorStr.replace(/"/g, '\\"');

            if ($$.util.isDefined(parentEl)) {
                parentElSelectorStr = parentElSelectorStr.replace(/"/g, '\\"');
                scriptToEvalStr = '' +
                    '(function clickInput() {' +
                    '    var $ = window.gptJQuery,' +
                    '        parentEl = $(\'' + parentElSelectorStr + '\'),' +
                    '        inputEl = parentEl.find(\'' + inputElSelectorStr + '\').filter(\\":visible\\");' +
                    '     inputEl.trigger(\\"focus\\").trigger(\\"click\\").attr(\\"checked\\",\\"checked\\").trigger(\\"blur\\");' +
                    '}());'
                ;
            } else {
                scriptToEvalStr = '' +
                    '(function clickInput() {' +
                    '    var $ = window.gptJQuery,' +
                    '        inputEl = $(\'' + inputElSelectorStr + '\').filter(\\":visible\\");' +
                    '     inputEl.trigger(\\"focus\\").trigger(\\"click\\").attr(\\"checked\\",\\"checked\\").trigger(\\"blur\\");' +
                    '}());'
                ;
            }

            this.inject('evalScript', scriptToEvalStr);
        },
        /**
         * Submit the form from the content window context.
         * (Form submission triggering doesn't exactly work from the partially sandboxed extension context.)
         *
         * NOTE: jQuery should probably be avoided in this case.
         *       It isn't wise to add it because the Google CDN might be down.
         *
         * @param {jQuery} formEl
         * @param {jQuery} submitButtonEls
         */
        injectSubmit: function (formEl, submitButtonEls) {
            var scriptToEvalStr,
                formSelectorStr = $$.util.makeJQuerySelector(formEl).replace(/"/g, '\\"'),
                submitButtonSelectorStr = 'input[type=\\"submit\\"], input[type=\\"image\\"], input[onsubmit]';


            scriptToEvalStr = '(function submitForm() {' +
                '    var $ = window.gptJQuery,' +
                '        formEl = $(\'' + formSelectorStr + '\'),' +
                '        submitEls = formEl.find(\'' + submitButtonSelectorStr + '\').filter(\\":visible\\");' +
                '     if (submitEls.length === 0) {' +
                '         submitEls = formEl.find(\\"button\\"); ' +
                '     }' +
                '     submitEls.trigger(\\"click\\");' +
                '}());'
            ;

            this.inject('evalScript', scriptToEvalStr);
        },
        /**
         * Inject a function call to be executed within the context of the content window.
         * Ultra-sneaky solution!
         *
         * Also allows additional arguments, although it could get messy with string encoding and whatnot (it's only used for evaling as an argument)
         *
         * @param fnStr
         * @param [scriptStrToEval]
         */
        inject: function (fnStr, scriptStrToEval) {
            scriptStrToEval = scriptStrToEval || '';

            var script = document.createElement('script');
            script.setAttribute('class', 'gpt-script');
            script.appendChild(document.createTextNode('('+ this.getScript(fnStr) +'(\"' + scriptStrToEval + '\"));'));
            document.documentElement.appendChild(script);

            return this;
        }
    });
}());