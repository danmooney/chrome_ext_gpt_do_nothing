(function() {
    'use strict';
    $$.klass(function OfferFormSelect () {

    }, {
        _static: true,
        /**
         * Checks for match between array of values
         * Using straight matches now
         * @return {Boolean}
         */
        hasMatch: function (valueToSearchForObj, optionElValueObj) {
            var matchFoundBool = false,
                i,
                j;

            for (i in valueToSearchForObj) {
                if (!valueToSearchForObj.hasOwnProperty(i)) {
                    continue;
                }

                valueToSearchForObj[i] = valueToSearchForObj[i].toLowerCase();

                for (j in optionElValueObj) {
                    if (!optionElValueObj.hasOwnProperty(j)) {
                        continue;
                    }

                    if (valueToSearchForObj[i] === optionElValueObj[j]) {
                        matchFoundBool = true;
                        break;
                    }
                }

                if (true === matchFoundBool) {
                    break;
                }
            }

            return matchFoundBool;
        },
        fillOut: function (inputEl, key, value, labelEl) {
            var optionEls = inputEl.find('option'),
                matchFoundBool = false, // setting default
                matchingValueEl = $(),
                randOptionNum,
                randOptionEl,
                alnumRegex  = /[^\sa-zA-Z0-9]/g,
                that = this;

            if ($$.util.isString(value)) {
                value = {
                    only: value
                };
            }

            optionEls.not(':first').each(function () {
                var el       = $(this),
                    elValObj = {
                        selectVal: $.trim(el.val()).toLowerCase(),
                        textVal: $.trim(el.text()).toLowerCase()
                    };

                if (true === that.hasMatch(value, elValObj)) {
                    // match found
                    matchFoundBool = true;
                    matchingValueEl = el;
                    // break out of loop
                    return false;
                } else {
                    elValObj.selectVal = elValObj.selectVal.replace(alnumRegex, '');
                    elValObj.textVal = elValObj.textVal.replace(alnumRegex, '');
                    if (true === that.hasMatch(value, elValObj)) {
                        // match found
                        matchFoundBool = true;
                        matchingValueEl = el;
                        // break out of loop
                        return false;
                    }
                }
            });

            inputEl.trigger('focus').trigger('click');

            // if no match found, choose random number!
            // avoid choosing first option since that is (usually) always the default!
            if (false === matchFoundBool) {
                randOptionNum = Math.floor(Math.random() * (optionEls.length - 1) + 1);
                randOptionEl = optionEls.eq(randOptionNum);
                optionEls.removeAttr('checked');
                inputEl.val(randOptionEl.val());
                randOptionEl.attr('checked', 'checked');
            } else if (true === matchFoundBool) {
                optionEls.removeAttr('checked');
                inputEl.val(matchingValueEl.val());
                matchingValueEl.attr('checked', 'checked');
                inputEl.trigger('change');
            }

            inputEl.trigger('blur');

            this.trigger('INPUT_DONE_HANDLING');
        }
    });
}());