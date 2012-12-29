(function() {
    'use strict';
    $$.klass(function GptOfferForm () {
        var
            /**
             * List containing all of the form values to populate (ex. first name, last name, city, state, etc.)
             * @type {Object}
             */
            formInfo,
            /**
             * Form info name/alias mapping
             * @type {Object}
             */
            formAliases = {
                name: [

                ],
                address: [

                ],
                address2: [

                ],
                city: [

                ],
                state: [

                ],
                country: [

                ],
                zip: [
                    'postal'
                ],
                email: [
                    'e-mail'
                ],
                phone: {
                    home: [

                    ],
                    mobile: [
                        'cell'
                    ]
                }
            };

        this.setFormInfo = function (formInfoObj, callback) {
            if ($$.util.isObject(formInfoObj)) {
                formInfo = formInfoObj;
                if ($$.util.isFunc(callback)) {
                    callback();
                }
            } else {
                $$('Storage').getItem('formInfo', function (formInfoArr) {
                    formInfo = formInfoArr[0];
                    if ($$.util.isFunc(callback)) {
                        callback();
                    }
                });
            }
        };

        this.getFormInfo = function () {
            return formInfo;
        };

        this.getFormAliases = function () {
            return formAliases;
        };

    }, {
        /**
         * Parse the DOM and look for THE appropriate form to focus on
         * @return {Array}
         */
        evaluateForms: function () {
            console.warn('SEARCHING FOR FORMS');
            return $('form:visible');
        },

        submitForm: function (formEl, submitButtonEl) {
            // if window unloading, forget submitting
            if ($('#gpt-offer-form-submitted').length > 0) {
                return;
            }

            if (submitButtonEl) {
                submitButtonEl.trigger('click');
            }

            formEl.submit();
        },

        /**
         * Parse form and fill out according to formInfo values
         */
        fillOutForm: function (formEl) {
            var formInfo = this.getFormInfo(),
                formAliases = this.getFormAliases(),
                formInputs = formEl.find('input[type="text"], input[type="checkbox"], input[type="radio"], select, textarea'),
                submitButtonEl,
                that = this;

            /**
             * Take care of the input
             * @param {String} typeStr ('text', 'radio', 'checkbox' or 'select')
             * @param {String} valueStr
             */
            function handleInput (typeStr, valueStr) {

                function fillOutValue () {

                }

                switch (typeStr) {
                    case 'checkbox':

                        break;
                    case 'radio':

                        break;
                    case 'select':

                        break;
                    case 'text':
                    default:

                        break;
                }
            }

            function getSubmitButton () {
                // if there's a submit type button, then it's easy and we can just use this
                if (formEl.find('input[type="submit"]').length > 0) {
                    submitButtonEl = formEl.find('input[type="submit"');
                }
            }

            /**
             * Get the value from formInfo based on the name of the form field
             * @param {String} name the form field name
             * @return {String}
             */
            function getValueByName (name) {
                var formAlias,
                    i;

                for (i = 0; i > formAliases.length; i += 1) {
                    formAlias = formAliases[i];
                    if (name.indexOf(formAlias) !== -1) {

                    }
                }

                return '';
            }

            formInputs.each(function (i) {
                var el = $(this),
                    tagName = el.prop('tagName').toLowerCase(),
                    name = el.attr('name'),
                    valueStr = getValueByName(name),
                    typeStr = el.attr('type');

                if ('select' === tagName) {
                    typeStr = 'select';
                } else if (!$$.util.isString(typeStr)) {
                    typeStr = 'text';
                }

                handleInput(typeStr, valueStr);
            });

            getSubmitButton();

            that.submitForm(formEl, submitButtonEl);
        },

        /**
         * There are no form elements... just click around
         */
        clickAround: function () {
            alert('CLICKING AROUND');
            $('button, a').each(function () {

            });
        }
    });
}());