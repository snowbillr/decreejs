ddescribe('A State on the decree tree', function() {
    it('is given a random id when created', function() {
        var state = new State(65, []);
        expect(state.getId()).toBeDefined();
    });

    describe('matching key sequences', function() {

        describe('with no modifier keys', function() {
            var state;

            beforeEach(function() {
                state = new State(70, []);
            });

            it('does match a key sequence of just its main key', function() {
                expect(state.doesMatchKeySequence([70])).toBe(true);
            });

            it('does not match a key sequence of not its key', function() {
                expect(state.doesMatchKeySequence([65])).toBe(false);
            });

            it('does not match a key sequence of more than one key with its key at the beginning of it', function() {
                expect(state.doesMatchKeySequence([70, 71, 72])).toBe(false);
            });

            it('does not match a key sequence of more than one key with its key in the middle of it', function() {
                expect(state.doesMatchKeySequence([69, 70, 71])).toBe(false);
            });

            it('does not match a key sequence of more than one key with its key at the end of it', function() {
                expect(state.doesMatchKeySequence([68, 69, 70])).toBe(false);
            });
        });

        describe('with 1 modifier key', function() {
            var state;

            beforeEach(function() {
                state = new State(70, [65]);
            });

            it('does match a key sequence of the modifier key then the main key', function() {
                expect(state.doesMatchKeySequence([65, 70])).toBe(true);
            });

            it('does not match a key sequence of no modifier key then the main key', function() {
                expect(state.doesMatchKeySequence([70])).toBe(false);
            });

            it('does not match a key sequence of the wrong modifier key then the main key', function() {
                expect(state.doesMatchKeySequence([66, 70])).toBe(false);
            });

            it('does not match a key sequence of two modifier keys (the first one being correct) then the main key', function() {
                expect(state.doesMatchKeySequence([65, 66, 70])).toBe(false);
            });

            it('does not match a key sequence of two modifier keys (the second one being correct) then the main key', function() {
                expect(state.doesMatchKeySequence([65, 66, 70])).toBe(false);
            });

            it('does not match a key sequence of the right modifier key and the wrong main key', function() {
                expect(state.doesMatchKeySequence([65, 66])).toBe(false);
            });
        });

        describe('with more than 1 modifier key', function() {
            var state;

            beforeEach(function() {
                state = new State(70, [65, 66]);
            });

            it('does match a key sequence of the two modifier keys then the main key', function() {
                expect(state.doesMatchKeySequence([65, 66, 70])).toBe(true);
            });

            it('does match a key sequence of the two modifier keys in a different order then the main key', function() {
                expect(state.doesMatchKeySequence([66, 65, 70])).toBe(true);
            });

            it('does not match a key sequence with one modifier but not both and the main key', function() {
                expect(state.doesMatchKeySequence([65, 70])).toBe(false);
            });

            it('does not match a key sequence with both modifiers and the wrong main key', function() {
                expect(state.doesMatchKeySequence([65, 66, 67])).toBe(false);
            });
        });

    });

    describe('its callback', function() {
        var state;

        beforeEach(function() {
            state = new State(65, []);
        });

        it('has none upon creation', function() {
            expect(state.hasCallback()).toBe(false);
        });

        it('can set its callback', function() {
            state.setCallback(function() {
            });

            expect(state.hasCallback()).toBe(true);
        });

        it('can remove its callback', function() {
            state.setCallback(function() {
            });
            state.removeCallback();

            expect(state.hasCallback()).toBe(false);
        });

        it('can execute its callback', function() {
            var wasCallbackCalled = false;

            state.setCallback(function() {
                wasCallbackCalled = true;
            });

            state.executeCallback();

            expect(wasCallbackCalled).toBe(true);
        })
    });
});