/**
 * App klass for background page
 * Holds reference to curent status
 */
(function() {
    $$.klass(function App () {
        /**
         * Just for reference
         * @type {Array}
         */
        /*  statusArr = [
            'NotReady',
            'Ready',
            'Working'
        ],*/

        /**
         * @type {String}
         */
        var statusStr = '',
            contentLoadedBool = false,
            defaultStatusStr = 'NotReady';

        /**
         * @return {String}
         */
        this.getStatus = function () {
            return statusStr || defaultStatusStr;
        };

        /**
         * Override for removing 'Working' status
         */
        this.stopWorking = function () {
            // clear status
            statusStr = '';
            this.checkStatus();
        };

        /**
         * Set application status
         * If app is 'Working', status will not be set!
         * @param str
         * @param tabId
         */
        this.setStatus = function (str, tabId) {
            var nowWorkingBool = false;
            if (!this.isWorking()) {
                statusStr = str;
                if ('Working' === str) {
                    nowWorkingBool = true;
                }
            }

            this.trigger('APP_STATUS_CHANGED', tabId);
            if (true === nowWorkingBool) {
                console.warn('NOW WORKING');
                this.trigger('APP_STARTED_WORKING', tabId);
            }
        };

        this.checkStatus = function (tabId) {
            var Url = $$.instance('Url'),
                Message = $$.instance('Message'),
                that = this;
            Url.isStartingUrl(null, function (isStartingUrlBool, gptKlassStr, currentGptUrlObj) {
                if (true === isStartingUrlBool) {
                    that.trigger('IS_STARTING_URL', gptKlassStr);  // nobody listening
                    // set current GPT klass
                    Message.sendMessage({
                        klass: 'Gpt',
                        method: 'setCurrentGptKlass',
                        args: [
                            gptKlassStr
                        ]
                    }, function () {
                        Message.sendMessage({
                            klass: 'Gpt',
                            method: 'setCurrentGptUrlObj',
                            args: [
                                currentGptUrlObj
                            ]
                        }, function () {
                            that.setStatus('Ready', tabId);
                        });
                    });
                } else {
                    that.setStatus('NotReady', tabId);
                }
            });
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

        this.getApplicationGlobal = function () {
            return $$.getApplicationGlobal();
        };
    }, {
        _static: true,
        init: function () {
            this.listen('CURRENT_URL_SET', this.checkStatus);
        }
    })
}());