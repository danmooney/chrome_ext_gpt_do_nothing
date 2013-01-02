/**
 * Wrapper for sending/receiving messages
 */
(function() {
    $$.klass(function Message () {
        this.sendMessage = function (dataObj, callback) {
            var Page = $$('Page'),
                isBgPage = Page.isBgPage(),
                Tab,
                tabId = dataObj.tabId || null;

            // if isBgPage or popup page, send message over to content scripts
            if ((true === isBgPage) ||
                (false === isBgPage && $$.util.isDefined(chrome.tabs))
            ) {
                Tab =  $$('Tab') || Page.getBgPage().$$('Tab');

                /**
                 * @param {Number} tabId
                 */
                function sendTabMessageCallback (tabId) {
                    if ($$.util.isFunc(callback)) {
                        console.log('sending message to ' + tabId);
                        chrome.tabs.sendMessage(tabId, dataObj, callback);
                    } else {
                        chrome.tabs.sendMessage(tabId, dataObj);
                    }
                }

                if (null === tabId) {
                    Tab.getCurrentlySelectedTabId(sendTabMessageCallback);
                } else {
                    sendTabMessageCallback(tabId);
                }

            // else send message over to bgPage
            } else {
                // add null to send message to this extension
                if ($$.util.isFunc(callback)) {
                    chrome.extension.sendMessage(null, dataObj, callback);
                } else {
                    chrome.extension.sendMessage(null, dataObj);
                }
            }
        };

        // TODO - any hope for returning a response through an async method?
        this.getMessage = function (message, sender, sendResponse) {

            // special exception here to return tab in sender argument if message === 'getThisTab'
            if ('getThisTab' === message) {
                return sendResponse(sender.tab);
            }

            if (!$$.util.isObject(message)) {
                throw new AppTypeError('Messages passed between pages and content scripts must be an object.');
            } else if (!$$.util.isString(message.klass) ||
                       !$$.util.isString(message.method) ||
                       (message.args && !$$.util.isArray(message.args))
            ) {
                throw new AppError('Message passed must be object with string klass, string method and string args');
            }

            var instance = $$(message.klass),
                returnValMixed,
                responseStr,
                methodParams = $$.util.getParamsOfFn(instance[message.method]),
                async = methodParams.indexOf('callback') !== -1;

            responseStr = 'Sending Response back:\n' + message.klass + '.' + message.method + '(' + message.args + ')';

            function done (returnVal) {
                if (typeof returnVal !== 'undefined') {
                    responseStr += ' returned ' + returnVal;
                }
                responseStr =  responseStr.replace('(undefined)', '()');
                console.log(responseStr);
                return sendResponse(returnVal);
            }

            if (false === async) {
                returnValMixed = instance[message.method].apply(instance, message.args || []);

                if (typeof returnValMixed !== 'undefined') {
                    responseStr += ' returned ' + returnValMixed;
                }

                responseStr =  responseStr.replace('(undefined)', '()');

                if (typeof returnValMixed !== 'undefined') {
                    console.log(responseStr);
                }

                done(returnValMixed);
            } else if (true === async) {
                message.args = message.args || [];
                if (message.args.length === (methodParams.length - 1)) {
                    message.args.push(done);
                }
                instance[message.method].apply(instance, message.args);

                // keep the channel open
                // http://developer.chrome.com/extensions/extension.html#event-onMessage
                return true;
            }
        };
    }, {
        _static: true,
        init: function () {

        }
    });
}());