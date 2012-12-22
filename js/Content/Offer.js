(function() {
    'use strict';
    $$.klass(function Offer () {
        var offer;

        this.start = function () {
            $$('Storage').getItem('currentOffer', function (offerObj) {
                offer = offerObj;
            });
        };
    }, {
        _static: true,
        lookForForms: function () {
            console.warn('SEARCHING FOR FORMS');
        }
    });
}());