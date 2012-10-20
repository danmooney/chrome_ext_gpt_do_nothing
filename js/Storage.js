// interface to chrome.storage
(function() {
    'use strict';
    $$.klass(function Storage () {

    }, {
        _static: true,
        getItem: function (item, callback) {
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
         * before proceeding with getItem
         * @param item
         */
        freezeGetOnItem: function (item) {

        },

        /**
         * Release the freeze on getting an item
         * @param item
         */
        releaseGetOnItem: function (item) {

        },

        /**
         * Checks if the item is available for fetching
         * @param item
         * @return {Boolean}
         */
        isItemReleased: function (item) {

        },

        /**
         * Clears all the items in local storage
         */
        clearItems: function () {
            chrome.storage.local.clear();
        }
    });
}());