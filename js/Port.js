/**
 * Wrapper for sending/receiving messages on a long-lived connection
 */
(function() {
    $$.klass(function Port () {

        this.sendMessage = function () {

        };

        this.getMessage = function () {
            console.log(arguments);
        };

    }, {
        _static: true,
        init: function () {

        }
    });
}());