function State(key, modifierKeys) {
    this._key = key;
    this._modifierKeys = modifierKeys;
    this._callback = null;
    this._id = Math.floor(Math.random() * 1000000);
}

State.prototype.doesMatchKeySequence = function(keySequence) {
    //take the key sequence and slice off the first this._modifierKeys.length values and check them against the modifier keys
    //check the rest of the key sequence (should be length 1) against this._key

    //if the key sequence is not the number of modifier keys plus the key, it doesn't match
    if (keySequence.length !== this._modifierKeys.length + 1) {
        return false;
    }

    var sequenceKey = keySequence[this._modifierKeys.length];
    var sequenceModifierKeys = keySequence.slice(0, this._modifierKeys.length);

    return this.doesMatchStateKeys(sequenceKey, sequenceModifierKeys);
};

State.prototype.doesMatchStateKeys = function(key, modifierKeys) {
    var doesKeyMatch = this._key === key;
    var doModifierKeysMatch = this._modifierKeys.every(function(value, index) {
        return modifierKeys.indexOf(value) !== -1;
    }) && this._modifierKeys.length === modifierKeys.length;

    return doesKeyMatch && doModifierKeysMatch;
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
};

State.prototype.getId = function() {
    return this._id;
};