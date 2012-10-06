/**
 * Locale klass
 * Fills up elements with locale-specific text based on their data-i118n HTML attribute
 */
(function() {
    'use strict';
    $$.klass(function Locale () {
        /**
         * Find out what the message key is from el attributes and return the message
         * @return {String|Boolean}
         */
        var getMessageKeyFromEl = function (el) {
            var messageAttrStr = el.attr('data-i18n'),
                classAttrStr = el.attr('class'),
                classAttrArr = $$.util.isString(classAttrArr)
                    ? classAttrStr.split(' ')
                    : [],
                getMessage = chrome.i18n.getMessage,
                messageStr,
                i;

            // if message exists, no need to use el class attributes
            if (messageStr = getMessage(messageAttrStr)) {
                return messageStr;
            }

            for (i = 0; i < classAttrArr.length; i += 1) {
                classAttrStr = classAttrArr[i];
                classAttrStr = $$.util.convertStrToCamelCase(classAttr, '-');
                classAttrStr = classAttrStr.charAt(0).toUpperCase() + classAttrStr.slice(1);
                if (messageStr = getMessage(messageAttrStr + classAttrStr)) {
                    return messageStr;
                }
            }
            return false;
        };

        this.populateText = function () {
            var els = $('[data-i18n]');

            els.each(function () {
                var el = $(this),
                    messageStr;
                if (messageStr = getMessageKeyFromEl(el)) {
                    el.attr('text', messageStr);
                }
            });
        };
    }, {
        _static: true,
        init: function () {
            setInterval(this.populateText, 1000);
        }
    });
}());