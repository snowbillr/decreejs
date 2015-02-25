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
    var lastMatchingStateTreeNode = getLastMatchingStateTreeNode();

    if (lastMatchingStateTreeNode.hasChildMatchingKeySequence(currentInputKeys)) {
        matchingDecreeIndexPath.push(lastMatchingStateTreeNode.getChildIndexMatchingKeySequence(currentInputKeys));

        if (getLastMatchingStateTreeNode().getState().hasCallback()) {
            getLastMatchingStateTreeNode().getState().executeCallback();
            listenForNextDecree();
        }
    }

    currentInputKeys = [];
}

function getLastMatchingStateTreeNode() {
    return decreeTree.getStateTreeNodeAtIndexPath(matchingDecreeIndexPath);
}

function listenForNextDecree() {
    matchingDecreeIndexPath = [];
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
        if (decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath).hasChildMatchingKeySequence(newDecreeStateKeySequence)) {
            newDecreeIndexPath.push(decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath).getChildIndexMatchingKeySequence(newDecreeStateKeySequence))
        } else {
            decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath).addChild(new State(newDecreeStateKeySequence));
            newDecreeIndexPath.push(decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath).getChildren().length - 1);
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
        if (decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath).hasChildMatchingKeySequence(newDecreeStateKeySequence)) {
            decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath).getChildMatchingKeySequence(newDecreeStateKeySequence).getState().setCallback(callback);
        } else {
            var newState = new State(newDecreeStateKeySequence);
            newState.setCallback(callback);

            decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath).addChild(newState);
        }

        var callbackIndexPath = newDecreeIndexPath.slice();

        return function() {
            decreeTree.getStateTreeNodeAtIndexPath(callbackIndexPath).getState().removeCallback();
            decreeTree.prune();
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
