chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
    });
(function() {
    'use strict';
    $$.klass(function GptTreasuretrooper () {
        this.urlArr = [
            {
                url: 'http://www.treasuretrooper.com/members/earn/offers',
                type: 'offers'
            }
        ];
    }).inheritFrom('Gpt');

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
