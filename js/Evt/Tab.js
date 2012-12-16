/**
 * Register chrome events for tabs
 */
(function() {
    $$.klass(function EvtTab () {

    }, {
        _static: true,
        init: function () {
            var Url = $$('Url');
            this.registerEvent('onUpdated',   'tabs', Url.setCurrentUrlByTab, Url);
            this.registerEvent('onActivated', 'tabs', Url.setCurrentUrlByTab, Url);
        }
    }).inheritFrom('Evt', 'Tab');
}());