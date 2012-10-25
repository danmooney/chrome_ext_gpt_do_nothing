// Interface for chrome.windows
(function() {
    'use strict';
    $$.klass(function Window () {
        /**
         * @param {Function} callback
         * @return {Array}
         */
        this.getAllWindowIds = function (callback) {
            chrome.windows.getAll(function (windows) {
                var idsArr = [],
                    i;

                for (i = 0; i < windows.length; i += 1) {
                    idsArr.push(windows[i].id);
                }

                return callback(idsArr);
            });
        };
    }, {
        _static: true
    })
}());