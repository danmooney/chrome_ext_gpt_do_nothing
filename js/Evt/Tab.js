/**
 * Register events for tabs
 */
(function() {
    $$.klass(function EvtTab () {

    }, {
        _static: true,
        init: function () {
            var Url = $$.instance('Url');
            this.registerEvent('onUpdated',   'tabs', Url.setCurrentUrl, Url);
            this.registerEvent('onActivated', 'tabs', Url.setCurrentUrl, Url);
        }
    }).inheritFrom('Evt', 'Tab');
}());