(function() {
    'use strict';
    $$.klass(function Offer () {
        var offer;

        this.start = function () {
            $$('Storage').getItem('offer', function (offerObj) {
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