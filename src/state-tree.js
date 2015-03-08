function StateTree() {
    this._rootNode = new StateTreeNode();
}

StateTree.prototype.getStateTreeNodeAtIndexPath = function(indexPath) {
    if (indexPath.length === 0) {
        return this._rootNode;
    } else {
        var stateTreeNode = this._rootNode.getChildren()[indexPath[0]];
        for (var i = 1; i < indexPath.length; i++) {
            stateTreeNode = stateTreeNode.getChildren()[indexPath[i]];
        }

        return stateTreeNode;
    }
};

StateTree.prototype.getStateTreeNodeAtIdPath = function(idPath) {
    if (idPath.length === 0) {
        return this._rootNode;
    } else {
        var stateTreeNode = this._rootNode.getChildMatchingStateId(idPath[0]);
        for (var i = 1; i < idPath.length; i++) {
            stateTreeNode = stateTreeNode.getChildMatchingStateId(idPath[i]);
        }

        return stateTreeNode;
    }
};

StateTree.prototype.pruneBranch = function(stateIdPath) {
    //start at the last state in the stateIdPath
    //if it has no children AND no callback
    //remove it from the tree
    //continue to the next state (previous state in the stateIdPath)
    //else
    //stop the prune function

    for (var i = stateIdPath.length - 1; i >= 0; i--) {

        var stateTreeNode = this.getStateTreeNodeAtIdPath(stateIdPath.slice(0, i + 1));
        if (stateTreeNode.getChildren().length === 0 && !stateTreeNode.getState().hasCallback()) {
            //remove from tree
            this.removeNodeAtStateIdPath(stateIdPath.slice(0, i + 1));
        } else {
            return;
        }
    }
};

StateTree.prototype.removeNodeAtStateIdPath = function(stateIdPath) {
    var parentStateTreeNode = this.getStateTreeNodeAtIdPath(stateIdPath.slice(0, stateIdPath.length));
    var stateIdToRemove = stateIdPath[stateIdPath.length - 1];

    parentStateTreeNode.removeChildAtIndex(parentStateTreeNode.getChildIndexMatchingStateId(stateIdToRemove));
};

StateTree.prototype.clear = function() {
    this._rootNode = new StateTreeNode();
};