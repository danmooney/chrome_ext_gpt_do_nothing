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
            contentLoadedBool = false,
            defaultStatusStr = 'NotReady';

        /**
         * @return {String}
         */
        this.getStatus = function () {
            return statusStr || defaultStatusStr;
        };

        this.setStatus = function (str, tabId) {
            if (this.isWorking()) {
                this.trigger('APP_STATUS_CHANGED', /** REMOVE LATER AND TRIGGER ON ALL OPEN TABS **/tabId);
                return;
            }
            statusStr = str;
            this.trigger('APP_STATUS_CHANGED', tabId);
        };

        this.checkStatus = function (tabId) {
            var Url = $$.instance('Url'),
                that = this;
            Url.isStartingUrl(null, function (isStartingUrlBool) {
                if (true === isStartingUrlBool) {
                    that.setStatus('Ready', tabId);
                } else {
                    that.setStatus('NotReady', tabId);
                }
            });
        };

        this.stopWorking = function () {
            statusStr = '';
            this.checkStatus();
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

        this.setContentLoaded = function () {
            contentLoadedBool = true;
        };

        this.hasContentLoaded = function () {
            return contentLoadedBool;
        };

    }, {
        _static: true,
        init: function () {
            this.listen('CURRENT_URL_SET', this.checkStatus);
        }
    })
}());