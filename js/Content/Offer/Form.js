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
                email: [
                    'e-mail'
                ],
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
                formInputs = formEl.find('input:text, input[type="checkbox"], input[type="radio"], select, textarea'),
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
             * @param {String|Object} value
             * @param {jQuery} labelEl
             */
            function handleInput (inputEl, typeStr, value, labelEl) {
                var valueChangeSpeed = 20,
                    emptyValueBool = (value === '' || $$.util.isUndefined(value));


                /**
                 * Fill out text/textarea fields
                 */
                function fillOutText () {
                    var i = 1,
                        j;

                    inputEl.focus();

                    // if value is empty, get a random value
                    if (true === emptyValueBool) {
                        value = 'OK';
                    }

                    /**
                     * Simulate typing
                     * TODO - 'this' is getting messed up
                     */
                    function changeValue () {
                        var that = this;
                        inputEl.val(value.substr(0, i));

                        if (i === value.length) {
                            inputEl.blur();
                            return inputDoneHandling.call(that);
                        }

                        i += 1;
                        return setTimeout(function () {
                            changeValue.call(that);
                        }, valueChangeSpeed);
                    }
                    
                    if ($$.util.isObject(value)) {
                        for (j in value) {
                            if (!value.hasOwnProperty(j)) {
                                continue;
                            }
                            value = value[j];
                            break;
                        }
                    }
                    
                    changeValue.call(that);
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
                    return formEl.find('input[type="submit"]');
                }

                if (formEl.find('input[onclick]').length > 0) {
                    formEl.find('input[onclick]');
                }
            }

            /**
             * Get the value from formInfo based on the formNameStr of the form field
             * @param {String} formNameStr the form field name
             * @param {Array} nestedAliases the nested aliases used for recursion
             * @return {String|Object}
             * TODO!!
             */
            function getValueByName (formNameStr, nestedAliases) {
                if ($$.util.isUndefined(formNameStr)) {
                    return '';
                }

                var formAliasNameStr,
                    formAliasArr,
                    matchedFormNameStr,
                    i,
                    j;

                for (i in formAliases) {
                    if (!formAliases.hasOwnProperty(i)) {
                        continue;
                    }
                    formAliasNameStr = i;
                    formAliasArr = formAliases[i];

                    if (formNameStr.indexOf(formAliasNameStr) !== -1) {  // object key is direct match
                        matchedFormNameStr = formAliasNameStr;
                    } else { // look in alias array list
                        for (j = 0; j < formAliasArr.length; j += 1) {
                            if (formNameStr.indexOf(formAliasArr[j]) !== -1) {
                                matchedFormNameStr = formAliasNameStr;
                                break;
                            }
                        }
                    }

                    if ($$.util.isString(matchedFormNameStr)) {
                        console.log(formNameStr + ' matches with ' + matchedFormNameStr);
                        break;
                    }
                }

                if (!$$.util.isString(matchedFormNameStr)) {
                    return '';
                }

                /**
                 * We have a matched form alias name, let's get its value
                 * @return {*}
                 */
                function searchForFormInfoValueByName (name) {
                    if ($$.util.isDefined(formInfo[name])) {
                        console.log('returning ' + formInfo[name]);
                        return formInfo[name];
                    }

                    return '';
                }

                return searchForFormInfoValueByName(matchedFormNameStr);
            }

            /**
             * Gather all the DOM info for the input and pass off to handler
             * @param inputEl
             * TODO - maybe group radios together... will this ever be important???
             * TODO - check if input is invisible???
             */
            function parseInput (inputEl) {
                var tagNameStr = inputEl.prop('tagName').toLowerCase(),
                    nameStr    = inputEl.attr('name'),
                    value      = getValueByName(nameStr),
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

                handleInput(inputEl, typeStr, value, labelEl);
            }

            this.listen('INPUT_DONE_HANDLING', function () {
                i += 1;

                if (i < formInputs.length) {
                    console.log('handling form input ' + i);
                    parseInput(formInputs.eq(i));
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
            var hrefsClickedArr = [];
            $$('Storage').getItem('currentGptWindowId', function (gptWindowId) {
                $('button, a').each(function () {
                    var el = $(this),
                        hrefStr = el.attr('hrefStr'),
                        hasHrefBool = ($$.util.isString(hrefStr) && hrefStr.indexOf('mailto:') === -1),
                        hasOnClickBool = $$.util.isString(el.attr('onclick'));


                    if (true === hasOnClickBool) {
                        el.trigger('click');
                    }

                    if (true === hasHrefBool &&
                        window.location.href !== hrefStr &&
                        false === $$.util.inArray(hrefsClickedArr, hrefStr)
                    ) {
                        hrefsClickedArr.push(hrefStr);
                        // open new tab in GPT window
                        $$('Message').sendMessage({
                            klass: 'Tab',
                            method: 'createNewTab',
                            args: {
                                windowId: gptWindowId,
                                url: hrefStr
                            }
                        });
                    }
                });
            });
        }
    });
}());