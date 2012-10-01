(function() {
    var
        /**
         * Class Strings
         * @type {String}
         */
        offerNameClassStr = '.offname',
        offerDescClassStr = '.offdesc',
        offerDoneClassStr = '.offdone',
        offerPriceClassStr = '.offamt',

        /**
         * Elements
         * @type {jQuery}
         */
        offerDescEl = $(offerDescClassStr),
        offerDoneEl = $(offerDoneClassStr),
        offerLinksEl = $(offerNameClassStr).children(),
        offerPricesEl = $(offerPriceClassStr),

        /**
         * List of whitelist/blacklist regexes/filters
         * @type {Array}
         */
        offerDescFilterWhitelistArr = [
            'accurate information',
            'survey'
        ],
        offerDescFilterBlackListArr = [],

        offerTitleFilterWhitelistArr = [

        ],
        offerTitleFilterBlacklistArr = [

        ],

        /**
         * Max Offer price
         * If it's more than this,
         *   then it's probably not worth doing!
         * @type {String}
         */
        maxOfferPriceStr = '$1.00';

}());
