/**
 * App klass
 * Holds reference to curent status
 */
(function() {
    $$.klass(function App () {
        /**
         * @type {String}
         */
        var statusStr = '',
            defaultStatusStr = 'NotReady';

        /**
         * @return {String}
         */
        this.getStatus = function () {
            return statusStr || defaultStatusStr;
        };

        this.setStatus = function (str) {
            statusStr = str;
        };

        this.checkStatus = function (tabId) {
            var Url = $$.instance('Url');
            if (Url.isStartingUrl()) {
                this.setStatus('Ready');
            } else {
                this.setStatus('NotReady');
            }
            this.trigger('STATUS_CHANGED', tabId);
        };

    }, {
        _static: true,
        init: function () {
            this.listen('CURRENT_URL_SET', this.checkStatus);
        }
    })
}());