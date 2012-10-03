function checkUrl (info) {
    chrome.tabs.getSelected(null, function (tab) {
        if (Url.isStartingUrl(tab.url)) {
            chrome.pageAction.show(tab.id);
            Evt.register('click', 'pageAction');
        }
    });
}

function registerPageAction () {
    if ()
    chrome.pageAction.onClicked.addListener(function (tab) {
        alert('let\'s make some fuckin\' money!');
    });
}

chrome.tabs.onUpdated.addListener(checkUrl);
chrome.tabs.onActivated.addListener(checkUrl);