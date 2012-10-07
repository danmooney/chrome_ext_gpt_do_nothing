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
(function() {
    'use strict';
    $$.app.defaultInheritance.set('EvtBus');
    setInterval($$.app.namespace, 100);
}());