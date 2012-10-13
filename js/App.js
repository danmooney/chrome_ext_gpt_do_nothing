/**
 * App klass
 * Holds reference to curent status
 */
(function() {
    $$.klass(function App () {
        /**
         * Just for reference
         * @type {Array}
         */
        var statusArr = [
            'NotReady',
            'Ready',
            'Working'
        ],

        /**
         * @type {String}
         */
            statusStr = '',
            defaultStatusStr = 'NotReady';

        /**
         * @return {String}
         */
        this.getStatus = function () {
            return statusStr || defaultStatusStr;
        };

        this.setStatus = function (str) {
            if (this.isWorking()) {
                return;
            }
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

        this.isReady = function () {
            return this.getStatus() === 'Ready';
        };

        this.isWorking = function () {
            return this.getStatus() === 'Working';
        };

        this.isNotReady = function () {
            return this.getStatus() === 'NotReady';
        };

    }, {
        _static: true,
        init: function () {
            this.listen('CURRENT_URL_SET', this.checkStatus);
        }
    })
}());