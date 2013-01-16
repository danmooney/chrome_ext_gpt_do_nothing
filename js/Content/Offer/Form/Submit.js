(function() {
    'use strict';
    $$.klass(function OfferFormSubmit () {
        var submitEls,
            imageInputEl,
            /**
             * @param {Boolean}
             */
            isFormBool;

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

        this.evaluateAndSetIsFormBool = function (formEl) {
            isFormBool = (formEl.prop('tagName').toLowerCase() === 'form');
        };

        this.getIsFormBool = function () {
            return isFormBool;
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

            for (i = 0; i < fieldArr.length; i += 1) {
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
            var submitEls = formEl.find('input[type="submit"], input[type="image"], input[onsubmit], input[onclick]').filter(':visible');

            if (submitEls.length === 0) { // then try buttons
                submitEls = formEl.find('button');
                if (submitEls.length === 0  &&      // no submits or buttons.... try with body // TODO - is this safe?
                    true === this.getIsFormBool()   // only if formEl isn't already body!
                ) {
                    return this.evaluateSubmitEls($('body'));
                }
            }

            this.setSubmitEls(submitEls);
            return submitEls;
        },

        /**
         * Just a test to see if we can get these image submit types to behave properly
         * @param formEl
         * @deprecated
         */
        changeImageTypesToSubmitTypes: function (formEl) {
            formEl.find('input[type="image"]').prop('type', 'submit');
        },

        /**
         * @param formEl
         * @param [inputEls]
         * TODO - may have to inject the submit script into the content window to appease these image types!
         */
        submit: function (formEl, inputEls) {
            this.evaluateAndSetIsFormBool(formEl);

            var submitButtonEls = this.evaluateSubmitEls(formEl),
                that = this;

            if (true === this.getIsFormBool()) {           // if form exists, hallelujah!
                if (true === this.hasImageInputTypes()) {
                    this.addXAndYToForm(formEl);
//                    this.changeImageTypesToSubmitTypes(formEl);
                }

                // all that needs to be done is simply click on the submit...?  It seems to trigger submits on any element that has a handler for it!
                window.focus();

                $$('Injector').injectSubmit(formEl, submitButtonEls);

//                submitButtonEls.each(function () {
//                    this.click();
//                });

//                submitButtonEls.trigger('click');
//                submitButtonEls.trigger('submit');

                // if page isn't redirecting or doing anything after submit, start work on another form inside the offer
                setTimeout(function () {
                    alert('submit not working, working on another form');
                    $$('Offer').lookForForms();
                }, 9000);

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