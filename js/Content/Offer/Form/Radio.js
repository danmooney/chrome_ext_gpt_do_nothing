(function() {
    'use strict';
    $$.klass(function OfferFormRadio () {

    }, {
        _static: true,
        fillOut: function (inputEl, value, labelEl) {
            value.attr('checked', 'checked');
            this.trigger('INPUT_DONE_HANDLING');
        }
    });
}());