/**
 * Register chrome message listening
 */
(function() {
    $$.klass(function EvtMessage () {

    }, {
        _static: true,
        init: function () {
            var Message = $$.instance('Message'),
                Page = $$.instance('Page');

            this.registerEvent('onMessage', 'extension', Message.getMessage, Message);
        }
    }).inheritFrom('Evt');
}());