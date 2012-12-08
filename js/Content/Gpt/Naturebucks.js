(function() {
    'use strict';
    $$.klass(function GptNaturebucks () {
        this.urlArr = [
            {
                url: 'http://naturebucks.com/members/signupPTS.php(.)*',
                type: 'offers',
                navigation: {
                    offerSelectorStr: 'form[method="POST"] > table > tbody > tr > td',
                    nameSelectorStr: 'div > div > a',
                    descriptionSelectorStr: 'div:nth-child(1) > div:nth-child(3)',
                    priceSelectorStr: 'table tr:nth-child(1) td:nth-child(2)' /*'table > tbody > tr > td[style*="width:75%"]'*/,
                    doneSelectorStr: 'input[type="submit"]',
                    nextBtnSelectorStr: 'input[value="Next"]'
                },
                // the language of the offer
                language: {
                    whiteListArr: [
                        'sign up and confirm email'
                    ],
                    blacklistArr: [

                    ]
                }
            }
        ];
    }).inheritFrom('Gpt');
}());