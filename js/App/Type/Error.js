function AppTypeError (str) {
    this.message = str;
    Error.call(this, this.message);
}

AppTypeError.prototype = AppError.prototype;
AppTypeError.prototype.constructor = AppTypeError;
AppTypeError.prototype.name = 'AppTypeError';