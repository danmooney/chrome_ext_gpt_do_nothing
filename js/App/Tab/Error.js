function AppTabError (str) {
    this.message = str;
    Error.call(this, this.message);
}

AppTabError.prototype = new AppError();
AppTabError.prototype.constructor = AppTabError;
AppTabError.prototype.name = 'AppTabError';