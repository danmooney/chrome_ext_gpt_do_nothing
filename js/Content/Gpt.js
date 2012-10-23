(function() {
    'use strict';
    $$.klass(function Gpt () {
        // this acts as an interface (or more like abstract klass)
        // and helps to build a solid structure

        /**
         * List of starting urls to register on
         * Contents can only be of type object and must contain the following keys
         *   -  url: The registered url.  They are evaluated as regexes.
         *   -  type: String.  Can be either 'offers', 'surveys', ... TODO - expand upon list
         * @type {Array}
         */
        this.urlArr = [];

        this.paused = false;

        this.currentGptKlassStr = '';

        this.setCurrentGptKlass = function (gptKlassStr) {
            this.currentGptKlassStr = gptKlassStr;
        };

        this.getCurrentGptKlass = function () {
            return this.currentGptKlassStr;
        };

    }, {
        _static: true,
        /**
         * Adds starting Url to background page's Url klass
         */
        registerStartingUrl: function () {
            var Storage = $$.instance('Storage'),
                Message = $$.instance('Message'),
                that = this;

            Message.sendMessage({
                klass: 'App',
                method: 'hasContentLoaded'
            }, function (contentLoadedBool) {
                if (true === contentLoadedBool) {
                    return;
                }
                Storage.freezeGetOnItem('startingUrls');
                Storage.getItem('startingUrls', function (startingUrlObj) {
                    console.log('just got ' + that.constructor.name, startingUrlObj, new Date());
                    startingUrlObj = startingUrlObj || {};
                    startingUrlObj[that.constructor.name] = that.urlArr;
                    Storage.setItem({startingUrls: startingUrlObj}, function () {
                        console.log('just set ' + that.constructor.name, startingUrlObj, new Date());
                        Storage.releaseGetOnItem('startingUrls');
                        Storage.freezeGetOnItem('startingUrls');
                    });
                });
            });
        },

        /**
         * Store klass name in storage
         */
        registerGptKlass: function () {
            var Storage = $$.instance('Storage'),
                Message = $$.instance('Message'),
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
                    console.log('just got ' + that.constructor.name, gptKlassObj, new Date());
                    gptKlassObj = gptKlassObj || [];
                    gptKlassObj[klassNameStr] = klassNameStr;
                    Storage.setItem({gptKlasses: gptKlassObj}, function () {
                        console.log('just set ' + that.constructor.name, gptKlassObj, new Date());
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