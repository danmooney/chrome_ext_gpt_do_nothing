(function() {
    'use strict';
    $$.klass(function Gpt () {
        // this acts as an interface (or more like abstract klass)
        // and helps to build a solid structure

        var currentRegisteredGptKlassesNum = 0,
            gptKlassesNum = 0;

        /**
         * List of starting urls to register on
         * Contents can only be of type object and must contain the following keys
         *   -  url: The registered url.  They are evaluated as regexes.
         *   -  type: String.  Can be either 'offers', 'surveys', ...
         * @type {Array}
         */
        this.urlArr = [];

        this.getCurrentRegisteredGptKlassesNum = function () {
            return currentRegisteredGptKlassesNum;
        };

        this.addOneToCurrentRegisteredGptKlassesNum = function () {
            currentRegisteredGptKlassesNum += 1;
        };

        this.setGptKlassesNum = function (gptKlassesNumArg) {
            gptKlassesNum = gptKlassesNumArg;
        };

        this.getGptKlassesNum = function () {
            return gptKlassesNum;
        };


        /**
         * Set url object from current Gpt Klass
         * @param {Object} currentGptUrlObj
         * @param {Function} callback
         * @deprecated
         */
        this.setCurrentGptUrlObj = function (currentGptUrlObj, callback) {
            throw new AppError('Gpt.setCurrentGptUrlObj is deprecated');
//            var Storage = $$('Storage');
//            Storage.setItem('currentGptUrlObj', currentGptUrlObj, callback);
        };

        /**
         * @deprecated
         */
        this.getCurrentGptUrlObj = function (callback) {
            throw new AppError('Gpt.getCurrentGptUrlObj is deprecated');
//            var Storage = $$('Storage');
//            Storage.getItem('currentGptUrlObj', callback);
        };

        this.setCurrentGptUrlObjIdxNum = function (currentGptUrlObjIdxNum, callback) {
            var Storage = $$('Storage');
            Storage.setItem('currentGptUrlObjIdx', currentGptUrlObjIdxNum, callback);
        };

        this.getCurrentGptUrlObjIdxNum = function (callback) {
            var Storage = $$('Storage');
            Storage.getItem('currentGptUrlObjIdx', callback);
        };



        this.setCurrentGptKlass = function (gptKlassStr) {
            var Message = $$('Message'),
                Storage = $$('Storage'),
                that = this;
            Message.sendMessage({
                klass: 'App',
                method: 'isWorking'
            }, function (isWorkingBool) {
                if (true === isWorkingBool) {
                    return;
                }

                Storage.setItem('currentGptKlass', gptKlassStr);
            });
        };

        this.getCurrentGptKlass = function (callback) {
            var Storage = $$('Storage');
            Storage.getItem('currentGptKlass', function (gptKlassStr) {
                console.log(gptKlassStr);
                callback(gptKlassStr);
            });
        };

    }, {
        _static: true,
        /**
         * Adds starting Url to background page's Url klass
         */
        registerStartingUrl: function () {
            var Storage = $$('Storage'),
                Message = $$('Message'),
                Gpt = $$('Gpt'),
                that = this;

            Message.sendMessage({
                klass: 'App',
                method: 'hasContentLoaded'
            }, function (contentLoadedBool) {
                if (true === contentLoadedBool) {
                    return;
                }

                if (Gpt.getCurrentRegisteredGptKlassesNum() >=
                    Gpt.getGptKlassesNum()
                ) {
                    Message.sendMessage({
                        klass: 'App',
                        method: 'setContentLoaded',
                        args: [true]
                    });
                    return;
                }

                Storage.freezeGetOnItem('startingUrls');
                Storage.getItem('startingUrls', function (startingUrlObj) {
                    Gpt.addOneToCurrentRegisteredGptKlassesNum();
//                    console.log('just got ' + that.constructor.name, startingUrlObj, new Date());
                    startingUrlObj = startingUrlObj || {};
                    startingUrlObj[that.constructor.name] = that.urlArr;
                    Storage.setItem('startingUrls', startingUrlObj, function () {
//                        console.log('just set ' + that.constructor.name, startingUrlObj, new Date());
                        Storage.releaseGetOnItem('startingUrls'); // releasing and freezing to allow another GPT klass to fetch startingUrls
                        Storage.freezeGetOnItem('startingUrls');
                    });
                });
            });
        },

        /**
         * Store klass name in storage
         */
        registerGptKlass: function () {
            var Storage = $$('Storage'),
                Message = $$('Message'),
                klassNameStr = this.constructor.name.replace('Gpt', '').toUpperCase(),
                that = this;

            Message.sendMessage({
                klass: 'App',
                method: 'hasContentLoaded'
            }, function (contentLoadedBool) {
                if (true === contentLoadedBool) {
                    return;
                }
                Storage.freezeGetOnItem('gptKlasses');
                Storage.getItem('gptKlasses', function (gptKlassObj) {
//                    console.log('just got ' + that.constructor.name, gptKlassObj, new Date());
                    gptKlassObj = gptKlassObj || [];
                    gptKlassObj[klassNameStr] = klassNameStr;
                    Storage.setItem('gptKlasses', gptKlassObj, function () {
//                        console.log('just set ' + that.constructor.name, gptKlassObj, new Date());
                        Storage.releaseGetOnItem('gptKlasses');
                        Storage.freezeGetOnItem('gptKlasses');
                    });
                });
            });
        },

        init: function () {
            var Gpt = $$.ctor('Gpt');
            if (this instanceof Gpt) {
                return;
            }
            this.verifyInterface();
        },
        ready: function () {
            this.registerStartingUrl();
            this.registerGptKlass();
        },
        /**
         * Throw early; verify that everything is good
         */
        verifyInterface: function () {
            var urlObj,
                i;

            if (!$$.util.isArray(this.urlArr)) {
                throw new AppTypeError(this.constructor.name + ' does not have urlArr');
            }

            for (i = 0; i < this.urlArr.length; i += 1) {
                if (!this.urlArr.hasOwnProperty(i)) {
                    continue;
                }

                urlObj = this.urlArr[i];

                if (!$$.util.isObject(urlObj)) {
                    throw new AppTypeError(this.constructor.name + ' does not contain only objects in urlArr');
                }

                if (!$$.util.isString(urlObj.type)) {
                    throw new AppTypeError(this.constructor.name + ' must have a string type defined in nested objects of urlArr');
                }

                if (!$$.util.isString(urlObj.url)) {
                    throw new AppTypeError(this.constructor.name + ' must have a string url defined in nested objects of urlArr');
                }
            }
        }
    });
}());