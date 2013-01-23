(function() {
    'use strict';
    $$.klass(function OfferFormSelect () {

    }, {
        _static: true,
        fillOut: function (inputEl, key, value, labelEl) {
            var optionEls = inputEl.children('option'),
                matchFoundBool = false, // setting default
                matchingValueEl = $(),
                randOptionNum,
                randOptionEl,
                i;

            if ($$.util.isString(value)) {
                value = {
                    only: value
                };
            }

            optionEls.each(function (idx) {
                var el          = $(this),
                    alnumRegex  = /[^a-zA-Z0-9]/g,
                    selectVal   = $.trim(el.val()).toLowerCase().replace(alnumRegex, ''),
                    textVal     = $.trim(el.text()).toLowerCase().replace(alnumRegex, ''),
                    currentVal;

                for (i in value) {
                    if (!value.hasOwnProperty(i) || value[i].length === 0) {
                        continue;
                    }

                    currentVal = $.trim(value[i].toLowerCase());

                    if (/*(selectVal.indexOf(currentVal) !== -1 ||
                        textVal.indexOf(currentVal)   !== -1)*/
                    // using straight matches now
                       (currentVal === selectVal     ||
                        currentVal === textVal) &&
                        idx !== 0
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