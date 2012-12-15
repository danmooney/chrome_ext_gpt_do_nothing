$(document).ready(function () {
    var Message = $$.instance('Message'),
        Storage = $$.instance('Storage'),
        Gpt = $$.instance('Gpt'),
        gptKlassesNum = 0,
        i;

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
    $$.instance('Storage').setItem({
        contact_info: {
            first_name: 'Daniel',
            last_name: 'Mooney',
            address: '5 Nabby Rd',
            address2: 'Unit A12',
            city: 'Danbury',
            state: 'CT',
            zip: '06811',
            phone: {
                home: '2032619103',
                mobile: '2032619103'
            },
            email: 'doesttwork@gmail.com'
        }
    });

    // boot up GPT if tabId is the same
    Message.sendMessage({
        klass: 'App',
        method: 'isWorking'
    }, function (appWorkingBool) {
        if (false === appWorkingBool) {
            return;
        }
        Message.sendMessage({
            klass: 'Tab',
            method: 'getCurrentlySelectedTabIdSync'
        }, function (tabId) {
            Storage.getItem('currentGptTabId', function (gptTabId) {
                console.warn('tabId: ' + tabId + '  gptTabId: ' + gptTabId);
                if (tabId === gptTabId) {
                    $$.instance('GptSite').start();
                }
            });
        });
    });
});