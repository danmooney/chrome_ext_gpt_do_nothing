(function() {
    'use strict';
    $$.klass(function OfferFormSubmit () {
        var submitEls,
            imageInputEl;

        this.getSubmitEls = function () {
            return submitEls;
        };

        this.setSubmitEls = function (inputEls) {
            submitEls = inputEls;
        };

        this.getImageInputEl = function () {
            return imageInputEl;
        };

        this.setImageInputEl = function (inputEl) {
            imageInputEl = inputEl;
        };

    }, {
        /**
         * Check for input type="image"
         * @return {Boolean}
         */
        hasImageInputTypes: function () {
            var submitEls = this.getSubmitEls(),
                hasImageInputTypesBool = false,
                that = this;

            submitEls.each(function () {
                var el = $(this);
                if ($.trim(el.attr('type').toLowerCase()) === 'image') {
                    hasImageInputTypesBool = true;
                    that.setImageInputEl(el);
                    // break out of loop
                    return false;
                }
            });

            return hasImageInputTypesBool;
        },

        /**
         * If input type="image" exists, add x and y to form
         */
        addXAndYToForm: function (formEl) {
            var fieldArr = ['x', 'y'],
                imageInputEl = this.getImageInputEl(),
                imageInputCoordsArr = [
                    (imageInputEl.width()  / 2) + 3,
                    (imageInputEl.height() / 2) + 3
                ],
                inputEl,
                i;

            for (i = 0; i < fieldArr; i += 1) {
                inputEl = $('<input />');
                inputEl.attr({
                    'type': 'hidden',
                    'name': fieldArr[i],
                    'value': imageInputCoordsArr[i]
                });
                inputEl.appendTo(formEl);
            }
        },

        /**
         * Evaluate the submit button(s) to submit form and trigger onclicks if necessary
         * @param {jQuery} formEl
         * @return {jQuery}
         */
        evaluateSubmitEls: function (formEl) {
            var submitEls = formEl.find('input[type="submit"], input[type="image"], input[onsubmit], input[onclick]');
            this.setSubmitEls(submitEls);
            return submitEls;
        },

        /**
         * @param formEl
         * @param [inputEls]
         */
        submit: function (formEl, inputEls) {
            var submitButtonEls = this.evaluateSubmitEls(formEl),
                that = this;

            if (formEl.prop('tagName').toLowerCase() === 'form') { // if form exists, hallelujah!
                if (true === this.hasImageInputTypes()) {
                    this.addXAndYToForm(formEl);
                }

                submitButtonEls.trigger('click');
                formEl.submit();
                submitButtonEls.trigger('submit');
            } else { // these sick fucks sometimes don't put their shit in form elements... search for the submit triggerer if this is true!
                alert('Trying to submit, but no proper form element on page!');
                submitButtonEls.trigger('click').trigger('submit');
                inputEls.trigger('click');

                // TODO - click around???  doomed by this point???
                setTimeout(function () {
                    $$('OfferForm').clickAround();
                }, 7000);
            }
        }
    });
}());