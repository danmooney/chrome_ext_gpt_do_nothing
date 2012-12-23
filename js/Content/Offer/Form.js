(function() {
    'use strict';
    $$.klass(function GptOfferForm () {
        var
            /**
             * List containing all of the form values to populate (ex. first name, last name, city, state, etc.)
             * @type {Object}
             */
            formInfo;

        this.setFormInfo = function (formInfoObj, callback) {
            if ($$.util.isObject(formValuesObj)) {
                formInfo = formInfoObj;
                if ($$.util.isFunc(callback)) {
                    callback();
                }
            } else {
                $$('Storage').getItem('formInfo', function (formInfoObj) {
                    formInfo = formInfoObj;
                    callback();
                })
            }
        };

        this.getFormInfo = function () {
            return formInfo;
        };

    }, {
        /**
         * Parse the DOM and look for THE appropriate form to focus on
         * TODO - it's gotta be more complicated than this
         * @return {Array}
         */
        evaluateForms: function () {
            console.warn('SEARCHING FOR FORMS');
            return $('form:visible');
        },

        /**
         * Parse form and fill out according to formInfo values
         */
        fillOutForm: function (formEl) {
            var formInfo = this.getFormInfo();

        }
    });
}());