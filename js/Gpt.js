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

    }, {
        registerStartingUrl: function () {
            var Url = $$.instance('Url');
        },
        init: function () {
            this.verifyInterface();
            this.registerStartingUrl();
        },
        /**
         * Throw early; verify that everything is good
         */
        verifyInterface: function () {
            var i;

            if (!$$.util.isArray(this.urlArr)) {
                throw new AppTypeError(this.constructor.name + ' does not have urlArr');
            }

            for (i in this.urlArr) {
                if (!this.urlArr.hasOwnProperty(i)) {
                    continue;
                }
                if (!$$.util.isObject()) {
                    throw new AppTypeError(this.constructor.name + ' does not contain only objects in urlArr');
                }

                if (!$$.util.isString(urlArr[i].type)) {
                    throw new AppTypeError(this.constructor.name + ' must have a string type defined in nested objects of urlArr');
                }

                if (!$$.util.isString(urlArr[i].url)) {
                    throw new AppTypeError(this.constructor.name + ' must have a string url defined in nested objects of urlArr');
                }
            }
        }
    });
}());