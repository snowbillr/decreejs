/* global describe, it */

describe('Give it some context', function() {
    describe('maybe a bit more context here', function() {
        it('should run here few assertions', function() {
            when('a').decree(function() {
                console.log('a was pressed');
            });

            sendEvent('keydown', 65);
            sendEvent('keyup', 65);
        });
    });
});
