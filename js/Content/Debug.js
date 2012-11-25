(function() {
    'use strict';
    $$.klass(function Debug () {
        this.setTitleToTabId = function (tabId) {
            document.title = tabId;
        }
    });
}());