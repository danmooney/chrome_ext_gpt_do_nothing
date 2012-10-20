/**
 * Wrapper for sending/receiving messages
 */
(function() {
    $$.klass(function Message () {

        this.sendMessage = function () {
            var Page = $$.instance('Page'),
                isBgPage = Page.isBgPage(),
                Tab = $$.instance('Tab'),
                args = $$.util.arrayify(arguments);

            // if isBgPage, send message over to content scripts
            if (true === isBgPage) {
                // add currentlySelectedTabId to send message to
                // TODO - shouldn't always be currently selected tabid....
                args.unshift(Tab.currentlySelectedTabId);
                chrome.tabs.sendMessage.apply(null, args);
            // else send message over to bgPage
            } else {
                // add null to send message to this extension
                args.unshift(null);
                chrome.extension.sendMessage.apply(null, args);
            }
        };

        this.getMessage = function (message, sender, sendResponse) {
            if (!$$.util.isObject(message)) {
                throw new AppTypeError('Messages passed between pages and content scripts must be an object.');
            } else if (!$$.util.isString(message.klass) ||
                       !$$.util.isString(message.method) ||
                       !$$.util.isArray(message.args)
            ) {
                throw new AppError('Message passed must be object with string klass, string method and string args');
            }

            var instance = $$.instance(message.klass);

            return instance[message.method].apply(instance, message.args);
        };

    }, {
        _static: true,
        init: function () {

        }
    });
}());