(function() {
    'use strict';
    $$.klass(function Notification () {
        /**
         * @param {String}
         */
        var notificationMessage,
            notificationsArr = [];

        this.setNotificationMessage = function (msgStr, callback) {
            $$.instance('Storage').setItem({
                notificationMessage: msgStr
            }, callback);
        };

        this.getNotificationMessage = function (callback) {
            $$.instance('Storage').getItem('notificationMessage', callback);
        };

        this.clearNotificationMessage = function () {
            $$.instance('Storage').removeItem('notificationMessage');
        };

        this.showNotification = function (typeStr) {
            var notification = webkitNotifications.createHTMLNotification('/notifications/' + typeStr + '.html');

            notificationsArr.push(notification);

            notification.show();
            setTimeout(function () {
                notification.cancel();
            }, 5000);
        };
    }, {
        _static: true
    });
}());