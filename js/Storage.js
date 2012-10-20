// interface to chrome.storage
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
        this.freezeTimeoutNum = 2000;
    }, {
        _static: true,
            /**
             *
             * @param {String} item
             * @param {Function} callback
             */
        getItem: function (item, callback) {
            // check if frozen
            if (this.isItemFrozen(item)) {
                this.addFetchAttemptToFrozenItem(item);
                return this.setFreezeTimeout.apply(this, arguments);
            } else {
                this.addFetchAttemptToFrozenItem(item);
            }

            chrome.storage.local.get(item, function (data) {
                if ($$.util.isFunc(callback)) {
                    return callback(data[item]);
                } else {
                    return data[item];
                }
            });
        },
        setItem: function (item, callback) {
            chrome.storage.local.set(item, function () {
                if ($$.util.isFunc(callback)) {
                    return callback();
                }
            });
        },

        removeItem: function (item) {
            chrome.storage.local.remove(item);
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
        clearItems: function () {
            chrome.storage.local.clear();
        }
    });
}());