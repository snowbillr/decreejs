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
    var isMatchSoFar = true;

    var keyboardState = [];

    var decreeTree = [];

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', markKeyAsNotPressed);

    function onKeyDown(event) {
        markKeyAsPressed(event.keyCode);

        allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold();

        if (isMatchSoFar) {
            var matchingStateIndex = getMatchingStateIndex();
            if (matchingStateIndex == null) {
                isMatchSoFar = false;
            } else {
                matchingDecreeIndexPath.push(matchingStateIndex);
            }


            var lastMatchingState = getLastMatchingState();
            if (lastMatchingState && lastMatchingState.hasOwnProperty('callback')) {
                executeDecreeCallback();
                listenForNextDecree();
            }
        }

        cancelEndCurrentDecree = setTimeout(listenForNextDecree, timeThreshold);
    }

    function markKeyAsPressed(keyCode) {
        keyboardState[keyCode] = true;
    }

    function markKeyAsNotPressed(event) {
        keyboardState[event.keyCode] = false;
    }

    function allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold() {
        var currentTime = (new Date()).getTime();
        if (currentTime - timeOfLastPress < timeThreshold) {
            clearTimeout(cancelEndCurrentDecree);
        }
        timeOfLastPress = currentTime;
    }

    function getPotentiallyMatchingStates() {
        if (matchingDecreeIndexPath.length > 0) {
            return getLastMatchingState().children;
        } else {
            return decreeTree;
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

    function getMatchingStateIndex() {
        var stateList = getPotentiallyMatchingStates();
        for (var i = 0; i < stateList.length; i++) {
            if (doesCurrentKeyboardStateMatchDecreeState(stateList[i])) {
                return i;
            }
        }

        return null;
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
        var stateToExecute = getLastMatchingState();

        if (stateToExecute.hasOwnProperty('callback')) {
            stateToExecute.callback.call(null);
        }
    }

    function listenForNextDecree() {
        matchingDecreeIndexPath = [];
        isMatchSoFar = true;
    }

    window.when = function(key) {
        var newDecreeStateKeyCodes = [];
        var newDecreeStateIndices = [];

        //add key to new decree keycodes
        var keyCode = keyCodeMap[key];
        newDecreeStateKeyCodes.push(keyCode);

        recordMatchingStateIndexIfPresentOrElse(decreeTree, function() {
            addNewStateToStateListAndRecordIndex(decreeTree);
        });

        function then(key) {
            //reset state key codes
            newDecreeStateKeyCodes = [];

            //add key code to current state
            var keyCode = keyCodeMap[key];
            newDecreeStateKeyCodes.push(keyCode);

            var parentState = getStateAtIndexPath(newDecreeStateIndices);

            recordMatchingStateIndexIfPresentOrElse(parentState.children, function() {
                addNewStateToStateListAndRecordIndex(parentState.children);
            });

            return {
                then: then,
                and: and,
                decree: decree
            };
        }

        function and(key) {
            var keyCode = keyCodeMap[key];
            newDecreeStateKeyCodes.push(keyCode);

            getStateAtIndexPath(newDecreeStateIndices).keyCodes.push(keyCode);

            return {
                then: then,
                and: and,
                decree: decree
            };
        }

        function decree(callback) {
            getStateAtIndexPath(newDecreeStateIndices).callback = callback;
        }

        function doesStateMatchNewDecree(state) {
            return state.keyCodes.every(function(keyCode) {
                return newDecreeStateKeyCodes.indexOf(keyCode) !== -1;
            });
        }

        function recordMatchingStateIndexIfPresentOrElse(stateList, elseFn) {
            var foundMatch = false;
            //check if the created state is equal to any existing top level states
            for (var i = 0; i < stateList.length; i++) {
                if (doesStateMatchNewDecree(stateList[i])) {
                    //if it is, record it
                    newDecreeStateIndices.push(i);
                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                elseFn.call(this);
            }
        }

        function addNewStateToStateListAndRecordIndex(stateList) {
            stateList.push({
                keyCodes: newDecreeStateKeyCodes,
                children: []
            });
            newDecreeStateIndices.push(stateList.length - 1);
        }

        return {
            then: then,
            and: and,
            decree: decree
        };
    };
})(window);
