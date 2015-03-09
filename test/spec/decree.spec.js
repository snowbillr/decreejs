/* global describe, it */

describe('Decree JS', function() {
    beforeEach(function(done) {
        decree.config({
            timeThreshold: 50
        });

        setTimeout(function() {
            done();
        }, 75);
    });

    describe('deregistration', function() {

        it('deregisters all registered key sequences', function() {
            var wasFirstCallbackCalled = false;
            var wasSecondCallbackCalled = false;

            decree.when('a').perform(function() {
                wasFirstCallbackCalled = true;
            });

            decree.when('b').perform(function() {
                wasSecondCallbackCalled = true;
            });

            decree.deregisterAll();

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);

            sendEvent('keydown', 66);
            sendEvent('keyup', 66);

            expect(wasFirstCallbackCalled).toBe(false);
            expect(wasSecondCallbackCalled).toBe(false);
        });
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

    describe('deregistering a callback', function() {
        beforeEach(function() {
            decree.deregisterAll();
        });

        it('won\'t call the callback for a deregistered key sequence', function() {
            var wasCallbackCalled = false;

            var deregistrationFn = decree.when('a').then('b').perform(function() {
                wasCallbackCalled = true;
            });

            deregistrationFn();

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keydown', 66);
            sendEvent('keyup', 66);

            expect(wasCallbackCalled).toBe(false);
        });

        it('will call a callback down the state tree that was previously blocked', function() {
            var wasCallbackCalled = false;

            var deregistrationFn = decree.when('a').then('b').perform(function() {
                //do nothing
            });

            decree.when('a').then('b').then('c').perform(function() {
                wasCallbackCalled = true;
            });

            deregistrationFn();

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keydown', 66);
            sendEvent('keyup', 66);
            sendEvent('keydown', 67);
            sendEvent('keyup', 67);
        });

        it('won\'t prune the parent if a sibling is removed', function() {
            var wasCallbackCalled = false;

            var deregistrationFn = decree.when('a').then('b').then('c').perform(function() {
                //do nothing
            });

            decree.when('a').then('b').then('d').perform(function() {
                wasCallbackCalled = true;
            });

            deregistrationFn();

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keydown', 66);
            sendEvent('keyup', 66);
            sendEvent('keydown', 68);
            sendEvent('keyup', 68);

            expect(wasCallbackCalled).toBe(true);
        });

        it('can remove deregister multiple callbacks', function(done) {
            var wasCallbackCalled1 = false;
            var wasCallbackCalled2 = false;

            var deregistrationFn1 = decree.when('a').then('b').then('c').perform(function() {
                wasCallbackCalled1 = true;
            });

            var deregistrationFn2 = decree.when('a').then('b').then('d').perform(function() {
                wasCallbackCalled2 = true;
            });

            deregistrationFn1();
            deregistrationFn2();

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keydown', 66);
            sendEvent('keyup', 66);
            sendEvent('keydown', 68);
            sendEvent('keyup', 68);

            setTimeout(function() {
                sendEvent('keydown', 65);
                sendEvent('keyup', 65);
                sendEvent('keydown', 66);
                sendEvent('keyup', 66);
                sendEvent('keydown', 67);
                sendEvent('keyup', 67);

                expect(wasCallbackCalled1).toBe(false);
                expect(wasCallbackCalled2).toBe(false);

                done();
            }, 75);

        });
    });

    describe('on a key being held down (multiple keydown events)', function() {
        beforeEach(function() {
            decree.deregisterAll();
        });

        it('ignores that the key was held down and counts it as just one key press', function() {
            var wasCallbackCalled = false;

            decree.when('a').then('b').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 65);
            sendEvent('keydown', 65);
            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keydown', 66);
            sendEvent('keyup', 66);
        });
    });

    describe('can be configured', function() {
        it('with a custom time threshold', function(done) {
            var wasCallbackCalled = false;

            decree.config({
                timeThreshold: 50
            });

            decree.when('a').then('b').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);

            setTimeout(function() {
                sendEvent('keydown', 66);
                sendEvent('keyup', 66);

                expect(wasCallbackCalled).toBe(false);

                done();
            }, 100);
        });

        it('isn\'t affected by a bad option', function() {
            var wasCallbackCalled = false;

            decree.config({
                badOption: 'booyah'
            });

            decree.when('a').then('b').perform(function() {
                wasCallbackCalled = true;
            });

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
            sendEvent('keydown', 66);
            sendEvent('keyup', 66);

            expect(wasCallbackCalled).toBe(true);
        });
    });
});
