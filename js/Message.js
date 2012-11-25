/**
 * Wrapper for sending/receiving messages
 */
(function() {
    $$.klass(function Message () {
        this.sendMessage = function (dataObj, callback) {
            var Page = $$.instance('Page'),
                isBgPage = Page.isBgPage(),
                Tab,
                tabId = dataObj.tabId || null;

            // if isBgPage or popup page, send message over to content scripts
            if ((true === isBgPage) ||
                (false === isBgPage && $$.util.isDefined(chrome.tabs))
            ) {
                Tab =  $$.instance('Tab') || Page.getBgPage().$$.instance('Tab');

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

        this.getMessage = function (message, sender, sendResponse) {
            console.log('Got message:\n', message.klass + '.' + message.method, message.args, sender);
            if (!$$.util.isObject(message)) {
                throw new AppTypeError('Messages passed between pages and content scripts must be an object.');
            } else if (!$$.util.isString(message.klass) ||
                       !$$.util.isString(message.method) ||
                       (message.args && !$$.util.isArray(message.args))
            ) {
                throw new AppError('Message passed must be object with string klass, string method and string args');
            }

            var instance = $$.instance(message.klass),
                returnValMixed = instance[message.method].apply(instance, message.args || []);

            if (typeof returnValMixed !== 'undefined') {
                console.log('Sending Response back:\n', returnValMixed);
            }


            return sendResponse(returnValMixed);
        };

    }, {
        _static: true,
        init: function () {

        }
    });
}());