(function(window) {
    var keyCodeMap = {
        space: 32,
        enter: 13,
        return: 13,
        tab: 9,
        esc: 27,
        escape: 27,
        backspace: 8,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 78,
        o: 79,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90
    };

    var timeThreshold = 500; //milliseconds
    var timeOfLastPress;

    var keyChain = [];
    var cancelEndKeyChain;

    var decrees = [];

    window.addEventListener('keydown', function(event) {
        var currentTime = (new Date()).getTime();

        if (currentTime - timeOfLastPress < timeThreshold) {
            clearTimeout(cancelEndKeyChain);
        }

        keyChain.push(event.keyCode);
        getKeyChainCallbacks().forEach(function(keyChainCallback) {
            keyChainCallback();
        });

        cancelEndKeyChain = setTimeout(function endKeyChain() {
            keyChain = [];
        }, timeThreshold);

        timeOfLastPress = currentTime;
    });

    function getKeyChainCallbacks() {
        return decrees.filter(function(decree) {
            return decree.chain.length === keyChain.length &&
                decree.chain.every(function(entryKeyChainKey, i) {
                    return entryKeyChainKey == keyChain[i];
                });
        }).map(function(keyChainEntry) {
            return keyChainEntry.callback;
        });
    }

    var decree = {
        chain: []
    };
    window.decree = function(key) {
        decree.chain.push(keyCodeMap[key]);

        function then(key) {
            decree.chain.push(keyCodeMap[key]);

            return {
                then: then,
                perform: perform
            };
        }

        function perform(callback) {
            decree.callback = callback;
            decrees.push(decree);
            decree = {
                chain: []
            };
        }

        return {
            then: then,
            perform: perform
        };
    };
})(window);

//=====================================\\

decree('a').perform(function() {
    console.log('"a" was pressed');
});

decree('a').perform(function() {
    console.log('pressed was "a"');
});

decree('a').then('s').then('d').then('f').perform(function() {
    console.log('"asdf" was pressed');
});

decree('up').then('up').then('down').then('down').then('left').then('right').then('left').then('right').then('b').then('a').then('enter').perform(function() {
    alert('konami code!');
});