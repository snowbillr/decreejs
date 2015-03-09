describe('A StateTreeNode', function() {

    describe('manipulating its children', function() {
        it('can be initialized with a state', function() {
            var state = new State(65, []);
            var stn = new StateTreeNode(state);

            expect(stn.getState()).toBe(state);
        });

        it('can add a child state tree node with a given state', function() {
            var parentSTN = new StateTreeNode();
            var state = new State(65, []);

            parentSTN.addChild(state);

            expect(parentSTN.getChildren().length).toBe(1);
            expect(parentSTN.getChildren()[0].getState()).toBe(state);
        });

        it('can remove a child at a specific index', function() {
            var parentSTN = new StateTreeNode();
            var state = new State(65, []);

            parentSTN.addChild(state);
            parentSTN.removeChildAtIndex(0);

            expect(parentSTN.getChildren().length).toBe(0);
        });
    });

    describe('finding children by a matching key sequence', function() {
        var stn;

        beforeEach(function() {
            stn = new StateTreeNode();

            var state1 = new State(65, []);
            stn.addChild(state1);

            var state2 = new State(66, [67]);
            stn.addChild(state2);
        });

        it('knows when it has a matching child', function() {
            expect(stn.hasChildMatchingKeySequence([65])).toBe(true);
        });

        it('knows when it does not have a matching child', function() {
            expect(stn.hasChildMatchingKeySequence([70])).toBe(false);
        });

        it('can get the matching child\'s index', function() {
            expect(stn.getChildIndexMatchingKeySequence([67, 66])).toBe(1);
        });

        it('gets -1 when asking for a child\'s index that doesn\'t exist', function() {
            expect(stn.getChildIndexMatchingKeySequence([70])).toBe(-1);
        });
    });

    describe('finding children by matching state keys', function() {
        var stn, state1, state2;

        beforeEach(function() {
            stn = new StateTreeNode();

            state1 = new State(65, []);
            stn.addChild(state1);

            state2 = new State(66, [67]);
            stn.addChild(state2);
        });

        it('knows when it has a matching child', function() {
            expect(stn.hasChildMatchingStateKeys(65, [])).toBe(true);
        });

        it('knows when it does not have a matching child', function() {
            expect(stn.hasChildMatchingStateKeys(80, [])).toBe(false);
        });

        it('can get the matching child\'s index', function() {
            expect(stn.getChildIndexMatchingStateKeys(66, [67])).toBe(1);
        });

        it('gets -1 when asking for a child\'s index that does not exist', function() {
            expect(stn.getChildIndexMatchingStateKeys(80, [])).toBe(-1);
        });

        it('can get the matching child state tree node', function() {
            expect(stn.getChildMatchingStateKeys(65, []).getState()).toBe(state1);
        });

        it('gets undefined when asking for a child state tree node that does not exist', function() {
            expect(stn.getChildMatchingStateKeys(80, [])).toBeUndefined();
        });
    });

    describe('finding children by matching state ids', function() {
        var stn, state1, state2, stateId1, stateId2;

        beforeEach(function() {
            stn = new StateTreeNode();

            state1 = new State(65, []);
            stateId1 = state1.getId();
            stn.addChild(state1);

            state2 = new State(66, [67]);
            stateId2 = state2.getId();
            stn.addChild(state2);
        });


        it('can get the matching child\'s index', function() {
            expect(stn.getChildIndexMatchingStateId(stateId2)).toBe(1);
        });

        it('gets -1 when asking for a child\'s index that does not exist', function() {
            expect(stn.getChildIndexMatchingStateId(849303)).toBe(-1);
        });

        it('can get the matching child state tree node', function() {
            expect(stn.getChildMatchingStateId(stateId1).getState()).toBe(state1);
        });

        it('gets undefined when asking for a child state tree node that does not exist', function() {
            expect(stn.getChildMatchingStateId(929832)).toBeUndefined();
        });
    });
});