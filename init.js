//function GptError (str) {
//    this.message = str;
//    Error.call(this, this.message);
//}
//
//GptError.prototype = Error.prototype;
//GptError.prototype.constructor = GptError;
//GptError.prototype.name = 'GptError';
//
//
//throw new GptError('Fuck you!');


function checkUrl (info) {
    var browserAction;
    chrome.tabs.getSelected(null, function (tab) {
        if (Url.isStartingUrl(tab.url)) {
            browserAction = chrome.browserAction;
            browserAction.setIcon({
                path: 'img/icon_48.png',
                tabId: tab.id
            });
            browserAction.setTitle({
                title: 'This page is registered as a GPT starting point!',
                tabId: tab.id
            });

            Evt.register('click', 'pageAction');
        }
    });
}

function registerPageAction () {
    chrome.pageAction.onClicked.addListener(function (tab) {
        alert('let\'s make some fuckin\' money!');
    });
}

$(function () {
    chrome.tabs.onUpdated.addListener(checkUrl);
    chrome.tabs.onActivated.addListener(checkUrl);
});
