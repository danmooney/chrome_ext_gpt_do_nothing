(function() {
    'use strict';
    $$.klass(function OfferFormRadio () {

    }, {
        _static: true,
        fillOut: function (inputEl, value, labelEl) {
            var labelTxtStr = $.trim(labelEl.text().toLowerCase());

            // look for 'no' in the beginning of label and keep unchecked if it exists
            if ('no' !== labelTxtStr &&
                false === /^no[^a-zA-Z+]/.test(labelTxtStr)
            ) {
                inputEl.attr('checked', 'checked');
            }

            this.trigger('INPUT_DONE_HANDLING');
        }
    });
}());