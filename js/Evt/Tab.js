/**
 * Register events for tabs
 */
(function() {
    $$.klass(function EvtTab () {

    }, {
        _static: true,
        init: function () {
            var Url = $$.instance('Url');
            this.registerEvent('onUpdated', 'tabs', Url.setCurrentUrl);
            this.registerEvent('onActivated', 'tabs', Url.setCurrentUrl);
            this.registerEvent('onActivated', 'tabs', Url.setCurrentUrl);
        }
    }).inheritFrom('Evt');
}());