(function() {
    'use strict';
    $$.klass(function OfferForm () {
        var gptParsedStr  = 'gptParsed',
            gptHandledStr = 'gptHandledStr',
            stopFillingOutBool = false,
            /**
             * The selector string for all visible, non-submittable (fillable) named form inputs.
             * This is used for filling out the form!
             * @param {String}
             */
            visibleFillableFormInputSelectorStr = ':visible:input' + /*[name] - Some form inputs don't have names!!! */ '' + '[type!="hidden"][type!="submit"]:not(button)',
            /**
             * The selector string for all the form inputs with name attributes.
             * This is used for form serialization and comparison between other forms.
             */
            namedFormInputSelectorStr   = 'input[name]' /*visibleFormInputSelectorStr.replace(/(:visible|\[type!="hidden"\])/, '')*/,
            /**
             * The form we are working with on this page via OfferForm klass
             * @type {jQuery}
             */
            form,
            /**
             * List containing all of the form values to populate (ex. first name, last name, city, state, etc.)
             * @type {Object}
             */
            formInfo,
            /**
             * Form info name/alias mapping
             * @type {Object}
             * TODO - phone is going to be tough to do! Sometimes there's 3 inputs, sometimes there's 1!
             */
            formAliases = {
                title: [],
                secondary_email: [
                    'secondary-email',
                    'secondary-e-mail',
                    'secondary-e_mail'
                ],
                email: [
                    'e-mail',
                    'e_mail'
                ],
                username: [

                ],
                first: [

                ],
                middle: [
                    'initial'
                ],
                last: [

                ],
                name: [

                ],
                sex: [
                    'gender',
                    'male-female',
                    'female-male',
                    'mf',
                    'm-f',
                    'm_f'
                ],
                month: [

                ],
                date: [
                    'day'
                ],
                year: [

                ],
//                age: [
//
//                ],
                occupation: [
                    'job'
                ],
                employer: [
                    'boss'
                ],
                address2: [
                    'second',
                    'address(.)*2'
                ],
                address: [

                ],
                city: [

                ],
                state: [
                    'province'
                ],
                country: [

                ],
                zip: [
                    'postal',
                    'code',
                    'zc'
                ],
                home_phone: [
                    'home',
                    'homephone',
                    'home-phone'
                ],
                cell_phone: [
                    'cell',
                    'mobile'
                ],
                phone: [
//                    'area',
//                    {
//                        home: [
//
//                        ],
//                        mobile: [
//                            'cell'
//                        ]
//                    }
                ],
                ssn: [
                    'social'
                ],
                password: [
                    'pass',
                    'confirm'
                ]
            };



        /**
         * @return {String}
         */
        this.getVisibleFillableFormInputSelectorStr = function () {
            return visibleFillableFormInputSelectorStr;
        };

        /**
         * @return {String}
         */
        this.getNamedFormInputSelector = function () {
            return namedFormInputSelectorStr;
        };

        /**
         * Set the user's form information
         * @param formInfoObj
         * @param callback
         * TODO - incorporate options and check currently selected formInfo
         */
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

        /**
         * Store names of form as query string to ensure that we're not filling out the same form multiple times.
         * This method appends to the currently existing stored lastForms array and creates it if it doesn't exist
         *
         * @param {jQuery} formEl
         * @param callback
         */
        this.setLastFormsArr = function (formEl, callback) {
            var Storage = $$('Storage'),
                namedFormInputSelector = this.getNamedFormInputSelector(),
                that = this;

            Storage.freezeGetOnItem('lastForms');
            Storage.getItem('lastForms', function (lastFormsArr) {
                lastFormsArr = lastFormsArr || [];

                var formInputEls = formEl.find(namedFormInputSelector),
                    /**
                     * The new last form object to be appended to array
                     */
                    lastFormObj = {},
                    lastFormNameTypeObj;

                lastFormObj.serializedStr = formInputEls.serialize();
                lastFormObj.formNamesArr = [];

                /**
                 * Add name and type of each visible input to lastFormObj.formNamesArr
                 */
                formInputEls.each(function (i) {
                    var formInputEl = $(this);

                    lastFormNameTypeObj      = {};
                    lastFormNameTypeObj.type = formInputEl.attr('type');
                    lastFormNameTypeObj.name = formInputEl.attr('name');

                    lastFormObj.formNamesArr.push(lastFormNameTypeObj);
                });

                lastFormsArr.push(lastFormObj);

                Storage.setItem('lastForms', lastFormsArr, function () {
                    Storage.releaseGetOnItem('lastForms'); // release and allow another get of 'lastForms'
                    Storage.freezeGetOnItem('lastForms');
                    if ($$.util.isFunc(callback)) {
                        callback();
                    }
                });
            });
        };

        this.getLastFormsArr = function (callback) {
            $$('Storage').getItem('lastForms', callback);
        };

        this.removeLastFormsArr = function (callback) {
            $$('Storage').removeItem('lastForms', callback);
        };

        /**
         * Determine if inputEl has already been parsed or not
         * @param {jQuery} inputEl
         * @return {Boolean}
         */
        this.hasBeenParsed = function (inputEl) {
            return (
                $$.util.isString(inputEl.attr('data-' + this.getParsedStr()))) ||
                $$.util.isDefined(inputEl.data(this.getParsedStr())
            );
        };

        this.getParsedStr = function () {
            return gptParsedStr;
        };

        this.getHandledStr = function () {
            return gptHandledStr;
        };

        this.setForm = function (formEl) {
            form = formEl;
        };

        this.getForm = function () {
            return form;
        };

        this.stopFillingOut= function () {
            stopFillingOutBool = true;
        };

        this.isStopRequested = function () {
            return stopFillingOutBool;
        };

    }, {
        /**
         * Inline forms are not evaluated as visible by jQuery, so force them to be block
         */
        convertInlineFormsToBlock: function () {
            $('form').each(function () {
                var formEl = $(this);
                if (formEl.css('display') !== 'inline') {
                    // continue loop
                    return true;
                }

                formEl.css('display', '').attr('style', function (i, s) {
                    return s + 'display: block!important;';
                });
            });
        },


        /**
         * Parse the DOM and look for THE appropriate form to focus on.
         * Also remove the last completed form if it exists in the DOM.
         * TODO - what if there are no forms and we get stuck submitting the same formless input elements over and over again?
         */
        evaluateForms: function (callback) {
            this.convertInlineFormsToBlock();

            var formEls = $('form:visible'),
                that = this;

            /**
             * Get lastForms array and see if it matches any of the current forms,
             * and if so, remove!
             */
            function removePreviouslySubmittedForms () {
                var namedFormInputSelectorStr = this.getNamedFormInputSelector();

                this.getLastFormsArr(function (lastFormsArr) {
                    if (!$$.util.isArray(lastFormsArr) || lastFormsArr.length === 0) {
                        return callback(formEls);
                    }

                    // DEBUG to allow for last form to not get stuck
//                    that.removeLastFormsArr();
                    // END DEBUG
                    var formExistsInLastFormsBool;

                    formEls = formEls.filter(function (i) {
                        formExistsInLastFormsBool = false;

                        var formEl = formEls.eq(i),
                            lastFormObj,
                            nameStr,
                            typeStr,
                            j,
                            k;

                        /**
                         * Checks for all the names and types in the form and compare
                         * @return {Boolean}
                         * TODO - test!
                         */
                        function lastFormExistsInEnumeratingThroughLastNameTypeObj (lastFormNameTypesArr) {

                            // if form's name input length is not equal to lastForm's nameArr length, they are obviously different!
                            if (formEl.find(namedFormInputSelectorStr).length !== lastFormNameTypesArr.length) {
                                return false;
                            }

                            for (k = 0; k < lastFormNameTypesArr.length; k += 1) {
                                nameStr = lastFormNameTypesArr[k].name;
                                typeStr = lastFormNameTypesArr[k].type;

                                if (nameStr &&  // if nameStr is defined and the form doesn't have this name attribute, then these two forms are NOT the same (false), and the form will be considered for evaluating
                                    formEl.find('[name="' + nameStr + '"]').length === 0
                                ) {
                                    return false;
                                }

                                if (typeStr && // if typeStr is defined and the form doesn't have this type attribute, then these two forms are NOT the same (false), and the form will be considered for evaluating
                                    formEl.find('[type="' + typeStr + '"]').length === 0
                                ) {
                                    return false;
                                }
                            }

                            // forms are definitely the same;
                            // every name/type that the last form had this form also has
                            return true;
                        }

                        for (j = 0; j < lastFormsArr.length; j += 1) {
                            lastFormObj = lastFormsArr[j];
                            if (lastFormObj.serializedStr !== '' &&
                                formEl.find(namedFormInputSelectorStr).serialize() === lastFormObj.serializedStr
                            ) {
                                formExistsInLastFormsBool = true;
                                break;
                            } else if (true === lastFormExistsInEnumeratingThroughLastNameTypeObj(lastFormObj.formNamesArr)) {
                                formExistsInLastFormsBool = true;
                                break;
                            }
                        }

                        if (true === formExistsInLastFormsBool) {
                            return false;
                        }

                        return true;
                    });

                    if (true === formExistsInLastFormsBool) {
//                        alert('One of the last form exists!  This form has already been filled out!');
                    }

                    callback(formEls);
                });
            }

            removePreviouslySubmittedForms.call(that);
        },

        /**
         * Parse the DOM and look for form inputs based on forms already evaluated
         * @return {jQuery} [formEl]
         */
        evaluateFormInputs: function (formEl) {
            formEl = formEl || $('body');

            var formInputEls = formEl.find(this.getVisibleFillableFormInputSelectorStr() + '[type!="submit"][type!="image"]:not(button)')/*.find(':input[type!="submit"]').not('button').filter(':visible')*/,
                nullElsBool,
                i;

            if (formEl.prop('tagName').toLowerCase() === 'form') {
                return formInputEls;
            } else {
                // remove inputs that have a form element ancestor, just in case we are trying to ignore a form
                //   and the proper one to focus on is the one that doesn't have a form wrapped around it
                //   TODO - This only happens if there are forms we are trying to IGNORE... so for DEBUGGING purposes how should it be maybe add data to it to tell methods to disable triggers on element?
                for (i = 0; i < formInputEls.length; i += 1) {
                    if (formInputEls.eq(i).closest('form').length > 0) {
                        formInputEls[i] = null;
                        nullElsBool = true;
                    }
                }

                if (true === nullElsBool) {
                    formInputEls = formInputEls.filter(function (i) {
                        return (this instanceof HTMLElement);
                    });
                }

                return formInputEls;
            }
        },

        /**
         * Parse form and fill out according to formInfo values
         */
        fillOutForm: function (formEl) {
            formEl = formEl || $('body');

            this.setForm(formEl);

            var formInfo = this.getFormInfo(),
                formAliases = this.getFormAliases(),
                formInputs = this.evaluateFormInputs(formEl),
                that = this,
                i = 0;

            if (formInputs.length === 0) {
                alert('ZERO visible inputs in this form; submitting');
//                return $$('Offer').lookForForms();
                return $$('OfferFormSubmit').submit(formEl);
            }

            /**
             * Take care of the input
             * @param {String} typeStr ('text', 'radio', 'checkbox' or 'select')
             * @param {jQuery} inputEl
             * @param {String|Object} value
             * @param {jQuery} labelEl
             * @param {String} key
             */
            function handleInput (typeStr, inputEl, key, value, labelEl) {
                var inputKlassStr = 'OfferForm' + typeStr.substr(0,1).toUpperCase() + typeStr.substr(1), // OfferFormText, OfferFormRadio, etc.
                    inputKlass    = $$(inputKlassStr),
                    gptHandledStr = that.getHandledStr();

                if (null === inputKlass) {
                    throw new AppError(inputKlassStr + ' is not a valid klass');
                }

                inputKlass.fillOut(inputEl, key, value, labelEl);

                // set as handled
                inputEl.data(gptHandledStr, true);
                inputEl.attr('data-' + gptHandledStr, '1');
            }

            /**
             * Get the value from formInfo based on the formNameStr of the form field
             * @param {String} formNameStr the form field name
             * @return {Array|String} The form info in key/value format or empty string
             */
            function getValueByName (formNameStr) {
                // TODO - this should have different implications for radio and checkbox, since all the form aliases are for text and select inputs only.  In this case, find the matching label and pass that to value
                if (!$$.util.isString(formNameStr) ||
                    $.trim(formNameStr).length === 0
                ) {
                    return ['', ''];
                }

                formNameStr = $.trim(formNameStr.toLowerCase());

                var formAliasNameStr,
                    formAliasArr,
                    matchedFormNameStr,
                    i;

                /**
                 * @param {Array|Object} formAliasArr
                 * @return {String|null}
                 */
                function lookForAlias (formAliasArr) {
                    var matchedAliasStr = '',
                        regExp,
                        j;

                    for (j = 0; j < formAliasArr.length; j += 1) {
                        if ($$.util.isString(formAliasArr[j])) {
                            if (formNameStr.indexOf(formAliasArr[j]) !== -1) {
                                matchedAliasStr = formAliasArr[j];
                                return matchedAliasStr;
                            } else {
                                try {  // regex
                                    regExp = new RegExp(formAliasArr[j]);

                                    if (true === regExp.test(formNameStr)) {
                                        matchedAliasStr = formAliasArr[j];
                                        return matchedAliasStr;
                                    }

                                } catch (e) {}
                            }
                        } else if ($$.util.isObject(formAliasArr[j])) {  // nested object
                            if (matchedAliasStr = lookForAlias(formAliasArr[j])) {
                                return matchedAliasStr;
                            }
                        }
                    }

                    return null;
                }

                for (i in formAliases) {
                    if (!formAliases.hasOwnProperty(i)) {
                        continue;
                    }

                    formAliasNameStr = i;  // the array key
                    formAliasArr = formAliases[i]; // the array value

                    if (formNameStr.indexOf(formAliasNameStr) !== -1) {  // object key is direct match
                        matchedFormNameStr = formAliasNameStr;
                    } else { // look in alias array list
                        matchedFormNameStr = lookForAlias(formAliasArr);
                    }

                    if ($$.util.isString(matchedFormNameStr)) {
                        matchedFormNameStr = formAliasNameStr;

                        console.log(formNameStr + ' matches with ' + matchedFormNameStr);
                        break;
                    }
                }

                if (!$$.util.isString(matchedFormNameStr)) {
                    console.log('could not find match for ' + /*matchedFormNameStr*/ formNameStr);
                    return ['', ''];
                }

                /**
                 * We have a matched form alias name, let's get its value
                 * @return {*}
                 */
                function searchForFormInfoValueByName (name) {
                    if ($$.util.isDefined(formInfo[name])) {
                        if ($$.util.isScalar(formInfo[name])) {
                            console.log('returning ' + formInfo[name]);
                        } else {
                            console.log('returning ');
                            console.dir(formInfo[name]);
                        }

                        return [matchedFormNameStr, formInfo[name]];
                    }
                    // This shouldn't happen!!!!!!!!!!!!
                    throw new AppError('Could not find form info value by name: ' + name);
//                    return ['', ''];
                }

                return searchForFormInfoValueByName(matchedFormNameStr);
            }

            /**
             * Gather all the DOM info for the input and pass off to handler
             * @param inputEl
             * TODO - maybe group radios/checkboxes together... will this ever be important???
             */
            function parseInput (inputEl) {
                var tagNameStr    = inputEl.prop('tagName').toLowerCase(),
                    nameStr       = inputEl.attr('name'),
                    typeStr       = inputEl.attr('type'),
                    gptParsedStr  = that.getParsedStr(),
                    keyValueArr,
                    key,
                    value,
                    labelEl,
                    labelTxtStr;

                /**
                 * Try to get the associated label with the form input... hopefully there is a label
                 * @return {jQuery|undefined}
                 */
                function getLabelEl () {
                    var id = inputEl.attr('id'),
                        labelEls = formEl.find('label'),
                        fakeLabelEl = $(),
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
                        labelEls.find('[for="' + id + '"]').length > 0
                    ) {
                        return labelEls.find('[for="' + id + '"]');
                    }

                    /**
                     * Make shitty guess... find fakeLabelEl for case when there are sibling td tags if in table
                     */
                    if (inputEl.closest('td, div').length > 0) {
                        closestTd = inputEl.closest('td, div').eq(0);
                        closestTdSiblings = closestTd.siblings();

                        closestTdSiblings.each(function () {
                            var el = $(this);
                            if ($.trim(el.text().replace('&nbsp;', '')) !== '') {
                                fakeLabelEl = el;
                                // break out of loop
                                return false;
                            }
                        });
                    }

                    return fakeLabelEl;
                }

                labelEl     = getLabelEl();
                labelTxtStr = $.trim(labelEl.text());

                keyValueArr = getValueByName(nameStr);
                key         = keyValueArr[0];
                value       = keyValueArr[1];

                // if appropriate value not found within form name, use the label element's text if it exists!
                // TODO - maybe switch around and parse labelTxtStr first if it exists, then try formNameStr if value is empty??
                if ('' === value && labelTxtStr.length > 0) {
                    keyValueArr = getValueByName(labelTxtStr);
                    key         = keyValueArr[0];
                    value       = keyValueArr[1];
                }

                if ('select' === tagNameStr) {
                    typeStr = 'select';
                } else if (!$$.util.isString(typeStr) || 'password' === typeStr) {
                    typeStr = 'text';
                }

                // mark as parsed to avoid going through again
                inputEl.data(gptParsedStr, true);
                inputEl.attr('data-' + gptParsedStr, '1');

                handleInput(typeStr, inputEl, key, value, labelEl);
            }

            // TODO - implement setTimeoutBool in the triggers in the various input klasses.  setTimeoutBool should be false when there's enough inputs of the same name that are filled out (in radio's case, 1, and >= 1 in checkbox's case)
            this.listen('INPUT_DONE_HANDLING', function (setTimeoutBool) {
                i += 1;

                if ($$.util.isUndefined(setTimeoutBool)) {
                    setTimeoutBool = true;
                }

                function evaluateNextInput () {
                    if (true === that.isStopRequested()) {
                        return;
                    }

                    var
                        /**
                         * There's so much ajax going on in these ones today that re-evaluating the form for new inputs is essential!!!!!
                         * Re-evaluate form inputs length to see if this function needs to be run from the beginning.
                         */
                        currentInputsLength = that.evaluateFormInputs(formEl).length,
                        inputEl;

                    if (currentInputsLength !== formInputs.length) {
                        alert('NEW INPUTS HAVE BEEN ADDED');
                        that.removeListener('INPUT_DONE_HANDLING');
                        return that.fillOutForm(formEl);
                    }

                    if (i < formInputs.length) { // more formInputs to go!
                        inputEl = formInputs.eq(i);

                        if (true === that.hasBeenParsed(inputEl)) { // if already parsed, go to next formInput
                            return that.trigger('INPUT_DONE_HANDLING', inputEl);
                        } else {
                            console.log('handling form input ' + i);
                            return parseInput(inputEl);
                        }
                    } else {
                        that.removeListener('INPUT_DONE_HANDLING');
                        return $$('OfferFormSubmit').submit(formEl, formInputs);
                    }
                }

                if (true === setTimeoutBool) {
                    setTimeout(evaluateNextInput, 1000);
                } else {
                    evaluateNextInput();
                }
            });

            parseInput(formInputs.eq(i));
        }
    });
}());