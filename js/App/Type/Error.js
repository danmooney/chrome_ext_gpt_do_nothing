function AppTypeError (str) {
    this.message = str;
    Error.call(this, this.message);
}

AppTypeError.prototype = new AppError();
AppTypeError.prototype.constructor = AppTypeError;
AppTypeError.prototype.name = 'AppTypeError';