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

    }, {
        _static: true,
        /**
         * Adds starting Url to background page's Url klass
         */
        registerStartingUrl: function () {
            var Storage = $$.instance('Storage'),
                that = this,
                Gpt = $$.instance('Gpt'),
                args = $$.util.arrayify(arguments);

            if (this.isSameInstanceAs(Gpt)) {
                return;
            }

            if (!Gpt.paused) {
                Gpt.paused = true;
                Storage.getItem('startingUrls', function (startingUrlObj) {
//                Storage.setPause('startingUrls');

                    startingUrlObj = startingUrlObj || {};
                    console.log(that.constructor.name);
                    if ($$.util.isDefined(startingUrlObj[that.constructor.name])) {
                        return;
                    }
                    console.log(startingUrlObj);
                    debugger;
                    startingUrlObj[that.constructor.name] = that.urlArr;
                    Storage.setItem({startingUrls: startingUrlObj}, function () {
                        Gpt.paused = false;
                    });
                });
            } else {
                setTimeout(function () {
                    console.log('setting timeout');
                    return that.registerStartingUrl.apply(that, arguments);
                }, 100);
            }



//            for (i = 0; i < this.urlArr.length; i += 1) {
//                Message.sendMessage({
//                    klass: 'Url',
//                    method: 'addStartingUrl',
//                    args: [
//                        this.urlArr[i].url
//                    ]
//                });
//            }
        },
        init: function () {
            this.verifyInterface();
            this.registerStartingUrl();
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