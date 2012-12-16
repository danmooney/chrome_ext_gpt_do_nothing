(function() {
    'use strict';
    $$.klass(function Notification () {
        /**
         * @param {String}
         */
        var notificationMessage,
            notificationsArr = [];

        this.setNotificationMessage = function (msgStr, callback) {
            $$('Storage').setItem({
                notificationMessage: msgStr
            }, callback);
        };

        this.getNotificationMessage = function (callback) {
            $$('Storage').getItem('notificationMessage', callback);
        };

        this.clearNotificationMessage = function () {
            $$('Storage').removeItem('notificationMessage');
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