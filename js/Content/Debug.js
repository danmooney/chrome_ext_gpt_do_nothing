(function() {
    'use strict';
    $$.klass(function Debug () {
        this.setTitleToTabId = function (tabId) {
            if (document.title.indexOf(tabId.toString()) !== -1 ||
                /[0-9]{3}\s{1}/.test(document.title) === true
            ) {
                return;
            }
            document.title = tabId + ' - ' + document.title;
        }
    });
}());