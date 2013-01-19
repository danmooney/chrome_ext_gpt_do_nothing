(function() {
    'use strict';
    $$.klass(function OfferFormText () {
        var valueChangeSpeed = 20,
            /**
             * Associative array of multi field inputs and their associated value fillOut count
             * @param {Array}
             */
            multiValuesFilledArr = [],
            multiValueSubstringMap = {
                ssn: [
                    3,
                    5,
                    9
                ],
                phone: [
                    3,
                    6,
                    10
                ]
            },
            randomStrArr = [
                'Yes',
                'OK'
            ],
            inputWidthMinForMultiValue = 80;

        this.getMultiValueSubstringMap = function (multiValueFormNameStr) {
            return multiValueSubstringMap[multiValueFormNameStr];
        };

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

        this.getInputWidthMinForMultiValue = function () {
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

        /**
         * Find out if it's a multi input type value and re-evaluate the value if true
         * @param {String} multiValueNameStr
         * @param {jQuery}inputEl
         * @param {String} value
         * @return {String}
         */
        getMultiInputValue: function (multiValueNameStr, inputEl, value) {
            if (inputEl.width() > this.getInputWidthMinForMultiValue()) {
                return value;
            }

            if ($$.util.isUndefined(this.getMultiValueFillCount(multiValueNameStr))) { // first and second inputs are usually the same width, and the last one is wider to accomodate the extra digit
                this.setMultiValueFillCount(multiValueNameStr);
            }

            var multiValueFilloutCount,
                multiValueSubstringArr,
                fromNum,
                upToNum;

            multiValueFilloutCount = this.getMultiValueFillCount(multiValueNameStr);
            multiValueSubstringArr = this.getMultiValueSubstringMap(multiValueNameStr);

            if (0 === multiValueFilloutCount) {
                fromNum = 0;
            } else {
                fromNum = multiValueSubstringArr[multiValueFilloutCount - 1];
            }

            upToNum = multiValueSubstringArr[multiValueFilloutCount];

            value = value.substring(fromNum, upToNum);

            this.addMultiValueFillCount(multiValueNameStr);

            return value;
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
                value = this.getMultiInputValue('phone', inputEl, value);
            }

            if ('ssn' === key) {
                value = this.getMultiInputValue('ssn', inputEl, value);
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