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
            if (false === appWorkingBool) {
                return;
            }

            // override window.alert/window.confirm
            $$('Injector')
                .inject('overrideAlert')
                .inject('overrideConfirm');

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
                                .inject('overrideOnBeforeUnload')
                                .checkForInterceptedPopupsAndTrigger();
                            $$('Offer').start();
                        }
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
            if (false === appWorkingBool) {
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

        // TODO - Storing contact info here for now
        // obviously put somewhere better later
        $$('Storage').setItem('formInfo', [{
            first: 'Daniel',
            middle: 'R',
            last: 'Mooney',
            name: 'Daniel Mooney',
            address: '5 Nabby Rd',
            address2: 'Unit A12',
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
            home_phone: '2032619103',
            cell_phone: '2032619102',
            phone: '2032619103',
//            phone: {
//                home: '2032619103',
//                mobile: '2032619102'
//            },
            email: 'doesttwork@gmail.com'
        }]);

        Message.sendMessage({
            klass: 'App',
            method: 'isWorking'
        }, function (appWorkingBool) {
            if (false === appWorkingBool) {
                return;
            }
            checkForGptSitePageOrGptOfferPage();
        });
    });

    // DEBUG
    (function parseOfferNow() {
        window.onkeypress = function (e) {
            if (126 !== e.which) { // ~ (tilde) character
                return true;
            }
            alert('PARSING OFFER NOW');
            window.onkeypress = null;
            $$('OfferForm').removeLastFormsArr(function () {
                $$('Offer').start(true);
            });
        };
    }());
    // END DEBUG
}());
