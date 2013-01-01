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
         * @param {String} reasonStr used for notifying user why app stopped working
         */
        this.stopWorking = function (reasonStr) {
            var Notification = $$('Notification'),
                that = this;

            alert('STOPPING WORK');
            debugger;

            // clear status
            statusStr = '';

            function callback () {
                Notification.showNotification('app_stopped');
                that.trigger('APP_STOPPED_WORKING');
                that.checkStatus();
            }

            if ($$.util.isString(reasonStr)) {
                Notification.setNotificationMessage(reasonStr, callback);
            } else {
                callback();
            }
        };

        /**
         * Set application status
         * If app is 'Working', status will not be set!
         * @param {String} str
         * @param {Number} tabId Optional
         */
        this.setStatus = function (str, tabId) {
            var Notification = $$('Notification'),
                nowWorkingBool = false;

            if (!this.isWorking()) {
                statusStr = str;
                if ('Working' === str) {
                    nowWorkingBool = true;
                }
                this.trigger('APP_STATUS_CHANGED', tabId);
            }


            if (true === nowWorkingBool) {
                console.warn('NOW WORKING');
                Notification.showNotification('app_started');
                this.trigger('APP_STARTED_WORKING', tabId);
            }
        };

        /**
         * Check and set status accordingly
         * @param {Number} tabId
         */
        this.checkStatus = function (tabId) {
            var Window = $$('Window'),
                Url = $$('Url'),
                Message = $$('Message'),
                that = this;

            if (this.isWorking()) {  // just get the icon to look right
//                this.setStatus('Working');
                this.trigger('APP_STATUS_CHANGED', tabId);
                return;
            }
            Window.getCurrentlySelectedWindow(function (window) {
                if (false === window.incognito) {
                    that.setStatus('NotReady', tabId);
                } else {
                    Url.isStartingUrl(null, function (isStartingUrlBool, gptKlassStr, currentGptUrlObjIdxNum/*currentGptUrlObj*/) {
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
                                    method: 'setCurrentGptUrlObjIdxNum',
                                    args: [
                                        currentGptUrlObjIdxNum
                                    ]
                                }, function () {
                                    Window.storeGptKlassWindowId(window.id, function () {
                                        that.setStatus('Ready', tabId);
                                    });
                                });
                            });
                        } else {
                            console.warn('SETTING STATUS TO NOT READY');
                            that.setStatus('NotReady', tabId);
                        }
                    });
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