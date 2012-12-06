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
                    descSelectorStr: 'div > div',
                    priceSelectorStr: 'table > tbody > tr > td[width="25%"]',
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