function StateTreeNode(state) {
    this._children = [];
    this._state = state;
}

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

StateTreeNode.prototype.getChildMatchingKeySequence = function(keySequence) {
    return this._children[this.getChildIndexMatchingKeySequence(keySequence)];
};

StateTreeNode.prototype.addChild = function(state) {
    this._children.push(new StateTreeNode(state));
};

StateTreeNode.prototype.getChildren = function() {
    return this._children;
};

StateTreeNode.prototype.getState = function() {
    return this._state;
};