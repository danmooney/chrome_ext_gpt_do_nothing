var Url = (function() {
    var startingUrlArr = [
        'http://www.treasuretrooper.com/members/earn/offers'
    ];

    return {
        /**
         * Checks to see if url is contained within
         *   the startingUrlArr
         * @param {String} url
         * @return {Boolean}
         */
        isStartingUrl: function (url) {
            for (var i in startingUrlArr) {
                if (!startingUrlArr.hasOwnProperty(i)) {
                    continue;
                }
                if (url.indexOf(startingUrlArr[i]) !== -1) {
                    return true;
                }
            }
            return false;
        }
    };
}());