(function() {
    'use strict';
    $$.klass(function OfferFormText () {
        var valueChangeSpeed = 20,
            /**
             * Associative array of multi field inputs and their associated value fillOut count
             * @param {Array}
             */
            multiValuesFilledArr = [],
            randomStrArr = [
                'Yes',
                'OK'
            ],
            inputWidthMinForMultiValue = 80;

        this.getMultiValueFillCount = function (multiValueFormNameStr) {
            return multiValuesFilledArr[multiValueFormNameStr];
        };

        /**
         * Initiate the count
         */
        this.setMultiValueFillCount = function (multiValueFormNameStr) {
            multiValuesFilledArr[multiValueFormNameStr] = multiValuesFilledArr[multiValueFormNameStr] || 0;
        };

        this.addMultiValueFillCount = function (multiValueFormNameStr) {
            multiValuesFilledArr[multiValueFormNameStr] += 1;
        };

        this.getInputWidthMinForMulltiValue = function () {
            return inputWidthMinForMultiValue;
        };

        this.getValueChangeSpeed = function () {
            return valueChangeSpeed;
        };

        this.getRandomStr = function () {
            return randomStrArr[Math.floor(Math.random() * randomStrArr.length)];
        };

    }, {
        _static: true,

        getMultiInputValue: function () {

        },

        /**
         * Fill out text/textarea fields
         */
        fillOut: function (inputEl, key, value, labelEl) {
            if (inputEl.val() === value) {
                return this.trigger('INPUT_DONE_HANDLING');
            }

            var emptyKeyBool   = (key === '' || $$.util.isUndefined(key)),
                emptyValueBool = (value === '' || $$.util.isUndefined(value)),
                multiValueNameStr,
                multiValueFilloutCount,
                i = 1,
                j;

            inputEl.trigger('focus').trigger('click');

            if (true === emptyKeyBool) {
                key = '';
            }

            // if value is empty, get a random value
            if (true === emptyValueBool) {
                value = this.getRandomStr();
            }

            // check for phone
            if (key.indexOf('phone') !== -1) {
                multiValueNameStr = 'phone';

                if (inputEl.width() < this.getInputWidthMinForMulltiValue() &&
                    $$.util.isUndefined(this.getMultiValueFillCount(multiValueNameStr)) // first and second inputs are usually the same width, and the last one is wider to accomodate the extra digit
                ) {
                    this.setMultiValueFillCount(multiValueNameStr);
                }

                multiValueFilloutCount = this.getMultiValueFillCount(multiValueNameStr);
                if ($$.util.isNumber(multiValueFilloutCount)) {
                    switch (multiValueFilloutCount) {
                        case 0:
                            value = value.substr(0, 3); // 203
                            break;
                        case 1:
                            value = value.substr(3, 3); // 261
                            break;
                        case 2:
                            value = value.substr(6, 4); // 9103
                            break;
                    }

                    this.addMultiValueFillCount(multiValueNameStr);
                }
            }

            if ('ssn' === key) {

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
                    inputEl.trigger('blur');
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