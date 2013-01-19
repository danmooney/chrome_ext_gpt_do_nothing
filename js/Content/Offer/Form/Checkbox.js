(function() {
    'use strict';
    $$.klass(function OfferFormCheckbox () {
        var
            /**
             * Takes checkbox name as key and the number of checkboxes that share that name as value (count)
             * @param {Array}
             */
            multiValueNameCountArr = [],
            /**
             * Calculates the nth time a checkbox with the same name has been parsed
             * @param {Array}
             */
            multiValueNameIterator = [],
            /**
             * Map of random checkboxes to check in
             * @param {Array}
             */
            randomMultiValueFillOutArr = [];

        this.getRandomMultiValueFillOutArr = function (multiValueNameStr) {
            return randomMultiValueFillOutArr[multiValueNameStr];
        };

        /**
         * Generate random n numbers of multivalue checkboxes to be filled out
         */
        this.generateRandomFillOutArr = function (multiValueNameStr) {
            if ($$.util.isArray(randomMultiValueFillOutArr[multiValueNameStr])) {
                return;
            }

            randomMultiValueFillOutArr[multiValueNameStr] = [];

            var count = multiValueNameCountArr[multiValueNameStr],
                randomCheckboxesToCheckNum = Math.floor(Math.random() * (count - 1) + 1),
                designatedCheckboxesNum = 0,
                i;

            while (designatedCheckboxesNum < randomCheckboxesToCheckNum) {
                for (i = 0; i < count; i += 1) {
                    if ($$.util.inArray(randomMultiValueFillOutArr[multiValueNameStr], i)) {
                        continue;
                    }

                    var fillOutBool = (Math.floor(Math.random() * 2)) === 1;
                    if (true === fillOutBool) {
                        randomMultiValueFillOutArr[multiValueNameStr].push(i);
                        designatedCheckboxesNum += 1;
                        if (designatedCheckboxesNum === randomCheckboxesToCheckNum) {
                            break;
                        }
                    }
                }
            }

            // sort the random fill out map
            randomMultiValueFillOutArr[multiValueNameStr] = randomMultiValueFillOutArr[multiValueNameStr].sort();
        };

        this.setMultiValueNameCount = function (multiValueNameStr, count) {
            if ($$.util.isNumber(multiValueNameCountArr[multiValueNameStr])) {
                multiValueNameIterator[multiValueNameStr] += 1;
            } else {
                multiValueNameCountArr[multiValueNameStr] = count;
                multiValueNameIterator[multiValueNameStr] = 0;

                this.generateRandomFillOutArr(multiValueNameStr);
            }
        };

        this.getMultiValueNameIteratorIdx = function (multiValueNameStr) {
            return multiValueNameIterator[multiValueNameStr];
        };

    }, {
        _static: true,
        fillOut: function (inputEl, key, value, labelEl) {
            var labelTxtStr = $.trim(labelEl.text().toLowerCase()),
                nameStr = inputEl.attr('name'),
                formEl = $$('OfferForm').getForm(),
                nameStrCount,
                multiValueIdx;

            if ($$.util.isString(nameStr) && nameStr.length > 1) { // multivalue
                nameStrCount = formEl.find('[name="' + nameStr + '"]:visible').length;
                this.setMultiValueNameCount(nameStr, nameStrCount);

                multiValueIdx = this.getMultiValueNameIteratorIdx(nameStr);

                if ($$.util.inArray(this.getRandomMultiValueFillOutArr(nameStr), multiValueIdx)) {
                    $$('Injector').injectClickInput(inputEl);
                }

                this.trigger('INPUT_DONE_HANDLING', false); // no setTimeout; just fill out quick!
            } else { // single value
                $$('Injector').injectClickInput(inputEl);
                this.trigger('INPUT_DONE_HANDLING');
            }

            // look for 'no' in the beginning of label and keep unchecked if it exists
//            if ('no' !== labelTxtStr &&
//                false === /^no[^a-zA-Z+]/.test(labelTxtStr)
//            ) {
//
//            }
        }
    });
}());