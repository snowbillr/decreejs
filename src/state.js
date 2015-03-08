function State(keyCodes) {
    this._keyCodes = keyCodes;
    this._callback = null;
    this._id = Math.floor(Math.random() * 1000000);
}

State.prototype.doesMatchKeySequence = function(keySequence) {
    return this._keyCodes.every(function(keyCode, index) {
        return keySequence.indexOf(keyCode) === index;
    });
};

State.prototype.setCallback = function(callback) {
    this._callback = callback;
};

State.prototype.executeCallback = function() {
    this._callback.call(null);
};

State.prototype.hasCallback = function() {
    return this._callback !== null
};

State.prototype.removeCallback = function() {
    this._callback = null;
}