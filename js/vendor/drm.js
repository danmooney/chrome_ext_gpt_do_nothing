/**
 * Creates klasses, instances, etc.
 * and keeps track of them.  Allows inheritance and provides
 * Utility methods, as well.  No dynamic
 * data is ever passed through this object.
 *
 * @package DRM Klass/Instance Creator
 * @version 10/7/2012
 * @author Dan Mooney
 */
;
/**
 * @param {Object} win global to nest DRM in
 * @param {String} applicationGlobal
 */
(function(win, applicationGlobal) {
    'use strict';

    /**
     * Check application global to ensure that it is not being used
     * @TODO - FINISH
     */
    (function checkApplicationGlobalForAvailability() {

    }());

    win.DRM = {};

    win[applicationGlobal] = {};

    win.DRM.load = new function DRM() {

        var App,

            /**
             * Number of constructors klassed by DRM
             */
                NumberOfCtors = 0,
            /**
             * Number of ctors namespaced under App.namespace
             */
                NumberOfNamespacedCtors = 0,
            /**
             * Number of instances
             */
                NumberOfInstances = 0,
            /**
             * Number of namespaced instances under App.namespace
             */
                NumberOfNamespacedInstances = 0,
            /**
             * Array of initialized instance ids
             *   to prevent init from being called more than once on any given instance
             */
                InitializationArr = [],
            /**
             * Array of setup instance ids
             */
                SetupArr = [],
            /**
             * Config object for debugging
             */
                Config,
            /**
             * Helper object
             */
                Util,
            /**
             * Public Interface
             */
                DRM,
            /**
             * Constructor
             */
                Klass,
            Instance,
            include,
            /**
             * Prototype reference
             */
                fn,
            /**
             * Very valuable object methods
             */
                slice = Array.prototype.slice,
            toString = Object.prototype.toString,

            /**
             * Shorthand references to be used later
             */
                log,
            call,
            isUndefined,
            isFalsy,
            isObject,
            isFunc,
            isString,
            isArray,
            isDefined,
            isEnumerable,
            isScalar;

        Config = {
            /**
             * Log to console
             */
            log: 0
        };

        /**
         * Generic constructor function
         * Stores result inside App.ctors
         * @class Klass
         * @param {Function} includeFn
         * @param {Object} extendObj
         * @return {Function} newCtor
         */
        Klass = function (includeFn, extendObj) {
            if (!Util.isFunc(includeFn)) {
                log.warn('includeFn passed as argument to Klass is not a function');
                return false;
            }

            var newCtor,
                newCtorMethods,
                includeFnCtor = includeFn.prototype.constructor,
                ctorName = includeFnCtor.name,
                ctors = App.ctors,
                ctor = ctors.get(ctorName),
                fnStr = '';

            // IE doesn't store reference to constructor's name!
            if (isUndefined(ctorName)) {
                fnStr = includeFnCtor.toString();
                ctorName = /^\s*(function)\s*([\w]+)/.exec(fnStr)[2];
                includeFn.prototype.constructor.name = ctorName;
                if (isUndefined(ctorName)) {
                    throw new Error('Could not get constructor\'s name in Klass');
                }
            }

            if (ctor !== null) {
                log.warn(ctorName + ' already exists');
                return ctor;
            } else {
                log('Creating and storing ' + ctorName + ' constructor');
            }

            extendObj  = Util.isObject(extendObj)
                ? extendObj
                : {};

            newCtor = includeFn;
            newCtor = Klass.addProxyPrototype.call(newCtor);

            /**
             * Store things on constructor
             */

                // store properties
            Klass.addPropsToCtor(newCtor);

            // store methods
            newCtorMethods = Klass.stripMethods(newCtor);
            newCtor._includedMethods = {};

            /**
             * Add methods or props directly on the prototype
             */
            newCtor.extend = function (extendObj) {
                return Klass.extend.call(this, extendObj);
            };

            /**
             * Get methods or props from a list of ctors and add them after constructor's prototype.
             * @param {Array|String} ctorsList
             * @note this bound to ctor
             */
            newCtor.inheritFrom = function (ctorsList) {
                var proto = this._extendObj || {},
                    ctorName = this.name,
                    args = Util.arrayify(arguments),
                    defaultInheritanceArr = App.defaultInheritance.list(true),
                    extendObjsToInheritFrom = [],
                    currentCtorToGetStr = '',
                    instancesListStr = '',
                    ctorsListStr = '',
                    length = 0,
                    newProtoFn,
                    newProtoFnsArr = [],
                    currentCtorObj,
                    newProtoObj = {},
                    i,
                    j;

                log.on();

                // if instances of ctor (this) already exist, warn and return false
                if (Util.isArray(App.instances.getAllByCtor(ctorName))) {
                    log.warn('inheritFrom called, but cannot add prototypal props to ' + ctorName + '.  Instances of ' + ctorName + ' have already been created.  Aborting...');
                    return false;
                }

                if (isString(ctorsList)) {
                    // if inheriting from same ctor again, return false
                    if (ctorName === ctorsList) {
                        return false;
                    } else {
                        ctorsList = args;
                        // length = args.length;
                    }
                }

                // definitely not a valid argument if this fails
                if (!isArray(ctorsList)) {
                    log.warn('newCtor.inheritFrom requires string or array as argument');
                    return false;
                }

                this._inheritingFrom = this._inheritingFrom || [];
                instancesListStr = this._inheritingFrom.join(',');


                // If any ctors have been set to be inherited by default,
                //   then include those
                if (i = defaultInheritanceArr.length) {
                    while (--i >= 0) {
                        if (!Util.isString(defaultInheritanceArr[i])) {
                            continue;
                        }
                        ctorsList.push(defaultInheritanceArr[i]);
                    }
                }

                length = ctorsList.length;

                for (i = 0; i < length; i += 1) {
                    currentCtorToGetStr = ctorsList[i];
                    extendObjsToInheritFrom[i] = App.ctors.get(currentCtorToGetStr);

                    if (null === extendObjsToInheritFrom[i]) {
                        throw new Error(this.name + ' constructor attempting to inherit from a constructor\'s prototype that doesn\'t exist: ' + currentCtorToGetStr);
                    }

                    extendObjsToInheritFrom[i] = extendObjsToInheritFrom[i]._extendObj;
                    if (isUndefined(extendObjsToInheritFrom[i])) {
                        log.warn(currentCtorToGetStr + ' constructor does not exist.');
                    }
                    // TODO - If inheriting from something already inherited, should this be null (and therefore uncommented)?
                    // else if (instanceListStr.indexOf(currentCtorToGet) !== -1) {
                    // log.warn('You are already inheriting from ' + currentCtorToGetStr);
                    // extendObjsToInheritFrom[i] = null;
                    // }
                    else if (!Util.inArray(this._inheritingFrom, currentCtorToGetStr)) {
                        // add array of instances inherited from to the constructor
                        this._inheritingFrom.push(currentCtorToGetStr);
                    }
                }

                // inherit backwards, those inheritances declared toward beginning of array
                //   overwrite props at end of array
                while (--i >= 0) {
                    currentCtorObj = extendObjsToInheritFrom[i];
                    if (Util.isFalsy(currentCtorObj)) {
                        continue;
                    }
                    // add on the props already in ctor prototype
                    for (j in currentCtorObj) {
                        newProtoObj[j] = currentCtorObj[j];
                    }
                }

                newProtoFn = function PROTOTYPE () {
                    for (i in newProtoObj) {
                        // if inherited prop/method exists in blacklist, don't inherit!
                        if (Util.inArray(Klass.inheritFrom.blacklist, i)) {
                            continue;
                        }

                        this[i] = newProtoObj[i];
                        if (typeof this[i] === 'function') {
                            this[i]._inheritedFrom = this[i]._inheritedFrom || newProtoObj.constructor.name;
                        }
                    }
                    for (i in proto) {
                        this[i] = proto[i];
                    }
                };

                newProtoFn.prototype = DRM.prototype;

                // PROTOTYPE.prototype = Util.deepCopy(ctorToInheritFrom.prototype);
                this.prototype = new newProtoFn();
                log.off();
                return true;
            };

            newCtor._extendObj = extendObj;
            Klass.extend.call(newCtor, extendObj);
            newCtor._extendObj.constructor = newCtor;
            ctors.set(ctorName, newCtor);

            if (App.defaultInheritance.list(true).length > 0) {
                newCtor.inheritFrom([]);
            }

            NumberOfCtors += 1;

            return newCtor;
        };


        Klass.inheritFrom = {};
        /**
         * List of props/methods not to inherit
         * @param {Array}
            */
        Klass.inheritFrom.blacklist = [
            'constructor',
            'extended',
            'id',
            'included',
            'init'
        ];

        Klass.addPropsToCtor = function (ctor) {
            var props = {},
                ctorPropsObj = {},
                i;

            ctor.call(ctorPropsObj);

            for (i in ctorPropsObj) {
                if (typeof ctorPropsObj[i] !== 'function' &&
                    ctorPropsObj.hasOwnProperty(i))
                {
                    props[i] = ctorPropsObj[i];
                }
            }

            ctor._includedProps = props;
        };

        /**
         * Takes all own methods of constructor
         * and strips them out so that they can be
         * properly wrapped in a callback
         */
        Klass.stripMethods = function (ctor) {
            var methods = {},
                ctorPropsObj = {},
                i;

            // populate ctorPropsObj with ctor private instance props/methods
            ctor.call(ctorPropsObj);

            for (i in ctorPropsObj) {
                if (typeof ctorPropsObj[i] === 'function' &&
                    ctorPropsObj.hasOwnProperty(i))
                {
                    methods[i] = ctorPropsObj[i];
                }
            }

            return methods;
        };

        /**
         * Add PROTOTYPE object to be intermediary
         * between inherited objects
         * Used to store constructor
         * @note this bound to newCtor
         * @see Klass
         */
        Klass.addProxyPrototype = function () {
            var newCtor = this;
            function PROTOTYPE() {};
            PROTOTYPE.prototype = DRM.prototype;
            newCtor.prototype = new PROTOTYPE();
            newCtor.prototype.constructor = newCtor;
            return newCtor;
        };

        /**
         * Add prototypal methods and props to PROTOTYPE object
         *
         * @param {Object} extendObj
         * @param {Boolean} mergeTogether objects and arrays (instead of overrwriting them, defaults to true)
         * @note this bound to ctor
         * TODO - TEST merge together logic, test for whether to check hasOwnProperty
         *
         */
        Klass.extend = function (extendObj, mergeTogether) {
            var ctor = this,
                name = this.name;

            mergeTogether = mergeTogether || true;

            log('Extending ' + name, extendObj);

            for (var i in extendObj) {
//            if (!extendObj.hasOwnProperty(i)) {
//                continue;
//            }

                if (isDefined(ctor.prototype[i]) && isEnumerable(ctor.prototype[i])) {
                    // object already exists in prototype, time to mergeTogether
                    if (false === mergeTogether) {
                        continue;
                    }

                    for (var j in extendObj[i]) {
                        ctor.prototype[i][j] = extendObj[i][j];
                    }

                } else {
                    ctor.prototype[i] = ctor._extendObj[i] = extendObj[i];
                }
            }
        };

        /**
         * Transfers the constructor _includedMethods obj directly onto instance
         * @note this bound to instance
         */
        Klass.addMethodsToCtor = function () {
            var _includedMethods = this.constructor._includedMethods,
                i;

            for (i in _includedMethods) {
                if (!_includedMethods.hasOwnProperty(i)) {
                    continue;
                }
                this[i] = _includedMethods[i];
            }
        };

        /**
         * Returns new instance
         * Adds includeObj stored from Klass function
         *
         * @param {String} ctorName
         * @param {Object} includeObj
         * @return {Object} new class
         */
        Instance = function (ctorName, includeObj) {
            if (!isString(ctorName)) {
                log.warn('ctorName passed as argument to Instance is not a string');
                return null;
            }

            var ctors = App.ctors,
                ctor = ctors.get(ctorName),
                newInstance,
                instances = Instance.instances[ctorName];

            if (!ctor) {
                log.warn(ctorName + ' does not exist');
                return null;
            }

            if (ctor.prototype._static === true &&
                isDefined(instances)
                ) {
                return instances[0];
            }

            newInstance = new ctor();
            Instance.generateId.call(newInstance);
            Klass.addMethodsToCtor.call(newInstance);
            fn.include.call(newInstance, includeObj);

            Instance.set(newInstance);

            // bottom up initialization
            if (!ctor.prototype._preventInheritedInit) {
                Instance.executeInitInheritanceChain.call(newInstance, ctor._inheritingFrom);
            }

            // if there is an init method defined inside newInstance as an own property or
            //   on its protoype, then execute it
            if ((typeof ctor.prototype.init === 'function' && !ctor.prototype.init._inheritedFrom) ||
                (newInstance.hasOwnProperty('init')))
            {
                newInstance.init();
                InitializationArr[newInstance.id()] = true;
            }

            if (typeof ctor._extendObj.included === 'function') {
                newInstance.included(includeObj);
            }

            NumberOfInstances += 1;

            return newInstance;
        };

        Instance.idCounter = 0;

        Instance.instances = {};

        /**
         * Avoids using for in loop through _instances object by mapping ids to their respective ctors
         * @type {Array}
         */
        Instance.ctorInstanceIdMap = [];

        /**
         * Execute init methods on every ctor that an instance inherits from
         * @param {Array|undefined} arrCtorList
         * @note this bound to newInstance
         * @TODO - Decide whether to execute init functions from the top-down or from the bottom-up (right now, it's bottom-up)
         */
        Instance.executeInitInheritanceChain = function (arrCtorList) {
            if (!Util.isArray(arrCtorList)) {
                return;
            }

            var i = arrCtorList.length,
                ctor;

            while (--i >= 0) {
                ctor = App.ctors.get(arrCtorList[i]);
                if (!ctor) {
                    continue;
                }
                if (ctor.prototype &&
                    typeof ctor.prototype.init === 'function')
                {
                    ctor.prototype.init.call(this);
                    // Set initialized to true on the id
                    InitializationArr[this.id()] = true;
                }
            }
        };

        /**
         * Sets unique id on the instance
         * @note this bound to instance
         */
        Instance.generateId = function () {
            var _id = Instance.idCounter += 1;
            this.id = function () {
                return _id;
            };
        };

        Instance.set = function (instance) {
            var nameStr = instance.constructor.name,
                id = parseInt(instance.id()),
                instances = Instance.instances,
                ctorInstanceIdMap = Instance.ctorInstanceIdMap;
            log('Storing instance of ' + nameStr + ' with id of ' + id);

            if (isUndefined(instances[nameStr])) {
                // TODO - extend array to include methods for chaining!!!!!
                instances[nameStr] = [];
            }

            instances[nameStr].push(instance);
            ctorInstanceIdMap[id] = nameStr;
        };

        /**
         * @subpackage Util module
         */
        Util = {};

        /**
         * Make true array from array-like array (usually arguments)
         * @param {Arguments} args
         * @return {Array}
         */
        Util.arrayify = function (args) {
            return slice.call(args, 0);
        };

        /**
         * Shallow search for value in array
         * @param {Array} arr to search
         * @param {*} value to search for
         * @param {Boolean} associativeKeyAlso whether or not to search for value on an associative array key as well
         * @return {Boolean}
         */
        Util.inArray = function (arr, value, associativeKeyAlso) {
            if (!Util.isArray(arr)) {
                throw new TypeError(arr, 'Util.inArray expects an array as its first argument');
            }

            var es5Bool = isFunc(Array.prototype.indexOf)
                ?  true
                :  false;

            // if key exists
            if (associativeKeyAlso &&
                typeof value === 'string' &&
                isDefined(arr[value])
                ) {
                return true;
            } else if (true === es5Bool) {
                return arr.indexOf(value) !== -1;
            }

            for (var i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }
                if (arr[i] === value) {
                    return true;
                }
            }

            return false;
        };

        /**
         * Find value (strToSearch) and return its corresponding index.
         * Works with any data type.
         *   Assumes array is numerically indexed!
         * @param {*} strToSearch
         * @param {Array} arr to search inside of
         * @return {Number}
         */
        Util.getIndexInArray = function (strToSearch, arr) {
            if (Array.prototype.indexOf) {
                return arr.indexOf(strToSearch);
            }

            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === strToSearch) {
                    return i;
                }
            }
            return -1;
        };

        /**
         * Traverse array and filter based on filterStr passed as argument
         * "*" will match on all
         * @param {Array} arr
         * @param {String} keyOrValStr 'key' || 'value'
         * @param {String} filterStr
         * @return {Array} newArr
         */
        Util.filterArray = function (arr, keyOrValStr, filterStr) {
            if (!isArray(arr)) {
                log.warn('arr passed as first argument to Util.filterArray is not an array');
                return false;
            }
            arr = arr || [];
            keyOrValStr = keyOrValStr || 'value';
            filterStr = filterStr || '*';

            var newArr = [],
                starSplitWordsArr = [],
                filterRegex,
                starBool = (filterStr.indexOf('*') !== -1),
                isAssociativeBool = Util.isAssociative(arr),
                currentValStr = '',
                i;

            if (true === starBool) {
                // construct a regex
                starSplitWordsArr = filterStr.split('*');
                for (i in starSplitWordsArr) {
                    if (!starSplitWordsArr.hasOwnProperty(i)) {
                        continue;
                    }
                    if ('' === starSplitWordsArr[i]) {
                        continue;
                    }
                    starSplitWordsArr[i] = '(' + starSplitWordsArr[i] + ')';
                }
                filterRegex = new RegExp(starSplitWordsArr.join('.*'));
            }

            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }

                currentValStr = (keyOrValStr === 'value')
                    ?  arr[i]
                    :  i;

                if (false === starBool &&  // no asterisks
                    filterStr === currentValStr // straight string comparison passes
                    ) {
                    if (false === isAssociativeBool) { // not associative
                        newArr.push(arr[i]);
                    } else { // numeric
                        newArr[i] = arr[i];
                    }
                } else if (true === starBool && true === filterRegex.test(currentValStr)) {
                    if (false === isAssociativeBool) { // not associative
                        newArr.push(arr[i]);
                    } else { // numeric
                        newArr[i] = arr[i];
                    }
                }
            }

            return newArr;
        };

        /**
         * Find something inside array based on value and execute callback
         * @param {Array} arr to search
         * @param {Object} filterObj to compare array to
         * @param {Function} callback function to perform on newly filtered array
         * TODO - TEST
         */
        Util.findInArray = function (arr, filterObj, callback) {
            var newArr = [],
                value,
                i,
                j;

            function goThroughFilterObj () {
                for (j in filterObj) {
                    if (!isDefined(arr[j]) || !arr.hasOwnProperty(j)) {
                        continue;
                    }

                    value === (isFunc(filterObj[j]))
                        ?  filterObj[j]()
                        :  filterObj[j];

                    if (arr[j] !== value) {
                        return false;
                    }
                }
                newArr.push(arr[j]);
                return true;
            }

            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }
                goThroughFilterObj();
            }

            callback(newArr);
        };

        /**
         * Take all keys and convert to camel-case, splitting on '-' or '_'
         * ex.  'is-visible' would convert to 'isVisible'
         * @note This function assumes that either '-' or '_' is present, NOT both!
         * @param {Array|Object} arr
         * @return {Array|Object} newArr
         */
        Util.convertKeysToCamelCase = function (arr) {
            var strToSplitAt,
                splitStrArr,
                currKeyStr,
                firstCharStr,
                camelCaseStr,
                newArr = Util.isArray(arr)
                    ? []
                    : {},
                i,
                j;

            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }

                currKeyStr = i.toLowerCase();
                if (currKeyStr.indexOf('_') === -1 &&
                    currKeyStr.indexOf('-') === -1
                    ) {
                    newArr[i] = arr[i];
                    continue;
                }

                strToSplitAt = (currKeyStr.indexOf('_') > -1)
                    ? '_'
                    : '-';

                camelCaseStr = Util.convertStrToCamelCase(currKeyStr, strToSplitAt);

                newArr[camelCaseStr] = arr[i];
            }
            return newArr;
        };


        Util.convertStrToCamelCase = function (str, strToSplitAt) {
            var splitStrArr = str.split(strToSplitAt),
                firstCharStr,
                j = splitStrArr.length;

            while (--j >= 0) {
                if (0 === j) {  // camel case doesn't capitalize first letter!
                    continue;
                }
                firstCharStr = splitStrArr[j].charAt(0).toUpperCase();
                splitStrArr[j] = firstCharStr + splitStrArr[j].substr(1);
            }

            return splitStrArr.join('');
        };
        /**
         * Deep copy an array or object, returning a brand new copy
         * @param {Object|Array} obj
         * @param {Object|Array} newObj
         * @return {Object|Array} newObj
         */
        Util.deepCopy = function (obj, newObj) {
            var thisFn = Util.deepCopy,
                i;

            if (isScalar(obj)) {
                return false;
            }

            newObj = isObject(obj)
                ? {}
                : [];

            for (i in obj) {
                if (!obj.hasOwnProperty(i) ||
                    Util.inArray(Util.deepCopy.blacklist, i)
                    ) {
                    continue;
                }

                if (Util.isObject(obj[i])) {
                    if (obj.hasOwnProperty(i)) {
                        newObj[i] = Util.isFunc(obj[i]) ? obj[i] : {};
                        thisFn(obj[i], newObj[i]);
                    }
                } else if (Util.isArray(obj[i])) { // is array
                    newObj[i] = [];
                    thisFn(obj[i], newObj[i]);
                } else { // primitive type
                    newObj[i] = obj[i];
                }
            }

            return newObj;
        };

        /**
         * List of things not to copy for Util.deepCopy
         * @param {Array}
            */
        Util.deepCopy.blacklist = [
            'constructor',
            'id'
        ];

        /**
         * Add getters and setters to object
         * Also adds a list method for easy retrieval
         * @param {Object} obj repository
         * @return {Function} fn that gets and sets on obj
         */
        Util.getAndSet = function (obj) {
            var fn;

            /**
             * Get or list from repo (this), depending on argument type
             * @param {Boolean|String} boolOrStr list or get, respectively
             */
            fn = function (boolOrStr) {
                // TODO - WORK ON - Should encase in closure to point to get or list method, depending on type of arguments passed
            };

            fn.get = function (thing) {
                if (!Util.isUndefined(obj[thing])) {
                    return obj[thing];
                } else {
                    log(thing + ' is undefined');
                    return null;
                }
            };

            fn.set = function (thing, value, fn) {
                if (!value) {
                    value = thing;
                }
                obj[thing] = value;
            };

            /**
             * List out everything inside obj
             * @param {Boolean} asArray convert to array
             * @TODO - add asArray-handling logic to Util
             */
            fn.list = function (asArray) {
                if (!asArray) {
                    return obj;
                }

                var arr = [],
                    i;

                for (i in obj) {
                    if (!obj.hasOwnProperty(i)) {
                        continue;
                    }
                    arr.push(obj[i]);
                }

                arr.sort();
                return arr;
            };

            return fn;
        };

        /**
         * Get idxs of capital letters in a string name
         * @note There seems to be a glitch in JS interpreters when this function is called too heavily.
         *   Sometimes an array is returned with just the length of the string at the zero-index.
         * @return {Array} capitalLetterIdxsArr
         */
        Util.getCapitalLetterIdxs = (function() {
            window.previousSearchesArr = [];
            return function (str) {
                if (!Util.isString(str)) {
                    log.warn('Argument passed to Util.getCapitalLetterIdxs is not a string');
                    return [];
                } else if (str.length === 0) {
                    return [];
                }

                if (previousSearchesArr[str] && previousSearchesArr[str][0] === 0) {
                    return previousSearchesArr[str];
                }

                var strSplitArr = str.split(''),
                    capitalLetterIdxsArr = [],
                    currChar = '',
                    i = 0;

                for (i = 0; i < strSplitArr.length; i += 1) {
                    currChar = strSplitArr[i];
                    if (currChar != currChar.toLowerCase()) {
                        capitalLetterIdxsArr.push(i);
                    }
                }

                previousSearchesArr[str] = capitalLetterIdxsArr;

                return capitalLetterIdxsArr;
            };
        }());

        /**
         * Looks for params in function's toString and returns them
         * @param {Function}
            * @return {Array}
         */
        Util.getParamsOfFn = function (fn) {
            var fnStr = fn.toString(),
                params = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);

            return params
                ? params
                : [];
        };

        /**
         * Include inside obj
         */
        Util.include = function (obj, anotherObj) {
            for (var i in anotherObj) {
                if (!anotherObj.hasOwnProperty(i)) {
                    continue;
                }
                obj[i] = anotherObj[i];
            }
            return obj;
        },

        /**
         * Checks if array or object is associative or not
         * @param {Array|Object} arr
         * @return {Boolean}
         */
            Util.isAssociative = function (arr) {
                var numRegex = /[0-9]+/;

                for (var i in arr) {
                    if (!arr.hasOwnProperty(i)) {
                        continue;
                    }
                    if (!numRegex.test(i)) {  // if not numeric
                        return true;
                    }
                }

                return false;
            };

        /**
         * My implementation of what falsy values should be
         * Null should also be falsy in JS
         * @return {Boolean}
         */
        Util.isFalsy = function (value) {
            return (
                typeof value === 'undefined' ||
                    value == null ||
                    value == false
                );
        };

        Util.isFunc = function (fn) {
            return typeof fn === 'function';
        };

        Util.isObject = function (obj) {
            return (
                toString.call(obj) === '[object Object]' &&
                    typeof obj === 'object'
                );
        };

        Util.isArray = function (arr) {
            return (toString.call(arr) === '[object Array]');
        };

        Util.isEnumerable = function (thing) {
            return Util.isArray(thing) || Util.isObject(thing);
        };

        Util.isScalar = function (thing) {
            return !Util.isEnumerable(thing);
        };

        Util.isNumber = function (num) {
            num = parseInt(num);
            return (
                !isNaN(num) &&
                    isFinite(num) &&
                    toString.call(num) === '[object Number]'
                );
        };

        Util.isString = function (str) {
            return typeof str === 'string';
        };

        Util.inString = function (str, needle) {
            return str.indexOf(needle) !== -1;
        };

        Util.isUndefined = function (thing) {
            return typeof thing === 'undefined';
        };

        Util.isDefined = function (thing) {
            return typeof thing !== 'undefined';
        };

        /**
         * Convert JSON-stringified values in object or array to JSON-parsed values
         * @param {Array|Object}
            */
        Util.jsonParseThroughObj = function (obj) {
            var newObj = Util.isObject(obj)
                    ? {}
                    : [],
                potentialObj = {},
                i;

            for (i in obj) {
                if (!obj.hasOwnProperty(i) || !Util.isString(obj[i])) {
                    continue;
                }
                try {
                    potentialObj = JSON.parse(obj[i]);
                    newObj[i] = potentialObj;
                } catch (e) {
                    newObj[i] = obj[i];
                }
            }
            return newObj;
        };

        /**
         * Take object or array of key-value pairs and turn into jQuery selector
         * @param {Array|Object}
            * @return {String}
         */
        Util.makeJQuerySelector = function (arr) {
            var selectorStr = '',
                i;

            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }
                if (!Util.isString(arr[i]) && !Util.isNumber(arr[i])) {
                    continue;
                }
                selectorStr += '[' + i + '="' + arr[i] + '"]';
            }

            return selectorStr;
        };

        Util.removeEmptyArrayIdxs = function (arr) {
            arr = arr || [];
            var newArr = [],
                i;

            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }
                if (!Util.isFalsy(arr[i])) {
                    newArr[i] = arr[i];
                }
            }

            return newArr;
        };

        /**
         * Remove "s" in capital words
         * @param {String}
            * @return {String}
         */
        Util.removePluralsInStr = function (str) {
            if (!Util.isString(str)) {
                log.warn('First argument passed to Util.removePluralsInStr is not a string');
                return false;
            }
            var capitalLetterIdxs = Util.getCapitalLetterIdxs(str),
                splitStrArr = str.split(''),
                i = capitalLetterIdxs.length;

            while (--i >= 0) {
                if (str.charAt(capitalLetterIdxs[i] - 1) === 's') {
                    splitStrArr.splice(capitalLetterIdxs[i] - 1, 1);
                }
            }
            return splitStrArr.join('');
        };

        /**
         * Find and replace on associative array keys
         * @param {Array} arr
         * @return {Array} newArr
         */
        Util.strReplaceAssociativeArrKeys = function (arr, strToFind, strToReplace) {
            strToReplace = strToReplace || '';

            var newArr = [],
                newKeyStr = '',
                i;

            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }
                newKeyStr = i.replace(strToFind, strToReplace);
                newArr[newKeyStr] = arr[i];
            }

            return newArr;
        };

        Util.prefixAssociativeArrKeys = function (arr, prefixStr) {
            var newArr = [],
                i;

            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }
                newArr[prefixStr + i] = arr[i];
            }

            return newArr;
        };

        /**
         * Convert array to object
         * @param {Array} arr
         * @return {Object} obj
         */
        Util.toObject = function (arr) {
            var obj = {},
                i;
            for (i in arr) {
                if (!arr.hasOwnProperty(i)) {
                    continue;
                }
                obj[i] = arr[i];
            }
            return obj;
        };

        App = {};

        App.abilities = new function() {
            var _abilities = {};
            return Util.getAndSet(_abilities);
        };

        App.ctors = new function() {
            var _ctors = {};
            return Util.getAndSet(_ctors);
        };

        App.defaultInheritance = new function() {
            var _defaultInheritance = {};
            return Util.getAndSet(_defaultInheritance);
        };

        /**
         * Useful function for gathering all constructors, instantiating them,
         *   and placing them within the appropriate nested objects
         *   based on the capitalization of letters.
         * @param {String} globalOverride to nest namespaced objects inside, Will use applicationGlobal if not present.
         */
        App.namespace = function (globalOverride) {
            if (NumberOfCtors === 0 || (
                (NumberOfCtors === NumberOfNamespacedCtors) &&
                    NumberOfInstances === NumberOfNamespacedInstances)
                ) {
                return false;
            }
            NumberOfNamespacedCtors = NumberOfCtors;
            NumberOfNamespacedInstances = App.instances.count();

            // get constructor list as an array
            var ctorListArr = App.ctors.list(true),
                i = ctorListArr.length,
                j,
                length,
                ctorName = '',
                ctor = {},
                thisCtor = {},
                capitalLetterIdxsArr = [],
            // string that represents capital letter sighting, used for naming nested objects
                initialNamespaceStr = '',
                ctorNestArr = [],
                prevCtorNestArr = [],
                ctorWordStr = '',
                applicationGlobalStr = Util.isString(globalOverride)
                    ? globalOverride
                    : applicationGlobal,
                globalObj = win[applicationGlobalStr] = (win[applicationGlobalStr] || {});

            /**
             * Nest contents of ctorNestArr one by one inside of obj
             * This function will be recursively called to nest deeper until ctorNestArr.length === 0
             * @param {Object} obj
             * @param {Array} ctorNestArr
             * @param {String} initialNamespaceStr
             */
            function nest (obj, ctorNestArr, initialNamespaceStr) {
                var nestedStr = ctorNestArr.shift(),
                    fullKlassStr = prevCtorNestArr.join('') + nestedStr,
                    ctor = App.ctors.get(fullKlassStr) || App.ctors.get(Util.removePluralsInStr(fullKlassStr)),
                    instancesArr,
                    j = 0;

                if ('' === nestedStr) {
                    return;
                }

                log('Nesting ' + fullKlassStr);
                if (isUndefined(obj[nestedStr]) ||
                    isObject(obj[nestedStr]) ||
                    isArray(obj[nestedStr])
                    ) {
                    // if not static, store static instance in applicationGlobal
                    if (ctor && ctor.prototype._static === true) {
                        obj[nestedStr] = Instance(fullKlassStr) || Instance(ctor.name);
                    } else if (ctor && !ctor.prototype._static) {
                        nestedStr += 's';
                        if (isArray(obj[nestedStr])) {  // if already an array, it may contain nested instances of completely different objects, so just check the length and overwrite
                            instancesArr = App.instances(fullKlassStr) || App.instances(ctor.name);
                            if (!instancesArr || (instancesArr.length === obj[nestedStr].length)) {
                                // clear array to prevent inefficient overrwriting from occurring in the following for loop
                                instancesArr = [];
                            }

                            for (j = 0; j < instancesArr.length; j += 1) {
                                if (Util.inArray(obj[nestedStr], instancesArr[j])) {
                                    continue;
                                }

                                obj[nestedStr].push(instancesArr[j]);
                            }
                        } else {
                            obj[nestedStr] = App.instances(fullKlassStr) || App.instances(ctor.name) || [];
                        }
                    } else if (!ctor) {
                        obj[nestedStr] = obj[nestedStr] || {};
                    }
                }

                prevCtorNestArr.push(nestedStr);
                if (ctorNestArr.length > 0) {
                    nest(obj[nestedStr], ctorNestArr, initialNamespaceStr);
                }
            }

            // populate namespace nested array
            while (--i >= 0) {
                ctor = ctorListArr[i];
                ctorName = ctor.name;
                // get capitalLetterIdxs of ctor.name
                capitalLetterIdxsArr = Util.getCapitalLetterIdxs(ctorName);

                capitalLetterIdxsArr.push(ctorName.length);

                log(capitalLetterIdxsArr.join(', '));

                // take each capital word and nest it
                while (capitalLetterIdxsArr.length > 1) {
                    ctorWordStr = ctorName.substring(capitalLetterIdxsArr[0], capitalLetterIdxsArr[1]);
                    ctorNestArr.push(ctorWordStr);
                    capitalLetterIdxsArr.splice(0, 1);
                }

                log(ctorNestArr.join(', '));

                // recursively nest
                if (ctorNestArr.length > 0) {
                    nest(globalObj, ctorNestArr);
                }

                // wipe out initialNamespaceStr
                initialNamespaceStr = '';

                // wipe out ctorNameArr
                ctorNestArr = [];

                prevCtorNestArr = [];
            }   // END OF MAIN CTOR WHILE LOOP

            // if instances were created inside nest function, call this function again
            if (App.instances.count() !== NumberOfNamespacedInstances) {
                App.namespace(globalOverride);
            }

            return true;
        };

        /**
         * Repository for all of the instances created,
         * categorized by klass name.
         * This method is too complicated to call simple Util.getAndSet on
         * @TODO - write 'where' method (like with sql)... preferably chain to methods.getAllByCtor or methods.list by extending
         *   each array returned
         */
        App.instances = new function() {
            var _instances = Instance.instances,
                _ctorInstanceIdMap = Instance.ctorInstanceIdMap,
                methods;

            /**
             * Alias to getAllByCtor
             */
            methods = function (nameStr) {
                return isUndefined(nameStr)
                    ? methods.list()
                    : methods.getAllByCtor(nameStr);
            };

            methods.getAllByCtor = function (nameStr) {
                if (isUndefined(_instances[nameStr])) {
                    return null;
                }

                return _instances[nameStr];
            };

            methods.getById = function (id) {
                id = parseInt(id);

                var ctorToLookThrough = _ctorInstanceIdMap[id],
                    instancesArr,
                    i;

                if (isUndefined(ctorToLookThrough)) {
                    return null;
                }

                instancesArr = _instances[ctorToLookThrough];

                i = instancesArr.length;
                while (--i >= 0) {
                    if (instancesArr[i].id() === id) {
                        return instancesArr[i];
                    }
                }

                throw new ReferenceError('Instance with id ' + id + ' not found in ' + ctorToLookThrough);
            };

            methods.list = function () {
                return _instances;
            }

            methods.count = function () {
                var count = 0,
                    instances = App.instances.list(),
                    i;

                for (i in instances) {
                    if (!instances.hasOwnProperty(i)) {
                        continue;
                    }
                    count += instances[i].length;
                }

                return count;
            };

            return methods;
        };

        /**
         * Add empty functions for browsers that don't have the ability to do certain things
         *  to avoid throwing errors
         * @param {Array|String} methods to masquerade
         */
        App.abilities.masquerade = function (methods) {
            var fn = function () {},
                i = 0;

            if (!methods) {
                return false;
            } else if (Util.isString(methods)) { // use arguments instead
                methods = Util.arrayify(arguments);
            }

            for (i in methods) {
                if (!methods.hasOwnProperty(i)) {
                    continue;
                }
                if (!Util.isString(methods[i])) {
                    log.warn(methods[i] + ' passed to App.abilities.masquerade is not a string');
                    return false;
                }

                fn[methods[i]] = function () {};
            }
            return fn;
        };

        App.log = new function() {
            var log;

            if (typeof console === 'object' &&
                typeof console.log === 'function')
            {
                App.abilities.set('console', true);
            } else {
                App.abilities.set('console', false);
                return App.abilities.masquerade([
                    'warn',
                    'trace',
                    'on',
                    'ON',
                    'off'
                ]);
            }

            log = function (msg) {
                if (Config.log) {
                    console.log(arguments);
                }
            };

            log.warn = function (msg) {
                if (Config.log) {
                    console.warn(arguments);
                }

                return this;
            };

            log.trace = function () {
                if (Config.log) {
                    console.trace();
                }

                return this;
            };

            /**
             * Turn log on and off
             * @TODO - Remove in production!
             */
            log.on = function () {
                Config.log = 1;
            };

            log.ON = function () {
                Config.log = 1;
                Config.alwaysLog = 1;
            };

            log.off = function () {
                if (Config.alwaysLog) {
                    return;
                }
                Config.log = 0;
            };

            return log;
        };

        DRM = function () {
            /**
             * Make new class
             */
            this.klass = function (ctorFn, includeObj) {
                return Klass.apply(null, arguments);
            };

            /**
             * Make instance of ctorName
             * @param {String} ctorName
             * @return {Object|Boolean} instance of ctor or false if error occurs
             */
            this.instance = function (ctorName) {
                return Instance.apply(null, arguments);
            };

            /**
             * Get application global passed as parameter to enclosing anonymous function
             * @return {String}
             */
            this.getApplicationGlobal = function () {
                return win[applicationGlobal] || win || window;
            };

            this.app = App;
            this.util = Util;
        };

        DRM.prototype = (function() {
            var fn = {};

            /**
             * Add instance props/methods
             * Call included method on instance if exists
             * @note this bound to instance
             * @see Instance function
             * @TODO - Figure out whether to execute includedInheritanceChain like with initInheritanceChain
             */
            fn.include = function (includeObj) {
                var instance = this;

                includeObj = includeObj || {};

                log('Including inside instance of ' + this.constructor.name, includeObj);

                if (!isObject(includeObj)) {
                    log.warn('includeObj passed to fn.include is not an object');
                    return false;
                }

                for (var j in includeObj) {
                    instance[j] = includeObj[j];
                }

                if (typeof this.constructor._extendObj.included === 'function') {
                    this.included(includeObj);
                }

                return this;
            };

            /**
             * Helper method for getting a a ctor by name
             * @param {String} ctorNameStr constructor name.  If empty, will return instance's constructor.
             * @note bound to this
             */
            fn.ctor = function (ctorNameStr) {
                if (this instanceof DRM &&
                    Util.isString(ctorNameStr)
                    ) {
                    return App.ctors.get(ctorNameStr);
                } else {
                    return App.ctors.get(this.constructor.name);
                }
            };

            /**
             * Validate what instance is actually an instance of
             * @return {Boolean}
             */
            fn.isInstanceOf = function (ctorNameStr) {
                return this.constructor.name === ctorNameStr;
            };

            /**
             * Checks if instance shares ctor with another instance
             * @param {Object} anotherInstanceObj Another instance
             * @return {Boolean}
             */
            fn.isSameInstanceAs = function (anotherInstanceObj) {
                return this.constructor.name === anotherInstanceObj.constructor.name;
            };

            /**
             * Checks if instance is inheriting from a ctor
             * @param {String} ctorNameStr constructor name
             * @return {Boolean}
             */
            fn.isInheritingFrom = function (ctorNameStr) {
                return Util.inArray(this.constructor._inheritingFrom, ctorNameStr)
                    ? true
                    : false;
            };

            fn.isStatic = function () {
                return this.constructor.prototype._static === true;
            };

            /**
             * Checks if element is initialized by checking in InitializationArr repository
             * @note this bound to instance
             * @return {Boolean}
             */
            fn.isInitialized = function () {
                return (
                    typeof this.id === 'function' &&
                        InitializationArr[this.id()] === true
                    );
            };

            /**
             * @return {Boolean}
             */
            fn.isDoneWithSetup = function () {
                return (
                    typeof this.id === 'function' &&
                        SetupArr[this.id()] === true
                    );
            };

            fn.doneWithSetup = function () {
                SetupArr[this.id()] = true;
            };

            // TODO
            fn.remove = function () {

            };

            return fn;
        }());

        fn = DRM.prototype;
        log = App.log;
        call = Util.call;
        isUndefined = Util.isUndefined;
        isObject = Util.isObject;
        isString = Util.isString;
        isFunc = Util.isFunc;
        isArray = Util.isArray;
        isFalsy = Util.isFalsy;
        isDefined = Util.isDefined;
        isEnumerable = Util.isEnumerable;
        isScalar = Util.isScalar;

        /** Global Library Namespace **/
        win.$$ = win.DRM = new DRM();

    }; // end of DRM.load function
}(window, 'GPT'));
// End library