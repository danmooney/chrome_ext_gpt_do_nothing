(function() {
    'use strict';
    $$.app.namespace();

    var Message = $$('Message'),
        Storage = $$('Storage'),
        Gpt     = $$('Gpt'),
        gptKlassesNum = 0,
        alreadyCheckedBool = false,
        alreadyDebuggedBool = false,
        formCheckInterval,
        i;

    /**
     * @return {Boolean}
     */
    function isAppWorking (appWorkingBool) {
        if (!$$.util.isBool(appWorkingBool) || false === appWorkingBool) {
            return false;
        }

        return true;
    }

    // override window.alert/window.confirm
    function injectOverrides (callback) {
        $$('Injector')
            .inject('jquery')
            .checkForInterceptedPopupsAndTrigger();

        $$('EvtBus').listen('onjquery', function() {
            $$('EvtBus').removeListener('onjquery');
            callback();
        });
    }

    // boot up GPT if tabId is the same,
    // and complete offer if windowId is the same
    function checkForGptSitePageOrGptOfferPage () {
        // if already determined to be offer page, return
        if (true === alreadyCheckedBool) {
            return;
        }
        alreadyCheckedBool = true;
        Message.sendMessage({
            klass: 'App',
            method: 'isWorking'
        }, function (appWorkingBool) {
            if (!isAppWorking(appWorkingBool)) {
                return;
            }

            injectOverrides(function () {
                Message.sendMessage('getThisTab', function (tab) {
                    // check if windowId matches
                    Storage.getItem('currentGptWindowId', function (gptWindowId) {
                        // make sure that reloaded page isn't the actual GPT site itself
                        Storage.getItem('currentGptTabId', function (gptTabId) {
                            if (gptTabId === tab.id) {
                                Storage.getItem('currentGptRedirectUrl', function (redirectUrl) {
                                    if ($$.util.isString(redirectUrl)) {
                                        // remove redirect request
                                        Storage.removeItem('currentGptRedirectUrl', function () {
                                            if (window.location.href === redirectUrl) {
                                                $$('GptSite').start();
                                            } else {
                                                window.location = redirectUrl;
                                            }
                                        });
                                    } else {
                                        $$('GptSite').start();
                                    }
                                });
                            } else if (tab.windowId === gptWindowId) {
                                $$('Injector')

                                $$('Offer').start();
                            }
                        });
                    });
                });
            });
        });
    }

    // sometimes these offer pages take forever to load...
    // just check if form exists and get this show on the road.
    (function jumpTheGunOnParsingPage() {
        Message.sendMessage({
            klass: 'App',
            method: 'isWorking'
        }, function (appWorkingBool) {
            if (!isAppWorking(appWorkingBool)) {
                return;
            }
            formCheckInterval = setInterval(function () {
                if ($('form').length > 0) {
                    clearInterval(formCheckInterval);
                    checkForGptSitePageOrGptOfferPage();
                }
            }, 100);
        });
    }());

    $(document).ready(function () {
        $$.app.namespace();

        Message.sendMessage({
            klass: 'Url',
            method: 'setCurrentUrl',
            args: [
                window.location.href
            ]
        });

        // enumerate through and add to gptKlassesNum
        for (i in Gpt) {
            if (!Gpt.hasOwnProperty(i) ||
                !$$.util.isFunc(Gpt[i].isInheritingFrom) ||
                !Gpt[i].isInheritingFrom('Gpt')
            ) {
                continue;
            }
            // valid gpt klass, add 1 to gptKlassesNum
            gptKlassesNum += 1;
        }

        Gpt.setGptKlassesNum(gptKlassesNum);

        // enumerate through again and call ready on Gpt klass
        // TODO - combine 2 with enumeration closure
        for (i in Gpt) {
            if (!Gpt.hasOwnProperty(i) ||
                !$$.util.isFunc(Gpt[i].isInheritingFrom) ||
                !Gpt[i].isInheritingFrom('Gpt')
            ) {
                continue;
            }

            if ($$.util.isFunc(Gpt[i].ready)) {
                Gpt[i].ready();
            }
        }

        console.warn('Global Object: ');
        console.dir(GPT);

        /**
         *  TODO - Storing contact info here for now,
         *         obviously put somewhere better later
         */
//        $$('Storage').setItem('formInfo', [{
//            first: 'Daniel',
//            middle: 'R',
//            last: 'Mooney',
//            name: 'Daniel Mooney',
//            sex: 'male',
//            age: '25',
//            occupation: 'DJ',
//            month: {
//                short: '6',
//                long: 'June'
//            },
//            day: '3',
//            year: '1987',
//            address: '5 Nabby Rd',
//            address2: 'Unit A12',
//            city: 'Danbury',
//            password: 'A180s1c61cdA', // TODO - make password meet universal requirements? (i.e. special characters??)
//            state: {
//                short: 'CT',
//                long: 'Connecticut'
//            },
//            country: {
//                short: 'USA',
//                long: 'United States'
//            },
//            zip: '06811',
//            home_phone: '2032619103',
//            cell_phone: '2032619102',
//            phone: '2032619103',
////            phone: {
////                home: '2032619103',
////                mobile: '2032619102'
////            },
//            email: 'doesttwork2@gmail.com',
//            ssn: '041870203'
//        }]);

        $$('Storage').setItem('formInfo', [{
            title: 'Mr.',
            message: 'Yes I like this very much',
            first: 'David',
            middle: 'R',
            last: 'Boone',
            name: 'David Boone',
            username: 'davidboone',
            sex: 'male',
            age: '25',
            occupation: 'Pianist',
            employer: 'Marty Heinz',
            month: {
                short: '5',
                long: 'March'
            },
            date: '3',
            year: '1978',
            address: '407 Main Street',
            address2: '101',
            city: 'Danbury',
            password: 'A180s1c61cdA', // TODO - make password meet universal requirements? (i.e. special characters??)
            state: {
                short: 'CT',
                long: 'Connecticut'
            },
            country: {
                short: 'USA',
                long: 'United States'
            },
            zip: '06811',
            home_phone: '2032688419',
            cell_phone: '2036858291',
            phone: '2032688419',
//            phone: {
//                home: '2032619103',
//                mobile: '2032619102'
//            },
            email: 'doesttwork2@gmail.com', // TODO - switch to different email after testing!
            secondary_email: 'doesttwork@gmail.com',
            ssn: '041870203'
        }]);

        Message.sendMessage({
            klass: 'App',
            method: 'isWorking'
        }, function (appWorkingBool) {
            if (!isAppWorking(appWorkingBool)) {
                return;
            }
            checkForGptSitePageOrGptOfferPage();
        });
    });

    // DEBUG
    function bindDebugKeys() {
        window.onkeypress = function (e) {
            if (33 === e.which) { // ! character.  This will clear the last forms storage
                return $$('OfferForm').removeLastFormsArr(function () {
                    alert('removed last forms from storage');
                });
            }

            if (126 !== e.which) { // ~ (tilde) character
                return true;
            } else {
//                alert('PARSING OFFER NOW');
                var c = confirm('Would you like to parse this offer?');
                if (false === c) {
                    window.onkeypress = null;
                    return;
                }

                injectOverrides(function () {
                    window.onkeypress = function (e) {   // TODO - provide way to stop fillOut from continuing
                        if (126 !== e.which) { // ~ (tilde) character
                            return true;
                        }
                        alert('STOP Requested: Will stop after this input is finished.');
                        $$('OfferForm').stopFillingOut();
                        bindDebugKeys();
                    };

                    $$('Message').sendMessage({
                        klass: 'Window',
                        method: 'getCurrentlySelectedWindow'
                    }, function (windowObj) {
                        function callback (windowId) {
                            $$('Message').sendMessage({
                                klass: 'Window',
                                method: 'storeGptKlassWindowId',
                                args: [windowId]
                            },  function () {
                                $$('Offer').start(true);
                            });
                        }

                        if ($$.util.isNumber(windowObj.id)) {
                            callback(windowObj.id);
                        } else {
                            $$('Storage').getItem('currrentGptWindowId', function (windowId) {
                                callback(windowId);
                            });
                        }
                    });
                });
            }
        };
    }

    bindDebugKeys();
    // END DEBUG
}());
