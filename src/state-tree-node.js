function StateTreeNode(state) {
    this._children = [];
    this._state = state;
}

// key sequence matching

StateTreeNode.prototype.hasChildMatchingKeySequence = function(keySequence) {
    return this.getChildIndexMatchingKeySequence(keySequence) !== -1;
};

StateTreeNode.prototype.getChildIndexMatchingKeySequence = function(keySequence) {
    var matchingIndex = -1;

    this._children.forEach(function(child, index) {
        if (child.getState().doesMatchKeySequence(keySequence)) {
            matchingIndex = index;
        }
    });

    return matchingIndex;
};

// state key matching

StateTreeNode.prototype.hasChildMatchingStateKeys = function(key, modifierKeys) {
    return this.getChildIndexMatchingStateKeys(key, modifierKeys) !== -1;
};

StateTreeNode.prototype.getChildMatchingStateKeys = function(key, modifierKeys) {
    return this._children[this.getChildIndexMatchingStateKeys(key, modifierKeys)];
};

StateTreeNode.prototype.getChildIndexMatchingStateKeys = function(key, modifierKeys) {
    var matchingIndex = -1;

    this._children.forEach(function(child, index) {
        if (child.getState().doesMatchStateKeys(key, modifierKeys)) {
            matchingIndex = index;
        }
    });

    return matchingIndex;
};

// state id matching

StateTreeNode.prototype.getChildMatchingStateId = function(stateId) {
    return this._children[this.getChildIndexMatchingStateId(stateId)];
};

StateTreeNode.prototype.getChildIndexMatchingStateId = function(stateId) {
    var matchingIndex = -1;

    this._children.forEach(function(child, index) {
        if (child.getState().getId() == stateId) {
            matchingIndex = index;
        }
    });

    return matchingIndex;
};


// child methods

StateTreeNode.prototype.addChild = function(state) {
    this._children.push(new StateTreeNode(state));
};

StateTreeNode.prototype.getChildren = function() {
    return this._children;
};

StateTreeNode.prototype.removeChildAtIndex = function(index) {
    this._children.splice(index, 1);
};

// state accessor

StateTreeNode.prototype.getState = function() {
    return this._state;
};