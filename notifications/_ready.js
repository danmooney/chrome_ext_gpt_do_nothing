$(document).ready(function () {
    function addReason (msgStr) {
        var reasonSpan = $('<span></span>'),
            messageSpan = reasonSpan.clone();

        reasonSpan.attr('data-i18n', 'notificationAppStoppedForReason');
        messageSpan.attr('data-i18n', msgStr);

        $(reasonSpan, messageSpan).appendTo('#message');
    }

    $$.instance('Notification').getNotificationMessage(function (msgStr) {
        $('#message').text(msgStr);
        if ($$.util.isString(msgStr)) {
            addReason(msgStr);
        }
    });
});