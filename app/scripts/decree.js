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
    var isMatchSoFar = true;

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

        if (isMatchSoFar) {
            var stateListToCheckForMatches = getPotentiallyMatchingStates();
            pushMatchingStateInListIfPresentOrElse(stateListToCheckForMatches, function() {
                isMatchSoFar = false;
            });

            var lastPushedState = getLastMatchedState();
            if (lastPushedState && lastPushedState.hasOwnProperty('callback')) {
                executeDecreeCallback();
                isMatchSoFar = false;
            }
        }

        cancelEndCurrentDecree = setTimeout(function endCurrentDecree() {
            matchingDecreeIndices = [];
            isMatchSoFar = true;
        }, timeThreshold);
    }

    function markKeyAsPressed(keyCode) {
        keyboardState[keyCode] = true;
    }

    function markKeyAsNotPressed(event) {
        keyboardState[event.keyCode] = false;
    }

    function getPotentiallyMatchingStates() {
        if (matchingDecreeIndices.length) {
            return getLastMatchedState().children;
        } else {
            return decreeTree;
        }
    }

    function getLastMatchedState() {
        var lastMatchingState = decreeTree[matchingDecreeIndices[0]];
        for (var i = 1; i < matchingDecreeIndices.length; i++) {
            lastMatchingState = lastMatchingState.children[matchingDecreeIndices[i]];
        }

        return lastMatchingState;
    }

    function pushMatchingStateInListIfPresentOrElse(stateList, elseFn) {
        for (var i = 0; i < stateList.length; i++) {
            if (doesCurrentKeyboardStateMatchDecreeState(stateList[i])) {
                matchingDecreeIndices.push(i);
                return;
            }
        }

        elseFn.call(this);
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
        var stateToExecute = getLastMatchedState();

        if (stateToExecute.hasOwnProperty('callback')) {
            stateToExecute.callback.call(null);
        }
    }

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