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

    var matchingDecreeIndexPath = [];

    var currentInputKeys = [];

    var decreeTree = [];

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    function onKeyDown(keyEvent) {
        currentInputKeys.push(keyEvent.keyCode);

        allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold();
        cancelEndCurrentDecree = setTimeout(listenForNextDecree, timeThreshold);
    }

    function allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold() {
        var currentTime = (new Date()).getTime();
        if (currentTime - timeOfLastPress < timeThreshold) {
            clearTimeout(cancelEndCurrentDecree);
        }
        timeOfLastPress = currentTime;
    }

    function listenForNextDecree() {
        matchingDecreeIndexPath = [];
    }

    function onKeyUp() {
        var stateList = getPotentiallyMatchingStates();
        var matchingState = stateList.filter(doesStateMatchCurrentKeyboardState)[0];

        if (matchingState !== undefined) {
            matchingDecreeIndexPath.push(getMatchingStateIndex(stateList, doesStateMatchCurrentKeyboardState));

            if (matchingState.hasOwnProperty('callback')) {
                executeDecreeCallback();
                listenForNextDecree();
            }
        }

        currentInputKeys = [];
    }

    function getPotentiallyMatchingStates() {
        if (matchingDecreeIndexPath.length > 0) {
            return getLastMatchingState().children;
        } else {
            return decreeTree;
        }
    }

    function doesStateMatchCurrentKeyboardState(state) {
        return state.keyCodes.every(function(keyCode, index) {
            return currentInputKeys.indexOf(keyCode) === index;
        });
    }

    function getMatchingStateIndex(stateList, matchingFn) {
        for (var i = 0; i < stateList.length; i++) {
            if (matchingFn(stateList[i])) {
                return i;
            }
        }

        return null;
    }

    function executeDecreeCallback() {
        var stateToExecute = getLastMatchingState();

        if (stateToExecute.hasOwnProperty('callback')) {
            stateToExecute.callback.call(null);
        }
    }

    function getLastMatchingState() {
        return getStateAtIndexPath(matchingDecreeIndexPath);
    }

    function getStateAtIndexPath(indexPath) {
        var state = decreeTree[indexPath[0]];
        for (var i = 1; i < indexPath.length; i++) {
            state = state.children[indexPath[i]];
        }
        return state;
    }

    function hasMatchingState(stateList, matchingFn) {
        return getMatchingStateIndex(stateList, matchingFn) !== null;
    }

    window.when = function(key) {
        var newDecreeStateKeyCodes = [];
        var newDecreeIndexPath = [];

        var keyCode = keyCodeMap[key];
        newDecreeStateKeyCodes.push(keyCode);

        if (hasMatchingState(decreeTree, doesStateMatchNewDecree)) {
            newDecreeIndexPath.push(getMatchingStateIndex(decreeTree, doesStateMatchNewDecree));
        } else {
            decreeTree.push({
                keyCodes: [keyCode],
                children: []
            });
            newDecreeIndexPath.push(decreeTree.length - 1);
        }

        function then(key) {
            //reset state key codes
            newDecreeStateKeyCodes = [];

            //add key code to current state
            var keyCode = keyCodeMap[key];
            newDecreeStateKeyCodes.push(keyCode);

            var parentState = getStateAtIndexPath(newDecreeIndexPath);

            if (hasMatchingState(parentState.children, doesStateMatchNewDecree)) {
                newDecreeIndexPath.push(getMatchingStateIndex(parentState.children, doesStateMatchNewDecree));
            } else {
                parentState.children.push({
                    keyCodes: [keyCode],
                    children: []
                });
                newDecreeIndexPath.push(parentState.children.length - 1);
            }

            return {
                then: then,
                and: and,
                decree: decree
            };
        }

        function and(key) {
            var keyCode = keyCodeMap[key];
            newDecreeStateKeyCodes.splice(0, 0, keyCode);

            getStateAtIndexPath(newDecreeIndexPath).keyCodes.splice(0, 0, keyCode);

            return {
                then: then,
                and: and,
                decree: decree
            };
        }

        function decree(callback) {
            getStateAtIndexPath(newDecreeIndexPath).callback = callback;
        }

        function doesStateMatchNewDecree(state) {
            return state.keyCodes.every(function(keyCode) {
                return newDecreeStateKeyCodes.indexOf(keyCode) !== -1;
            });
        }

        return {
            then: then,
            and: and,
            decree: decree
        };
    };
})(window);
