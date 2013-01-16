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

                    ],
                    blacklistArr: [
                        'facebook',
                        'install',
                        'download',
                        'sign up',
                        'confirm email', // TODO - this should be easy for me to do manually to do after the bot submits.. so remove??
                        'print' // this probably just detects if window.print is called?  Worth it??
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
                    if (offer.price.indexOf('points') !== -1) { // points
                        offer.price = parseInt(offer.price, 10);
                        offer.price = '$' + (offer.price * .01).toString().substr(1);
                    }
                    return true;
                }
            }
        ];
    }).inheritFrom('Gpt');
}());