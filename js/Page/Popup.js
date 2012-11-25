/**
 * Popup Page
 */
(function() {
    'use strict';
    $$.klass(function PagePopup () {
        /**
         * Set logo based on current icon image
         */
        this.setLogo = function () {
            var bg = this.getBgPage(),
                iconObj = bg.$$.instance('Icon').getIconData();

            $('#logo, #status-text').attr('class', iconObj.iconClass);
        };

        /**
         * Set popup status text
         */
        this.setStatusText = function () {
            var bg = this.getBgPage(),
                App = bg.$$.instance('App'),
                Message = $$.instance('Message'),
                Storage = $$.instance('Storage'),
                status = App.getStatus();

            $('#status-text').attr('data-118n', 'popupStatus' + App.getStatus());

            // add GPT klass to popup window
            if (App.isReady() || App.isWorking()) {
                Storage.getItem('currentGptKlass', function (currentGptKlassStr) {
                    $('#status-gpt-text').text(currentGptKlassStr.replace('Gpt', ''));
                });
            } else {
                $('#status-gpt-text').text('');
            }
        };

        /**
         * Set visibility, start/stop text
         */
        this.setStartStop = function () {
            var bg = this.getBgPage(),
                App = bg.$$.instance('App');

            function setEvent () {
                $('#start-stop').click(function () {
                    var q;
                    if (App.isReady()) {
                        q = confirm('Make sure that you are logged in to this GPT site before you proceed.  Also make sure you allowed GPT Do Nothing to be opened in incognito mode.');
                        if (q === true) {
                            App.setStatus('Working');
                        }
                    } else {
                        q = confirm('Are you sure you would like to stop GPT Do Nothing?');
                        if (q === true) {
                            App.stopWorking();
                        }
                    }
                });
            }

            function setText () {
                $('#start-stop').attr('data-i18n', 'popup' + App.getStatus() + 'Button');
            }

            setText();
            setEvent();
        };

    }, {
        _static: true,
        init: function () { // sort of an onload measure, since this is triggered everytime popup.html is loaded
            this.setLogo();
            this.setStatusText();
            this.setStartStop();
        }
    }).inheritFrom('Page');
}());