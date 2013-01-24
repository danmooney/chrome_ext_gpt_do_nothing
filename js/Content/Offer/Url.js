// parse Urls in offers using parseUri library
(function() {
    'use strict';
    $$.klass(function Url () {

    }, {
        _static: true,

        /**
         * Get the domain of the url, and remove the subdomains (including 'www')
         * @param {String} urlStr
         */
        getDomainOfUrl: function (urlStr) {
            var parsedUriObj = parseUri(urlStr),
                hostSplitArr = parsedUriObj.host.split('.'),
                hostSplitLength = hostSplitArr.length,
                domainStr,
                tldStr;

            if ('' === parsedUriObj.host ||
                hostSplitArr.length === 1
            ) {
                return parsedUriObj.host;
            }

            domainStr = hostSplitArr[hostSplitLength - 2];
            tldStr    = hostSplitArr[hostSplitLength - 1];

            return domainStr + '.' + tldStr;
        },

        /**
         * Filter function to check to see whether the href points to the current host.
         *
         * ex. /index => true
         * and assuming currenthost.com is the host,
         * currenthost.com/index => true
         * as well.
         *
         * @param {String} href
         * @return {Boolean}
         */
        hrefPointsToCurrentHost: function (href) {
            var parsedUriObj = parseUri(href),
                elDomainStr,
                winDomainStr;

            if ('' === parsedUriObj.host) {
                return false;
            }

            winDomainStr = this.getDomainOfUrl(window.location.href);
            elDomainStr  = this.getDomainOfUrl(href);

            if (elDomainStr === winDomainStr) {
                return false;
            }

            return true;
        }
    });
}());