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
        clearItems: function () {
            chrome.storage.local.clear();
        }
    });
}());