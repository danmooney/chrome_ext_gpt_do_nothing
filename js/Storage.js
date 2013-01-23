/**
 * Interface for Chrome storage API
 *
 * List of storage keys used throughout the app:
 * 'startingUrls' = list of urls to register ready status with application
 */
(function() {
    'use strict';
    $$.klass(function Storage () {

        /**
         * Lookup of items set in storage during this klass's lifespan
         * @type {Object}
         */
        this.items = {};

        /**
         * Array of frozen items with numbers
         * representing their fetch attempts as values
         * @type {Array}
         */
        this.frozenItemArr = [];

        /**
         * @type {Number}
         */
        this.freezeTimeoutNum = 200;
    }, {
        _static: true,

        /**
         * Remove items
         */
        init: function () {
            var that = this;
            this.listen('APP_STARTED_WORKING', function () {
                that.removeItem('lastForms');
            });
        },

        /**
         * @param {String} itemNameStr
         * @param {Function} callback
         * @param {Boolean} allData  - TODO - is this even in use?
         */
        getItem: function (itemNameStr, callback, allData) {

            // check if frozen
            if (this.isItemFrozen(itemNameStr)) {
                this.addFetchAttemptToFrozenItem(itemNameStr);
                return this.setFreezeTimeout.apply(this, arguments);
            } else {
                this.addFetchAttemptToFrozenItem(itemNameStr);
            }

            chrome.storage.local.get(itemNameStr, function (data) {
                var dataToReturn = (true === allData)
                    ? data
                    : data[itemNameStr];


                if ($$.util.isFunc(callback)) {
                    return callback(dataToReturn);
                } else {
                    return dataToReturn;
                }
            });
        },
        setItem: function (itemNameStr, itemObj, callback) {
            var itemWrapperObj = {},
                that = this;

            itemWrapperObj[itemNameStr] = itemObj;

            chrome.storage.local.set(itemWrapperObj, function () {
                that.items[itemNameStr] = itemObj;
                if ($$.util.isFunc(callback)) {
                    return callback();
                }
            });
        },

        removeItem: function (itemNameStr, callback) {
            var that = this;
            chrome.storage.local.remove(itemNameStr, function () {
                that.items[itemNameStr] = null;
                if ($$.util.isFunc(callback)) {
                    callback();
                }
            });
        },

        /**
         * Due to the async nature of chrome.storage,
         * results may not be consistent if a barrage of fetching the same item
         * occurs.  So, a recursive timeout is set to check if the item is released
         * before proceeding with getItem.
         * Freezing only prevents getItem on the 2nd to nth calls on getItem.
         * @example
         *      Storage.freezeGetOnItem(options);
         *      Storage.getItem(''); // works
         *      Storage.getItem(''); // FROZEN, CANNOT FETCH!
         * @param item
         */
        freezeGetOnItem: function (item) {
            this.frozenItemArr[item] = this.frozenItemArr[item] || 0;
        },

        /**
         * Release the freeze on getting an item
         * @param item
         */
        releaseGetOnItem: function (item) {
            delete this.frozenItemArr[item];
        },

        /**
         * Checks if the item is available for fetching
         * @param item
         * @return {Boolean}
         */
        isItemReleased: function (item) {
            return (!this.frozenItemArr[item] || this.frozenItemArr[item] === 0);
        },

        isItemFrozen: function (item) {
            return (this.frozenItemArr[item] && this.frozenItemArr[item] > 0);
        },

        setFreezeTimeout: function () {
            var args = $$.util.arrayify(arguments),
                item = args[0],
                that = this;

            setTimeout(function () {
                if (that.isItemReleased(item)) {
                    return that.getItem.apply(that, args);
                } else {
                    return that.setFreezeTimeout.apply(that, args);
                }
            }, this.freezeTimeoutNum);
        },

        /**
         * Increment fetch attempt to frozen item
         * @param item
         */
        addFetchAttemptToFrozenItem: function (item) {
            if ($$.util.isDefined(this.frozenItemArr[item])) {
                this.frozenItemArr[item] += 1;
            }
        },

        /**
         * Clears all the items in local storage
         */
        clearItems: function (callback) {
            alert('CLEARING ITEMS');
            chrome.storage.local.clear(function () {
                if ($$.util.isFunc(callback)) {
                    callback();
                }
            });
        }
    });
}());