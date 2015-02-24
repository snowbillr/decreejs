(function(window) {
    var keyCodeMap = {
        "space": 32,
        "enter": 13,
        "return": 13,
        "tab": 9,
        "esc": 27,
        "escape": 27,
        "backspace": 8,
        "shift": 16,
        "control": 17,
        "ctrl": 17,
        "alt": 18,
        "0": 48,
        "1": 49,
        "2": 50,
        "3": 51,
        "4": 52,
        "5": 53,
        "6": 54,
        "7": 55,
        "8": 56,
        "9": 57,
        "left": 37,
        "up": 38,
        "right": 39,
        "down": 40,
        "a": 65,
        "b": 66,
        "c": 67,
        "d": 68,
        "e": 69,
        "f": 70,
        "g": 71,
        "h": 72,
        "i": 73,
        "j": 74,
        "k": 75,
        "l": 76,
        "m": 77,
        "n": 78,
        "o": 79,
        "p": 80,
        "q": 81,
        "r": 82,
        "s": 83,
        "t": 84,
        "u": 85,
        "v": 86,
        "w": 87,
        "x": 88,
        "y": 89,
        "z": 90
    };

    var timeThreshold = 500; //milliseconds
    var timeOfLastPress;
    var cancelEndCurrentDecree;

    var matchingDecreeIndexPath = [];

    var shouldListenForKeys = true;
    var currentInputKeys = [];

    var decreeTree = [];

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    function onKeyDown(keyEvent) {
        currentInputKeys.push(keyEvent.keyCode);

        allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold();
    }

    function allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold() {
        var currentTime = (new Date()).getTime();
        if (currentTime - timeOfLastPress < timeThreshold) {
            clearTimeout(cancelEndCurrentDecree);
        }
        timeOfLastPress = currentTime;

        cancelEndCurrentDecree = setTimeout(listenForNextDecree, timeThreshold);
    }

    function onKeyUp() {
        var stateList = getPotentiallyMatchingStates();

        if (shouldListenForKeys && hasMatchingState(stateList, currentInputKeys)) {
            matchingDecreeIndexPath.push(getMatchingStateIndex(stateList, currentInputKeys));

            if (getLastMatchingState().hasCallback()) {
                executeDecreeCallback();
                listenForNextDecree();
            }
        } else {
            shouldListenForKeys = false;
        }

        currentInputKeys = [];
    }

    function getPotentiallyMatchingStates() {
        if (matchingDecreeIndexPath.length > 0) {
            return getLastMatchingState().getChildren();
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
        return state.getKeyCodes().every(function(keyCode, index) {
            return keySequence.indexOf(keyCode) === index;
        });
    }

    function getLastMatchingState() {
        return getStateAtIndexPath(matchingDecreeIndexPath);
    }

    function getStateAtIndexPath(indexPath) {
        var state = decreeTree[indexPath[0]];
        for (var i = 1; i < indexPath.length; i++) {
            state = state.getChildren()[indexPath[i]];
        }
        return state;
    }

    function executeDecreeCallback() {
        var stateToExecute = getLastMatchingState();

        stateToExecute.getCallback().call(null);
    }

    function listenForNextDecree() {
        matchingDecreeIndexPath = [];
        shouldListenForKeys = true;
    }

    window.decree = {
        when: when,
        config: config
    };

    function when(key) {
        var newDecreeStateKeySequence = [];
        var newDecreeIndexPath = [];

        newDecreeStateKeySequence.push(keyCodeMap[key]);

        return {
            then: then,
            withModifier: withModifier,
            perform: perform
        };

        function then(key) {
            addStateToTree();

            newDecreeStateKeySequence.push(keyCodeMap[key]);

            return {
                then: then,
                withModifier: withModifier,
                perform: perform
            };
        }

        function withModifier(key) {
            newDecreeStateKeySequence.splice(0, 0, keyCodeMap[key]);

            return {
                then: then,
                withModifier: withModifier,
                perform: perform
            };
        }

        function perform(callback) {
            addStateToTree();

            getStateAtIndexPath(newDecreeIndexPath).setCallback(callback);
        }

        function addStateToTree() {
            var stateList;
            if (newDecreeIndexPath.length === 0) {
                stateList = decreeTree;
            } else {
                stateList = getStateAtIndexPath(newDecreeIndexPath).getChildren();
            }

            if (hasMatchingState(stateList, newDecreeStateKeySequence)) {
                newDecreeIndexPath.push(getMatchingStateIndex(stateList, newDecreeStateKeySequence));
            } else {
                var newState = new State(newDecreeStateKeySequence);
                stateList.push(newState);
                newDecreeIndexPath.push(stateList.length - 1);
            }

            newDecreeStateKeySequence = [];
        }
    }

    function config(options) {
        if (options.hasOwnProperty('timeThreshold')) {
            timeThreshold = options.timeThreshold;
        }
    }

    var StateTree = function() {
        var tree = [];

        function addState(state) {

        }

        function getStateAtIndexPath() {

        }

        return {};
    };

    var State = function(_keyCodes) {
        var children = [];
        var keyCodes = _keyCodes;
        var callback = null;

        function doesMatchKeySequence(keySequence) {
            return keyCodes.every(function(keyCode, index) {
                return keySequence.indexOf(keyCode) === index;
            });
        }

        function getChildWithKeySequence(keySequence) {

        }

        function addChild(state) {
            children.push(state);
        }

        function getKeyCodes() {
            return keyCodes;
        }

        function getChildren() {
            return children;
        }

        function setCallback(cb) {
            callback = cb;
        }

        function getCallback() {
            return callback;
        }

        function hasCallback() {
            return callback !== null
        }

        return {
            getChildren: getChildren,
            getKeyCodes: getKeyCodes,
            setCallback: setCallback,
            getCallback: getCallback,
            hasCallback: hasCallback
        };
    };

})(window);
