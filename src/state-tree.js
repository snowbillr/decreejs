function StateTree() {
    this._rootNode = new StateTreeNode();
}

StateTree.prototype.getStateTreeNodeAtIndexPath = function(indexPath) {
    if (indexPath.length === 0) {
        return this._rootNode;
    } else {
        var state = this._rootNode.getChildren()[indexPath[0]];
        for (var i = 1; i < indexPath.length; i++) {
            state = state.getChildren()[indexPath[i]];
        }

        return state;
    }
};

StateTree.prototype.getStateTreeNodeAtIdPath = function(idPath) {

}

StateTree.prototype.pruneBranch = function(stateIdPath) {

};