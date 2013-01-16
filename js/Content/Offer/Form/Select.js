(function() {
    'use strict';
    $$.klass(function OfferFormSelect () {

    }, {
        _static: true,
        fillOut: function (inputEl, key, value, labelEl) {
            var optionEls = inputEl.children('option'),
                matchFoundBool = false, // setting default
                matchingValueEl,
                randOptionNum,
                randOptionEl,
                i;

            if ($$.util.isString(value)) {
                value = {
                    only: value
                };
            }

            optionEls.each(function () {
                var el          = $(this),
                    selectVal   = el.val(),
                    textVal     = el.text(),
                    currentVal;

                for (i in value) {
                    if (!value.hasOwnProperty(i)) {
                        continue;
                    }

                    currentVal = value[i].toLowerCase();

                    if (selectVal.toLowerCase().indexOf(currentVal) !== -1 ||
                        textVal.toLowerCase().indexOf(currentVal)   !== -1
                    ) {
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