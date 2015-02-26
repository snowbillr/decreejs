/* global describe, it */

describe('Decree JS', function() {
    beforeEach(function(done) {
        setTimeout(function() {
            done();
        }, 600);
    });

    describe('listening for sequential key presses', function() {
        it('of length 1', function() {
            var wasCallbackCalled = false;

            decree.when('a').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);

            expect(wasCallbackCalled).toBe(true);
        });

        it('of length 2', function() {
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

        it('of length 3', function() {
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

    describe('listening for a key sequence of length 1 with a modifier', function() {
        it('executes when the modifier key is pressed before the main key', function() {
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

        it('does not execute when the modifier key is released before the main key', function() {
            var wasCallbackCalled = false;

            decree.when('b').withModifier('a').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 66);
            sendEvent('keydown', 65);
            sendEvent('keyup', 66);
            sendEvent('keyup', 65);

            expect(wasCallbackCalled).toBe(false);
        });
    });

    describe('listening for a key sequence of length one with two modifiers', function() {
        var wasCallbackCalled;

        beforeEach(function() {
            wasCallbackCalled = false;
            decree.when('a').withModifier('b').withModifier('c').perform(function() {
                wasCallbackCalled = true;
            });
        });

        it('executes when the modifier keys are pressed and held before the main key', function() {
            sendEvent('keydown', 66);
            sendEvent('keydown', 67);
            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keyup', 66);
            sendEvent('keyup', 67);

            expect(wasCallbackCalled).toBe(true);
        });

        it('executes when the modifier keys are pressed in any order and held before the main key', function() {
            sendEvent('keydown', 67);
            sendEvent('keydown', 66);
            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keyup', 66);
            sendEvent('keyup', 67);

            expect(wasCallbackCalled).toBe(true);
        });

        it('does not execute when both modifier keys are not pressed before the main key', function() {
            sendEvent('keydown', 65);
            sendEvent('keydown', 67);
            sendEvent('keydown', 66);
            sendEvent('keyup', 65);
            sendEvent('keyup', 66);
            sendEvent('keyup', 67);

            expect(wasCallbackCalled).toBe(false);
        });
    });

    describe('listening for a two key sequence, each with one modifier', function() {
        var wasCallbackCalled;

        beforeEach(function() {
            wasCallbackCalled = false;

            decree.when('a').withModifier('b').then('c').withModifier('d').perform(function() {
                wasCallbackCalled = true;
            });
        });

        it('executes when the key sequence is executed correctly', function() {
            sendEvent('keydown', 66);
            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keyup', 66);
            sendEvent('keydown', 68);
            sendEvent('keydown', 67);
            sendEvent('keyup', 67);
            sendEvent('keyup', 68);

            expect(wasCallbackCalled).toBe(true);
        });
    });
});
