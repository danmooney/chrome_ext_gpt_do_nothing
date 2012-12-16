$(document).ready(function () {
    var Notification = $$('Notification');

    function addReason (msgStr) {
        var reasonSpan = $('<span></span>'),
            messageSpan = reasonSpan.clone();

        reasonSpan.attr('data-i18n', 'notificationAppStoppedForReason');
        messageSpan.attr('data-i18n', msgStr);

        reasonSpan.appendTo('#message');
        messageSpan.appendTo('#message');
    }

    Notification.getNotificationMessage(function (msgStr) {
        if ($$.util.isString(msgStr)) {
            addReason(msgStr);
            Notification.clearNotificationMessage();
        }
    });
});