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
    var cancelEndCurrentDecree;

    var matchingDecreeIndices = [];
    var isFirstKey = true;
    var isMatch = true;

    var decreeTree = [
        {
            keyCodes: [65],
            children: [
                {
                    keyCodes: [83],
                    callback: function() {
                        alert('as was pressed');
                    },
                    children: []
                }
            ]
        },
        {
            keyCodes: [81],
            children: [
                {
                    keyCodes: [87],
                    callback: function() {
                        alert('qw was pressed');
                    },
                    children: []
                }
            ]
        }

    ];
    var keyboardState = [];

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', markKeyAsNotPressed);

    function onKeyDown(event) {
        markKeyAsPressed(event.keyCode);

        var currentTime = (new Date()).getTime();
        if (currentTime - timeOfLastPress < timeThreshold) {
            clearTimeout(cancelEndCurrentDecree);
        }
        timeOfLastPress = currentTime;

        if (isFirstKey) {
            if (isMatchingTopLevelDecreePresent()) {
                pushTopLevelMatchingDecreeIndex();
            } else {
                isMatch = false;
            }

            isFirstKey = false;
        } else if (isMatch) {
            var lastMatchedState = getLastMatchedState();
            if (isMatchingChildStatePresent(lastMatchedState)) {
                pushMatchingChildStateDecreeIndex(lastMatchedState);
            } else {
                isMatch = false;
            }
        }

        cancelEndCurrentDecree = setTimeout(function endCurrentDecree() {
            if (isMatch) {
                executeDecreeCallback();
            }
            matchingDecreeIndices = [];
            isFirstKey = true;
            isMatch = true;
        }, timeThreshold);
    }

    function markKeyAsPressed(keyCode) {
        keyboardState[keyCode] = true;
    }

    function markKeyAsNotPressed(event) {
        keyboardState[event.keyCode] = false;
    }

    function isMatchingTopLevelDecreePresent() {
        var matchingIndex = -1;
        for (var i = 0; i < decreeTree.length; i++) {
            var decree = decreeTree[i];

            if (doesCurrentKeyboardStateMatchDecreeState(decree)) {
                matchingIndex = i;
                break;
            }
        }

        return matchingIndex !== -1;
    }

    function pushTopLevelMatchingDecreeIndex() {
        var matchingIndex = -1;
        for (var i = 0; i < decreeTree.length; i++) {
            var decree = decreeTree[i];

            if (doesCurrentKeyboardStateMatchDecreeState(decree)) {
                matchingIndex = i;
                break;
            }
        }

        matchingDecreeIndices.push(matchingIndex);
    }

    function getLastMatchedState() {
        var lastMatchingState = decreeTree[matchingDecreeIndices[0]];
        for (var i = 1; i < matchingDecreeIndices.length; i++) {
            lastMatchingState = lastMatchingState.children[matchingDecreeIndices[i]];
        }

        return lastMatchingState;
    }

    function isMatchingChildStatePresent(decreeState) {
        var didFindMatch = false;
        for (var i = 0; i < decreeState.children.length; i++) {
            if (doesCurrentKeyboardStateMatchDecreeState(decreeState.children[i])) {
                didFindMatch = true;
                break;
            }
        }

        return didFindMatch;
    }

    function pushMatchingChildStateDecreeIndex(decreeState) {
        for (var i = 0; i < decreeState.children.length; i++) {
            if (doesCurrentKeyboardStateMatchDecreeState(decreeState.children[i])) {
                matchingDecreeIndices.push(i);
                break;
            }
        }
    }

    function doesCurrentKeyboardStateMatchDecreeState(decree) {
        var isMatchingState = true;
        decree.keyCodes.forEach(function(keyCode) {
            if (!keyboardState[keyCode]) {
                isMatchingState = false;
            }
        });

        return isMatchingState;
    }

    function executeDecreeCallback() {
        var stateToExecute = decreeTree[matchingDecreeIndices[0]];
        for (var i = 1; i < matchingDecreeIndices.length; i++) {
            stateToExecute = stateToExecute.children[matchingDecreeIndices[i]];
        }

        if (stateToExecute.hasOwnProperty('callback')) {
            stateToExecute.callback.call(null);
        }
    }

    //this is what a state in the decree tree looks like
    //keyCodes - the keys that are down for this state
    //callback - only present if perform() was called at this state in the decree
    //children - always there, only populated if there are children states
    //isMatching - only there while a keystroke is being entered, true if the state is part of that keystroke, false otherwise
//    var newDecree = {
//        keyCodes: [],
//        callback: function () {},
//        children: [],
//        isMatching: true
//    };
    window.decree = function(key) {

        function then(key) {

            return {
                then: then,
                and: and,
                perform: perform
            };
        }

        function and(key) {

            return {
                then: then,
                and: and,
                perform: perform
            };
        }

        function perform(callback) {

        }

        return {
            then: then,
            and: and,
            perform: perform
        };
    };
})(window);