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
                    doneSelectorStr: '.offdone'
                },
                language: {
                    whiteListArr: [
                        'accurate information',
                        'survey'
                    ]
                }
            }
        ];
    }).inheritFrom('Gpt');
}());
