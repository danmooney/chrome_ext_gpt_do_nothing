(function() {
    'use strict';
    $$.klass(function OfferFormRadio () {
        var multiValueNamedArr = [],
            multiValueNameIterator = [],
            multiValueNameCountArr = [],
            namesFilledOutArr = [],
            /**
             * Map of random radio to fill out
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
            if ($$.util.isNumber(randomMultiValueFillOutArr[multiValueNameStr])) {
                return;
            }
            var count = multiValueNameCountArr[multiValueNameStr];

            randomMultiValueFillOutArr[multiValueNameStr] = Math.floor(Math.random() * (count - 1) + 1);
        };

        this.addToNamesFilledOut = function (nameStr) {
            namesFilledOutArr.push(nameStr);
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
         * @param {String} key
         * @param {String} value
         * @param labelEl
         * TODO - need better implementation to parse whether it is a 'no' or negative radio button, which should usually be avoided.
         */
        fillOut: function (inputEl, key, value, labelEl) {
            var nameStr = inputEl.attr('name'),
                labelTxtStr = $.trim(labelEl.text().toLowerCase()),
                formEl = $$('OfferForm').getForm(),
                nameSelectorStr = '[name="' + nameStr + '"]:visible',
                nameStrCount = formEl.find(nameSelectorStr).length,
                multiValueIdx,
                setTimeoutBool;

            if (this.hasNameAlreadyBeenFilledOut(nameStr)) { // if form inputs are being evaluated again because JS started showing some new ones, forget the ones that were already filled out!
                return this.trigger('INPUT_DONE_HANDLING');
            }

            if ($$.util.isString(nameStr) && nameStrCount > 1) { // multi value
                this.setMultiValueNameCount(nameStr, nameStrCount);
                multiValueIdx = this.getMultiValueNameIteratorIdx(nameStr);

                // if multiValueIdx is not the designated random index to fill out, return!
                if (multiValueIdx !== this.getRandomMultiValueFillOutArr(nameStr)) {
                    return this.trigger('INPUT_DONE_HANDLING');
                }

                setTimeoutBool = false; // no setTimeout; just fill out quick!
            }

            $$('Injector').injectClickInput(inputEl);
            this.addToNamesFilledOut(nameStr);

            this.trigger('INPUT_DONE_HANDLING', setTimeoutBool);

//
//            // look for 'no' in the beginning of label and keep unchecked if it exists
//            if ('no' !== labelTxtStr &&
//                false === /^no[^a-zA-Z+]/.test(labelTxtStr)
//            ) {
//                $$('Injector').injectClickInput(inputEl);
//            }
//
//            return this.trigger('INPUT_DONE_HANDLING');
        }
    });
}());