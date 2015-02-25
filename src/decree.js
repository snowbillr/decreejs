(function(window) {
    function RootNode() {
        var children = [];

        function hasMatchingChildWithKeySequence(keySequence) {
            return getMatchingChildIndexWithKeySequence(keySequence) !== -1;
        }

        function getMatchingChildIndexWithKeySequence(keySequence) {
            var matchingIndex = -1;

            children.forEach(function(child, index) {
                if (child.doesMatchKeySequence(keySequence)) {
                    matchingIndex = index;
                }
            });

            return matchingIndex;
        }

        function getMatchingChildWithKeySequence(keySequence) {
            return children[getMatchingChildIndexWithKeySequence(keySequence)];
        }

        function addChild(state) {
            children.push(state);
        }

        function getChildren() {
            return children;
        }

        return {
            hasMatchingChildWithKeySequence: hasMatchingChildWithKeySequence,
            getMatchingChildIndexWithKeySequence: getMatchingChildIndexWithKeySequence,
            getMatchingChildWithKeySequence: getMatchingChildWithKeySequence,
            addChild: addChild,
            getChildren: getChildren
        };
    }

    function State(_keyCodes) {
        var children = [];
        var keyCodes = _keyCodes;
        var callback = null;

        function doesMatchKeySequence(keySequence) {
            return keyCodes.every(function(keyCode, index) {
                return keySequence.indexOf(keyCode) === index;
            });
        }

        function hasMatchingChildWithKeySequence(keySequence) {
            return getMatchingChildIndexWithKeySequence(keySequence) !== -1;
        }

        function getMatchingChildIndexWithKeySequence(keySequence) {
            var matchingIndex = -1;

            children.forEach(function(child, index) {
                if (child.doesMatchKeySequence(keySequence)) {
                    matchingIndex = index;
                }
            });

            return matchingIndex;
        }

        function getMatchingChildWithKeySequence(keySequence) {
            return children[getMatchingChildIndexWithKeySequence(keySequence)];
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
            addChild: addChild,
            getChildren: getChildren,
            hasMatchingChildWithKeySequence: hasMatchingChildWithKeySequence,
            getMatchingChildIndexWithKeySequence: getMatchingChildIndexWithKeySequence,
            getMatchingChildWithKeySequence: getMatchingChildWithKeySequence,
            getKeyCodes: getKeyCodes,
            setCallback: setCallback,
            getCallback: getCallback,
            hasCallback: hasCallback,
            doesMatchKeySequence: doesMatchKeySequence
        };
    }

    function StateTree() {
        var rootNode = new RootNode();

        function addStateAtIndexPath(state, indexPath) {
            if (indexPath.length === 0) {
                rootNode.addChild(state);
            } else {
                getStateAtIndexPath(indexPath).addChild(state);
            }
        }

        function getStateAtIndexPath(indexPath) {
            if (indexPath.length === 0) {
                return rootNode;
            } else {
                var state = rootNode.getChildren()[indexPath[0]];
                for (var i = 1; i < indexPath.length; i++) {
                    state = state.getChildren()[indexPath[i]];
                }

                return state;
            }
        }

        return {
            getStateAtIndexPath: getStateAtIndexPath,
            addStateAtIndexPath: addStateAtIndexPath
        };
    };

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

    var decreeTree = new StateTree();

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
        var lastMatchingState = getLastMatchingState();

        if (shouldListenForKeys && lastMatchingState.hasMatchingChildWithKeySequence(currentInputKeys)) {
            matchingDecreeIndexPath.push(lastMatchingState.getMatchingChildIndexWithKeySequence(currentInputKeys));

            if (getLastMatchingState().hasCallback()) {
                getLastMatchingState().getCallback().call(null);
                listenForNextDecree();
            }
        } else {
            shouldListenForKeys = false;
        }

        currentInputKeys = [];
    }

    function getLastMatchingState() {
        return decreeTree.getStateAtIndexPath(matchingDecreeIndexPath);
    }

    function listenForNextDecree() {
        matchingDecreeIndexPath = [];
        shouldListenForKeys = true;
    }

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
            if (decreeTree.getStateAtIndexPath(newDecreeIndexPath).hasMatchingChildWithKeySequence(newDecreeStateKeySequence)) {
                newDecreeIndexPath.push(decreeTree.getStateAtIndexPath(newDecreeIndexPath).getMatchingChildIndexWithKeySequence(newDecreeStateKeySequence))
            } else {
                decreeTree.getStateAtIndexPath(newDecreeIndexPath).addChild(new State(newDecreeStateKeySequence));
                newDecreeIndexPath.push(decreeTree.getStateAtIndexPath(newDecreeIndexPath).getChildren().length - 1);
            }

            newDecreeStateKeySequence = [keyCodeMap[key]];

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
            if (decreeTree.getStateAtIndexPath(newDecreeIndexPath).hasMatchingChildWithKeySequence(newDecreeStateKeySequence)) {
                decreeTree.getStateAtIndexPath(newDecreeIndexPath).getMatchingChildWithKeySequence(newDecreeStateKeySequence).setCallback(callback);
            } else {
                var newState = new State(newDecreeStateKeySequence);
                newState.setCallback(callback);

                decreeTree.getStateAtIndexPath(newDecreeIndexPath).addChild(newState);
            }
        }
    }

    function config(options) {
        if (options.hasOwnProperty('timeThreshold')) {
            timeThreshold = options.timeThreshold;
        }
    }

    window.decree = {
        when: when,
        config: config
    };


})(window);
