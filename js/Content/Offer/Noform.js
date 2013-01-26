(function() {
   'use strict';
    /**
     * TODO - Keep track of the number of elements at any given time, and constantly check if they have changed.  If they have, then clearTimeout and continue going.
     *        A lot of the forms nowadays seem to be some stupid JS quiz-based thing where the page never refreshes and the anchors usually only have the hash tag in them
     */
    $$.klass(function OfferNoform () {
        var clickAroundWindowLimit = 2,
            clickAroundTimeLimit = 7000;

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
    }, {
        _static: true,

        /**
         * There are absolutely ZERO form elements or inputs... just click around...?
         * TODO - Sort buttons and anchor tags by square pixelage just like what is done with forms
         *        before beginning the clicking process!  Or sort by href length (???), since the ones to click on usually have the longest query strings and such....
         * TODO - Chrome will open URLs without hostnames (relative paths) in the extension window!  Make the url an absolute path!
         * TODO - iframe here!
         */
        clickAround: function () {
            alert('CLICKING AROUND');
            var hrefsClickedArr = [],
                windowNum = 0,
                windowLimitNum = this.getClickAroundWindowLimit(),
                clickAroundTimeLimit = this.getClickAroundTimeLimit(),
                currentHostAnchorEls = $('a').filter(function (i, el) {
                    return $$('Url').hrefPointsToCurrentHost($(el).attr('href'));
                }),
                differentHostAnchorEls = $('a').filter(function (i, el) {
                    return !$$('Url').hrefPointsToCurrentHost($(el).attr('href'));
                });

            // after a while, if no windows have been popped up, just give up and go to next offer!
            setTimeout(function () {
                if (0 === windowNum) {
                    $$('Offer').skipOffer(/*true*/);
                }
            }, clickAroundTimeLimit);

            $$('Storage').getItem('currentGptWindowId', function (gptWindowId) {
                // if offer says 'click', then filter below, otherwise, there might be a useful page that belongs to the same host to click?????
                differentHostAnchorEls.each(function () {
                    var el = $(this),
                        hrefStr = el.attr('href'),
                        hasHrefBool = ($$.util.isString(hrefStr) && hrefStr.indexOf('mailto:') === -1),
                        hasOnClickBool = $$.util.isString(el.attr('onclick'));

                    if (true === hasOnClickBool) {
                        el.trigger('click');
                    }

                    if (true === hasHrefBool &&
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

                $('button').trigger('click');
            });
        }

    });
}());