/**
 * Wrapper for sending/receiving messages
 */
(function() {
    $$.klass(function Message () {

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