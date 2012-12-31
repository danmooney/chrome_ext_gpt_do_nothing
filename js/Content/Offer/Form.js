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
            return $('form:visible');
        },

        submitForm: function (formEl, submitButtonEl) {
            // if window unloading, forget submitting
            if ($('#gpt-offer-form-submitted').length > 0) {
                return;
            }

            if ($$.util.isDefined(submitButtonEl)) {
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
                that = this,
                i = 0;

            if (formInputs.length === 0) {
                alert('no form inputs in this form??!!?');
                return this.submitForm(formEl);
            }

            /**
             * Take care of the input
             * @param {jQuery} inputEl
             * @param {String} typeStr ('text', 'radio', 'checkbox' or 'select')
             * @param {String} valueStr
             * @param {jQuery} labelEl
             */
            function handleInput (inputEl, typeStr, valueStr, labelEl) {
                var valueChangeSpeed = 20,
                    that = this;

                function fillOutText () {
                    var i = 1;

                    inputEl.focus();

                    /**
                     * Simulate typing
                     */
                    function changeValue () {
                        inputEl.val(valueStr.substr(0, i));

                        if (i === valueStr.length) {
                            return inputDoneHandling();
                        }

                        i += 1;
                        return setTimeout(changeValue, valueChangeSpeed);
                    }

                    changeValue();
                }

                /**
                 * Input Done Handling, go to next form input!
                 */
                function inputDoneHandling () {
                    that.trigger('INPUT_DONE_HANDLING');
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
                        fillOutText();
                        break;
                }
            }

            /**
             * Get the submit button to trigger onclicks if necessary
             * @return {jQuery|undefined}
             */
            function getSubmitButton () {
                // if there's a submit type button, then it's easy and we can just use this
                if (formEl.find('input[type="submit"]').length > 0) {
                    return formEl.find('input[type="submit"');
                }
            }

            /**
             * Get the value from formInfo based on the name of the form field
             * @param {String} name the form field name
             * @return {String}
             * TODO!!
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

            /**
             * Gather all the DOM info for the input and pass off to handler
             * @param inputEl
             * TODO - maybe group radios together... will this ever be important???
             */
            function parseInput (inputEl) {
                var tagNameStr = inputEl.prop('tagNameStr').toLowerCase(),
                    nameStr    = inputEl.attr('nameStr'),
                    valueStr   = getValueByName(nameStr),
                    typeStr    = inputEl.attr('type'),
                    labelEl;

                /**
                 * Try to get the associated label with the form input... hopefully there is a label
                 * @return {jQuery|undefined}
                 */
                function getLabelEl () {
                    var id = inputEl.attr('id'),
                        labelEls = formEl.find('label'),
                        fakeLabelEl,
                        closestTd,
                        closestTdSiblings;

                    /**
                     * Case when labelEl is the ancestor of the inputEl
                     */
                    if (inputEl.closest('label').length === 1) {
                        return inputEl.closest('label');
                    }

                    /**
                     * Case when 'for' attribute shared with id
                     */
                    if ($$.util.isString(id) &&
                        labelEls.find('[for="' + id + '"]')
                    ) {
                        return labelEls.find('[for="' + id + '"]');
                    }

                    /**
                     * Make shitty guess... find fakeLabelEl for case when there are sibling td tags if in table
                     */
                    if (inputEl.closest('td').length > 0) {
                        closestTd = inputEl.closest('td').eq(0);
                        closestTdSiblings = closestTd.siblings();

                        closestTdSiblings.each(function () {
                            var el = $(this);
                            if ($.trim(el.text().replace('&nbsp;', '')) !== '') {
                                fakeLabelEl = el;
                                // break out of loop
                                return false;
                            }
                        });

                        return fakeLabelEl;
                    }
                }

                labelEl = getLabelEl();

                if ('select' === tagNameStr) {
                    typeStr = 'select';
                } else if (!$$.util.isString(typeStr)) {
                    typeStr = 'text';
                }

                handleInput(inputEl, typeStr, valueStr, labelEl);
            }

            this.listen('INPUT_DONE_HANDLING', function () {
                i += 1;

                if (i < formInputs.length) {
                    console.log('handling form input ' + i);
                    parseInput(formInputs[i]);
                } else {
                    submitButtonEl = getSubmitButton();
                    that.submitForm(formEl, submitButtonEl);
                }
            });

            parseInput(formInputs.eq(i));
        },

        /**
         * There are no form elements... just click around
         */
        clickAround: function () {
            alert('CLICKING AROUND');
            $('button, a').each(function () {
                var el = $(this),
                    hasHrefBool = $$.util.isString(el.attr('href')),
                    hasOnClickBool = $$.util.isString(el.attr('onclick'));


                if (true === hasOnClickBool) {
                    el.trigger('click');
                }

                if (true === hasHrefBool) {
                    window.location = el.attr('href');
                }
            });
        }
    });
}());