(function() {
    'use strict';
    $$.klass(function OfferForm () {
        var clickAroundWindowLimit = 2,
            clickAroundTimeLimit = 7000,
            gptParsedStr  = 'gptParsed',
            gptHandledStr = 'gptHandledStr',
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
                email: [
                    'e-mail'
                ],
                first: [

                ],
                last: [

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
                    'postal',
                    'zc'
                ],
                phone: {
                    home: [

                    ],
                    mobile: [
                        'cell'
                    ]
                }
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
                that = this;

            Storage.freezeGetOnItem('lastForms');
            Storage.getItem('lastForms', function (lastFormsArr) {
                lastFormsArr = lastFormsArr || [];


                var formInputEls = formEl.find('[name]').not('[type="hidden"]'),
                    /**
                     * The new last form object to be appended to array
                     */
                    lastFormObj = {},
                    lastFormNameTypeObj;

                lastFormObj.serializedStr = formEl.find(':input[type!="hidden"]').serialize();
                lastFormObj.formNamesArr = [];

                /**
                 * Add name and type of each visible input to lastFormObj.formNamesArr
                 */
                formInputEls.each(function (i) {
                    var formInputEl = $(this);

                    lastFormNameTypeObj = {};

                    if (formInputEl.attr('name')) {
                        lastFormNameTypeObj.name = formInputEl.attr('name');
                    }

                    if (formInputEl.attr('type')) {
                        lastFormNameTypeObj.type = formInputEl.attr('type');
                    }

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
         * @return {Number}
         */
        this.getClickAroundWindowLimit = function () {
            return clickAroundWindowLimit;
        };

        /**
         * @return {Number}
         */
        this.getClickAroundTimeLimit = function () {
            return clickAroundTimeLimit;
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
    }, {
        /**
         * Parse the DOM and look for THE appropriate form to focus on.
         * Also remove the last completed form if it exists in the DOM.
         */
        evaluateForms: function (callback) {
            var formEls = $('form:visible'),
                that = this;

            /**
             * Get lastForms array and see if it matches any of the current forms,
             * and if so, remove!
             */
            function removePreviouslySubmittedForms () {
                // TODO - write
                this.getLastFormsArr(function (lastFormsArr) {
                    if (!$$.util.isArray(lastFormsArr) || lastFormsArr.length === 0) {
                        return callback(formEls);
                    }

                    // DEBUG to allow for last form to not get stuck
//                    that.removeLastFormsArr();
                    // END DEBUG
                    var formExistsInLastFormsBool;

                    formEls.filter(function (i) {
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
                         */
                        function lastFormExistsInEnumeratingThroughLastNameTypeObj (lastFormNameTypesArr) {
                            for (k = 0; k < lastFormNameTypesArr.length; k += 1) {
                                nameStr = lastFormNameTypesArr[k].name;
                                typeStr = lastFormNameTypesArr[k].type;

                                if (nameStr &&
                                    formEl.find('[name="' + nameStr + '"]').length === 0
                                ) {
                                    return true;
                                }

                                if (typeStr &&
                                    formEl.find('[type="' + typeStr + '"]').length === 0
                                ) {
                                    return true;
                                }
                            }

                            return false;
                        }

                        for (j = 0; j < lastFormsArr.length; j += 1) {
                            lastFormObj = lastFormsArr[j];
                            if (formEl.find(':input[type!="hidden"]').serialize() === lastFormObj.serializedStr) {
                                formExistsInLastFormsBool = true;
                                break;
                            }

                            if (true === lastFormExistsInEnumeratingThroughLastNameTypeObj(lastFormsArr[j].formNamesArr)) {
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
                        alert('last form exists!');
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

            var formInputEls = formEl.find('input:text, input[type="checkbox"], input[type="radio"], select, textarea').filter(':visible'),
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
                alert('ZERO form inputs in this form??!!?');
                return $$('OfferFormSubmit').submit(formEl);
            }

            /**
             * Take care of the input
             * @param {String} typeStr ('text', 'radio', 'checkbox' or 'select')
             * @param {jQuery} inputEl
             * @param {String|Object} value
             * @param {jQuery} labelEl
             */
            function handleInput (typeStr, inputEl, value, labelEl) {
                var inputKlassStr = 'OfferForm' + typeStr.substr(0,1).toUpperCase() + typeStr.substr(1), // OfferFormText, OfferFormRadio, etc.
                    inputKlass    = $$(inputKlassStr),
                    gptHandledStr = that.getHandledStr();

                if (null === inputKlass) {
                    throw new AppError(inputKlassStr + ' is not a valid klass');
                }

                inputKlass.fillOut(inputEl, value, labelEl);

                // set as handled
                inputEl.data(gptHandledStr, true);
                inputEl.attr('data-' + gptHandledStr, '1');
            }

            /**
             * Get the value from formInfo based on the formNameStr of the form field
             * @param {String} formNameStr the form field name
             * @param {Array} [nestedAliases] the nested aliases used for recursion
             * @return {String|Object}
             */
            function getValueByName (formNameStr, nestedAliases) {
                // TODO - this should have different implications for radio and checkbox, since all the form aliases are for textboxes and selects only.  In this case, find the matching label and pass that to value
                if ($$.util.isUndefined(formNameStr)) {
                    return '';
                }

                formNameStr = formNameStr.toLowerCase();

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
             */
            function parseInput (inputEl) {
                var tagNameStr    = inputEl.prop('tagName').toLowerCase(),
                    nameStr       = inputEl.attr('name'),
                    value         = getValueByName(nameStr),
                    typeStr       = inputEl.attr('type'),
                    labelEl,
                    gptParsedStr  = that.getParsedStr();

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

                // mark as parsed to avoid going through again
                inputEl.data(gptParsedStr, true);
                inputEl.attr('data-' + gptParsedStr, '1');

                handleInput(typeStr, inputEl, value, labelEl);
            }

            this.listen('INPUT_DONE_HANDLING', function () {
                i += 1;
                // DEBUG HERE WITH THE SETTIMEOUT, ALTHOUGH PROBABLY ADVISED TO LEAVE IN..??...  Try to get script to act human!
                setTimeout(function () {
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
                            return that.trigger('INPUT_DONE_HANDLING');
                        } else {
                            console.log('handling form input ' + i);
                            parseInput(inputEl);
                        }
                    } else {
                        that.removeListener('INPUT_DONE_HANDLING');
                        return $$('OfferFormSubmit').submit(formEl, formInputs);
                    }
                }, 1000);
            });

            parseInput(formInputs.eq(i));
        },

        /**
         * There are absolutely ZERO form elements or inputs... just click around...?
         * TODO - setTimeout to check if windowNum is empty and if so, just skip the stupid offer!
         */
        clickAround: function () {
            alert('CLICKING AROUND');
            var hrefsClickedArr = [],
                windowNum,
                windowLimitNum = this.getClickAroundWindowLimit();

            setTimeout(function () {
                if (0 === windowNum) {
                    $$('Offer').skipOffer();
                }
            }, this.getClickAroundTimeLimit);

            $$('Storage').getItem('currentGptWindowId', function (gptWindowId) {
                $('button, a').each(function () {
                    var el = $(this),
                        hrefStr = el.attr('href'),
                        hasHrefBool = ($$.util.isString(hrefStr) && hrefStr.indexOf('mailto:') === -1),
                        hasOnClickBool = $$.util.isString(el.attr('onclick'));

                    if (true === hasOnClickBool) {
                        el.trigger('click');
                    }

                    if (true === hasHrefBool &&
                        window.location.href !== hrefStr &&
                        false === $$.util.inArray(hrefsClickedArr, hrefStr) &&
                        windowNum < windowLimitNum
                    ) {
                        hrefsClickedArr.push(hrefStr);
                        windowNum += 1;

                        // open new tab in GPT window
                        $$('Message').sendMessage({
                            klass: 'Tab',
                            method: 'createNewTab',
//                            active: false,
                            args: [{
                                windowId: gptWindowId,
                                url: hrefStr
                            }]
                        });
                    }
                });
            });
        }
    });
}());