/* global describe, it */

describe('Decree JS', function() {
    describe('executing sequential key presses', function() {
        it('of length: 1', function() {
            var wasCallbackCalled = false;

            decree.when('a').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);

            expect(wasCallbackCalled).toBe(true);
        });

        it('of length: 2', function() {
            var wasCallbackCalled = false;

            decree.when('b').then('c').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 66);
            sendEvent('keyup', 66);
            sendEvent('keydown', 67);
            sendEvent('keyup', 67);

            expect(wasCallbackCalled).toBe(true);
        });

        it('of length: 3', function() {
            var wasCallbackCalled = false;

            decree.when('c').then('d').then('e').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 67);
            sendEvent('keyup', 67);
            sendEvent('keydown', 68);
            sendEvent('keyup', 68);
            sendEvent('keydown', 69);
            sendEvent('keyup', 69);

            expect(wasCallbackCalled).toBe(true);
        });
    });

    describe('executing a key press with a modifier', function() {
        it('works when the modifier key is pressed before the main key', function() {
            var wasCallbackCalled = false;

            decree.when('b').withModifier('a').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 65);
            sendEvent('keydown', 66);
            sendEvent('keyup', 65);
            sendEvent('keyup', 66); //this will cause issues for the next test. need to wait 500 ms

            expect(wasCallbackCalled).toBe(true);
        });
    });
});
