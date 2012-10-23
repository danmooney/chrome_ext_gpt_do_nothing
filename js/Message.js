/**
 * Wrapper for sending/receiving messages
 */
(function() {
    $$.klass(function Message () {
        this.sendMessage = function (dataObj, callback) {
            var Page = $$.instance('Page'),
                isBgPage = Page.isBgPage(),
                Tab,
                tabId;

            // if isBgPage or popup page, send message over to content scripts
            if ((true === isBgPage) ||
                (false === isBgPage && $$.util.isDefined(chrome.tabs))
            ) {
                Tab =  $$.instance('Tab') || Page.getBgPage().$$.instance('Tab');
                // add currentlySelectedTabId to send message to
                // TODO - shouldn't always be currently selected tabid....

                Tab.getCurrentlySelectedTabId(function (tabId) {
                    if ($$.util.isFunc(callback)) {
                        console.log('sending message to ' + tabId);
                        chrome.tabs.sendMessage(tabId, dataObj, callback);
                    } else {
                        chrome.tabs.sendMessage(tabId, dataObj);
                    }
                });

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
            console.log('Got message', message, sender);
            if (!$$.util.isObject(message)) {
                throw new AppTypeError('Messages passed between pages and content scripts must be an object.');
            } else if (!$$.util.isString(message.klass) ||
                       !$$.util.isString(message.method) ||
                       (message.args && !$$.util.isArray(message.args))
            ) {
                throw new AppError('Message passed must be object with string klass, string method and string args');
            }

            var instance = $$.instance(message.klass);

            return sendResponse(instance[message.method].apply(instance, message.args || []));
        };

    }, {
        _static: true,
        init: function () {

        }
    });
}());