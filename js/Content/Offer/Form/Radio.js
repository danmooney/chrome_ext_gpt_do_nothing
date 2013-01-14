(function() {
    'use strict';
    $$.klass(function OfferFormRadio () {
        var namesFilledOutArr = [];

        this.addToNamesFilledOut = function (nameStr) {
            namesFilledOutArr.push(nameStr);
        };

        /**
         * @return {Boolean}
         */
        this.hasNameAlreadyBeenFilledOut = function (nameStr) {
            return $$.util.inArray(namesFilledOutArr, nameStr);
        };

        this.clearNamesFilledOut = function () {
            namesFilledOutArr = [];
        };

    }, {
        _static: true,
        init: function () {
            var that = this;

            // when going onto another form, clear the names that have been filled out,
            // since they (legitimately) might exist inside another form
            this.listen('GOING_ONTO_ANOTHER_FORM', function () {
                that.clearNamesFilledOut();
            });
        },

        /**
         * Fill out the radio button
         * @param inputEl
         * @param value
         * @param labelEl
         * TODO - need better implementation to parse whether it is a 'no' or negative radio button, which should usually be avoided.
         */
        fillOut: function (inputEl, value, labelEl) {
            var nameStr = inputEl.attr('name'),
                labelTxtStr = $.trim(labelEl.text().toLowerCase());

            if (this.hasNameAlreadyBeenFilledOut(nameStr)) { // a radio button with the same name has already been filled out, just forget it
                return this.trigger('INPUT_DONE_HANDLING');
            }

            this.addToNamesFilledOut(nameStr);

            // look for 'no' in the beginning of label and keep unchecked if it exists
            if ('no' !== labelTxtStr &&
                false === /^no[^a-zA-Z+]/.test(labelTxtStr)
            ) {
                inputEl.attr('checked', 'checked');
            }

            return this.trigger('INPUT_DONE_HANDLING');
        }
    });
}());