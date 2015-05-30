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

var options = {
    timeThreshold: 500 //milliseconds
};

var timeOfLastPress;
var cancelEndCurrentDecree;

var matchingDecreeIndexPath = [];

var lastKeyEvent;
var currentInputKeys = [];

var decreeTree = new StateTree();

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

function onKeyDown(keyEvent) {
    if (lastKeyEvent && lastKeyEvent.type === 'keydown' && lastKeyEvent.keyCode === keyEvent.keyCode) {
        lastKeyEvent = keyEvent;
        return;
    }
    lastKeyEvent = keyEvent;

    currentInputKeys.push(keyEvent.keyCode);

    allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold();
}

function allowKeySequenceToEndIfNoKeyPressWithinTimeThreshold() {
    var currentTime = (new Date()).getTime();
    if (currentTime - timeOfLastPress < options.timeThreshold) {
        clearTimeout(cancelEndCurrentDecree);
    }
    timeOfLastPress = currentTime;

    cancelEndCurrentDecree = setTimeout(listenForNextDecree, options.timeThreshold);
}

function onKeyUp(keyEvent) {
    lastKeyEvent = keyEvent;

    var lastMatchingStateTreeNode = getLastMatchingStateTreeNode();

    if (lastMatchingStateTreeNode.hasChildMatchingKeySequence(currentInputKeys)) {
        matchingDecreeIndexPath.push(lastMatchingStateTreeNode.getChildIndexMatchingKeySequence(currentInputKeys));

        if (getLastMatchingStateTreeNode().getState().hasCallback()) {
            getLastMatchingStateTreeNode().getState().executeCallback();
            listenForNextDecree();
        }
    }

    currentInputKeys.splice(currentInputKeys.indexOf(keyEvent.keyCode), 1);
}

function getLastMatchingStateTreeNode() {
    return decreeTree.getStateTreeNodeAtIndexPath(matchingDecreeIndexPath);
}

function listenForNextDecree() {
    matchingDecreeIndexPath = [];
}

function when(key) {
    var newStateKey = '';
    var newStateModifierKeys = [];
    var newDecreeIndexPath = [];

    newStateKey = keyCodeMap[key];

    return {
        then: then,
        withModifier: withModifier,
        perform: perform
    };

    function then(key) {
        registerState();

        newStateKey = keyCodeMap[key];
        newStateModifierKeys = [];

        return {
            then: then,
            withModifier: withModifier,
            perform: perform
        };
    }

    function withModifier(key) {
        newStateModifierKeys.push(keyCodeMap[key]);

        return {
            then: then,
            withModifier: withModifier,
            perform: perform
        };
    }

    function perform(callback) {
        var newState = registerState();
        newState.setCallback(callback);

        var callbackIndexPath = newDecreeIndexPath.slice();
        var callbackStateIdPath = [];
        for (var i = 0; i < callbackIndexPath.length; i++) {
            var subIndexPath = callbackIndexPath.slice(0, i + 1);
            callbackStateIdPath.push(decreeTree.getStateTreeNodeAtIndexPath(subIndexPath).getState().getId());
        }

        return function() {
            decreeTree.getStateTreeNodeAtStateIdPath(callbackStateIdPath).getState().removeCallback();
            decreeTree.pruneBranch(callbackStateIdPath);
        }
    }

    function registerState() {
        var lastNewState = decreeTree.getStateTreeNodeAtIndexPath(newDecreeIndexPath);
        var newState = new State(newStateKey, newStateModifierKeys);

        if (lastNewState.hasChildMatchingStateKeys(newStateKey, newStateModifierKeys)) {
            newDecreeIndexPath.push(lastNewState.getChildIndexMatchingStateKeys(newStateKey, newStateModifierKeys))
        } else {
            lastNewState.addChild(newState);
            newDecreeIndexPath.push(lastNewState.getChildren().length - 1);
        }

        return newState;
    }
}

function config(customOptions) {
    for (var option in options) {
        if (customOptions.hasOwnProperty(option)) {
            options[option] = customOptions[option];
        }
    }
}

function deregisterAll() {
    decreeTree.clear();
}

window.decree = {
    when: when,
    config: config,
    deregisterAll: deregisterAll
};
