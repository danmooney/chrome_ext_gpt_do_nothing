$(document).ready(function () {
    var Message = $$.instance('Message'),
        Gpt = $$.instance('Gpt'),
        gptKlassesNum = 0,
        i;

    Message.sendMessage({
        klass: 'Url',
        method: 'setCurrentUrl',
        args: [
            window.location.href
        ]
    });

    for (i in Gpt) {
        if (!Gpt.hasOwnProperty(i) ||
            i.substr(0, 1) === i.substr(0, 1).toLowerCase()
        ) {
            continue;
        }
        // valid gpt klass, add 1 to gptKlassesNum
        gptKlassesNum += 1;
    }

    Gpt.setGptKlassesNum(gptKlassesNum);

    // send message to bg page telling it that content has loaded
//        setTimeout(function () {
//            Message.sendMessage({
//                klass: 'App',
//                method: 'setContentLoaded',
//                args: [true]
//            });
//        }, 5000);
});