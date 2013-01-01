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

        init: function () {
            var that = this;
            this.listen('APP_STARTED_WORKING', function () {
                that.removeItem('lastForm');
            });
        },

        /**
         * @param {String} item
         * @param {Function} callback
         * @param {Boolean} allData  - TODO - is this even in use?
         */
        getItem: function (item, callback, allData) {
            // check if frozen
            if (this.isItemFrozen(item)) {
                this.addFetchAttemptToFrozenItem(item);
                return this.setFreezeTimeout.apply(this, arguments);
            } else {
                this.addFetchAttemptToFrozenItem(item);
            }

            chrome.storage.local.get(item, function (data) {
                var dataToReturn = (true === allData)
                    ? data
                    : data[item];
                if ($$.util.isFunc(callback)) {
                    return callback(dataToReturn);
                } else {
                    return dataToReturn;
                }
            });
        },
        setItem: function (itemNameStr, itemObj, callback) {
            var itemWrapperObj = {};

            itemWrapperObj[itemNameStr] = itemObj;

            chrome.storage.local.set(itemWrapperObj, function () {
                if ($$.util.isFunc(callback)) {
                    return callback();
                }
            });
        },

        removeItem: function (item, callback) {
            chrome.storage.local.remove(item, callback);
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
         *      Storage.getItem(''); // FROZEN!
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
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    });
}());