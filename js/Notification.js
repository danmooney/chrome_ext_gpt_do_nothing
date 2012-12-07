(function() {
    'use strict';
    $$.klass(function Notification () {
        /**
         * @param {String}
         */
        var notificationMessage;

        this.setNotificationMessage = function (msgStr, callback) {
            $$.instance('Storage').setItem({
                notificationStorage: msgStr
            }, callback);
        };

        this.getNotificationMessage = function (callback) {
            $$.instance('Storage').getItem('notificationMessage', callback);
        };

        this.clearNotificationMessage = function () {
            $$.instance('Storage').clearItem('notificationMessage');
        };

        this.showNotification = function (typeStr) {
            var notification = webkitNotifications.createHTMLNotification('/notifications/' + typeStr + '.html');
            notification.show();
            setTimeout(function () {
                notification.cancel();
            }, 5000);
        };
    }, {
        _static: true
    });
}());