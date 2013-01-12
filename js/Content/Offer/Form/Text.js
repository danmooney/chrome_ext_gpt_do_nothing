(function() {
    'use strict';
    $$.klass(function OfferFormText () {
        var valueChangeSpeed = 20,
            randomStrArr = [
                'Yes',
                'OK'
            ];

        this.getValueChangeSpeed = function () {
            return valueChangeSpeed;
        };

        this.getRandomStr = function () {
            return randomStrArr[Math.floor(Math.random() * randomStrArr.length)];
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

            inputEl.trigger('click').focus();

            // if value is empty, get a random value
            if (true === emptyValueBool) {
                value = this.getRandomStr();
            }

            /**
             * Simulate typing
             */
            function changeValue () {
                var that = this;

                inputEl
                    .trigger('keydown')
                    .trigger('keypress')
                    .val(value.substr(0, i))
                    .trigger('keyup');

                if (i === value.length) {
                    inputEl.blur();
                    return this.trigger('INPUT_DONE_HANDLING');
                }

                i += 1;
                return setTimeout(function () {
                    changeValue.call(that);
                }, that.getValueChangeSpeed());
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

            changeValue.call($$('OfferFormText'));
        }
    });
}());