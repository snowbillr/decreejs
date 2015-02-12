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

    function onKeyUp() {
        var stateList = getPotentiallyMatchingStates();

        if (hasMatchingState(stateList, currentInputKeys)) {
            matchingDecreeIndexPath.push(getMatchingStateIndex(stateList, currentInputKeys));

            if (getLastMatchingState().hasOwnProperty('callback')) {
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

    function hasMatchingState(stateList, keySequence) {
        return getMatchingStateIndex(stateList, keySequence) !== null;
    }

    function getMatchingStateIndex(stateList, keySequence) {
        for (var i = 0; i < stateList.length; i++) {
            if (doesStateMatchKeySequence(stateList[i], keySequence)) {
                return i;
            }
        }

        return null;
    }

    function doesStateMatchKeySequence(state, keySequence) {
        return state.keyCodes.every(function(keyCode, index) {
            return keySequence.indexOf(keyCode) === index;
        });
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

    function executeDecreeCallback() {
        var stateToExecute = getLastMatchingState();

        if (stateToExecute.hasOwnProperty('callback')) {
            stateToExecute.callback.call(null);
        }
    }

    function listenForNextDecree() {
        matchingDecreeIndexPath = [];
    }

    window.when = function(key) {
        var newDecreeStateKeySequence = [];
        var newDecreeIndexPath = [];

        newDecreeStateKeySequence.push(keyCodeMap[key]);

        function then(key) {
            addStateToTree();

            newDecreeStateKeySequence.push(keyCodeMap[key]);

            return {
                then: then,
                withModifier: withModifier,
                decree: decree
            };
        }

        function withModifier(key) {
            newDecreeStateKeySequence.splice(0, 0, keyCodeMap[key]);

            return {
                then: then,
                withModifier: withModifier,
                decree: decree
            };
        }

        function decree(callback) {
            addStateToTree();

            getStateAtIndexPath(newDecreeIndexPath).callback = callback;
        }

        function addStateToTree() {
            var stateList;
            if (newDecreeIndexPath.length === 0) {
                stateList = decreeTree;
            } else {
                stateList = getStateAtIndexPath(newDecreeIndexPath).children;
            }

            if (hasMatchingState(stateList, newDecreeStateKeySequence)) {
                newDecreeIndexPath.push(getMatchingStateIndex(stateList, newDecreeStateKeySequence));
            } else {
                stateList.push({
                    keyCodes: newDecreeStateKeySequence,
                    children: []
                });
                newDecreeIndexPath.push(stateList.length - 1);
            }

            newDecreeStateKeySequence = [];
        }

        return {
            then: then,
            withModifier: withModifier,
            decree: decree
        };
    };
})(window);
