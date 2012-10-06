/**
 * Page klass
 */
(function() {
    $$.klass(function Page () {

    }, {
        _static: true,
        getBgPage: function () {
            return $$.instance('PageBackground').getBgPage();
        }
    })
}());