function AppTabError (str) {
    this.message = str;
    Error.call(this, this.message);
}

AppTabError.prototype = AppError.prototype;
AppTabError.prototype.constructor = AppTabError;
AppTabError.prototype.name = 'AppTabError';