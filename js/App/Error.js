function AppError (str) {
    this.message = str;
    Error.call(this, this.message);
}

AppError.prototype = new Error();
AppError.prototype.constructor = AppError;
AppError.prototype.name = 'AppError';