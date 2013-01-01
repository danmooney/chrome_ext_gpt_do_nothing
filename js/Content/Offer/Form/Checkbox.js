(function() {
    'use strict';
    $$.klass(function OfferFormCheckbox () {

    }, {
        _static: true,
        fillOut: function (inputEl, value, labelEl) {
            value.attr('checked', 'checked');
            this.trigger('INPUT_DONE_HANDLING');
        }
    });
}());