(function() {
    'use strict';
    $$.klass(function GptTreasuretrooper () {
        this.urlArr = [
            {
                url: 'http://www.treasuretrooper.com/members/earn/offers',
                type: 'offers',
                navigation: {
                    offerSelectorStr: '.oddoffers, .evenoffers',
                    nameSelectorStr: '.offname',
                    descriptionSelectorStr: '.offdesc',
                    priceSelectorStr:'.offamt',
                    doneSelectorStr: '.offdone input'
                },
                language: {
                    whiteListArr: [
                        'accurate information',
                        'survey'
                    ]
                },
                /**
                 * This callback is called on every offer on the page
                 * Returns a boolean true if offer should be filtered through
                 * and boolean false if it should be filtered out
                 *
                 * @param {Object} offer
                 * @return {Boolean}
                 */
                filterCallback: function (offer) {
//                    if (offer.price.substr(0, 1) !== '$') {
//                        return false;
//                    }
                    return true;
                }
            }
        ];
    }).inheritFrom('Gpt');
}());
