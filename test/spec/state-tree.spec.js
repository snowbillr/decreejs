describe('A StateTree', function() {

    var tree, root, state1, state2, state3, state1Id, state2Id, state3Id;

    beforeEach(function() {
        tree = new StateTree();

        state1 = new State(65, []);
        state1Id = state1.getId();

        state2 = new State(66, []);
        state2Id = state2.getId();

        state3 = new State(67, []);
        state3Id = state3.getId();

        root = tree.getStateTreeNodeAtIndexPath([]);

        root.addChild(state1);
        root.getChildren()[0].addChild(state2);
        root.addChild(state3);
    });

    it('can get a state tree node at an index path', function() {
        expect(tree.getStateTreeNodeAtIndexPath([0, 0]).getState()).toBe(state2);
    });

    it('gets the root node for an empty index path', function() {
        expect(tree.getStateTreeNodeAtIndexPath([])).toBe(root);
    });

    it('can get a state tree node at a state id path', function() {
        expect(tree.getStateTreeNodeAtStateIdPath([state3Id]).getState()).toBe(state3);
    });

    it('gets the root node for an empty state id path', function() {
        expect(tree.getStateTreeNodeAtStateIdPath([])).toBe(root);
    });

    it('can remove a node at a state id path', function() {
        tree.removeNodeAtStateIdPath([state1Id, state2Id]);

        expect(tree.getStateTreeNodeAtStateIdPath([state1Id]).getChildren().length).toBe(0);
    });

    it('can clear all registrations', function() {
        tree.clear();

        expect(tree.getStateTreeNodeAtIndexPath([]).getChildren().length).toBe(0);
    });

    describe('pruning a branch', function() {
        it('will remove a node if it has no children and no callback', function() {
            tree.pruneBranch([state3Id]);

            expect(tree.getStateTreeNodeAtStateIdPath(state3Id)).toBeUndefined();
        });

        it('will not remove a node if it has a callback', function() {
            state2.setCallback(function(){});

            tree.pruneBranch([state1Id, state2Id]);

            expect(tree.getStateTreeNodeAtStateIdPath([state1Id]).getChildren().length).toBe(1);
        });

        it('will not remove a node if it has children', function() {
            tree.pruneBranch([state1Id]);

            expect(tree.getStateTreeNodeAtStateIdPath([state1Id])).toBeDefined();
        });

        it('will remove a dead branch', function() {
            tree.pruneBranch([state1Id, state2Id]);

            expect(tree.getStateTreeNodeAtIndexPath([]).getChildren()[0].getState().getId()).toBe(state3Id);
        });

        it('will remove the dead end of a branch', function() {
            state1.setCallback(function() {});

            tree.pruneBranch([state1Id, state2Id]);

            expect(tree.getStateTreeNodeAtStateIdPath([state1Id]).getChildren().length).toBe(0);

        });
    });
});