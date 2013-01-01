(function() {
    'use strict';
    $$.klass(function OfferFormText () {
        var valueChangeSpeed = 20;

        this.getValueChangeSpeed = function () {
            return valueChangedSpeed;
        };

    }, {
        _static: true,

        /**
         * Fill out text/textarea fields
         */
        fillOut: function (inputEl, value, labelEl) {
            var emptyValueBool = (value === '' || $$.util.isUndefined(value)),
                i = 1,
                j;

            inputEl.focus();

            // if value is empty, get a random value
            if (true === emptyValueBool) {
                value = 'OK';
            }

            /**
             * Simulate typing
             */
            function changeValue () {
                var that = this;
                inputEl.val(value.substr(0, i));

                if (i === value.length) {
                    inputEl.blur();
                    return this.trigger('INPUT_DONE_HANDLING');
                }

                i += 1;
                return setTimeout(function () {
                    changeValue.call(that);
                }, this.getValueChangeSpeed());
            }

            if ($$.util.isObject(value)) {
                for (j in value) {
                    if (!value.hasOwnProperty(j)) {
                        continue;
                    }
                    value = value[j];
                    break;
                }
            }

            changeValue.call($$('OfferForm'));
        }
    });
}());