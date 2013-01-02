(function() {
    'use strict';
    $$.klass(function OfferFormSubmit () {
        var submitEls;

        this.getSubmitEls = function () {

        };

        this.setSubmitEls = function () {

        };

    }, {
        // TODO - concat submits and return as array?
        /**
         * Evaluate the submit button(s) to submit form and trigger onclicks if necessary
         * @return {jQuery|undefined}
         */
        evaluateSubmitEls: function () {
            var submitEls;

            // if there's a submit type button, then it's easy and we can just use this
            if (formEl.find('input[type="submit"]').length > 0) {
                submitEls = formEl.find('input[type="submit"]');
            }

            if (formEl.find('input[onclick]').length > 0) {
                formEl.find('input[onclick]');
            }
        },

        /**
         * @param formEl
         * @param [inputEls]
         */
        submit: function (formEl, inputEls) {
            var submitButtonEls = this.evaluateSubmitEls(),
                that = this;

            // if window unloading, forget submitting
            // TODO - will this actually work?  I don't think so... see Injector.js onbeforeunload method
            if ($('#gpt-offer-form-submitted').length > 0) {
                return;
            }

            if (formEl.prop('tagName').toLowerCase() === 'form') {
                if ($$.util.isDefined(submitButtonEls)) {
                    submitButtonEls.trigger('click');
                }

                formEl.submit();
            } else { // these sick fucks sometimes don't put their shit in form elements... search for the submit triggerer if this is true!
                alert('Trying to submit, but no proper form element on page!');
                inputEls.trigger('click');
                // TODO - if that didn't do anything.....?? click everything??
                setTimeout(function () {
                    that.clickAround();
                }, 7000);
            }
        }
    });
}());