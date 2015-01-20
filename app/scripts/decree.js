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

    var decreeTree = [
        {
            keyCodes: [65],
            children: [
                {
                    keyCodes: [83],
                    callback: function() { alert('as was pressed'); },
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
                        alert('as was pressed');
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
        console.log(event.keyCode + ' was pressed.');

        markKeyAsPressed(event.keyCode);

        var currentTime = (new Date()).getTime();
        if (currentTime - timeOfLastPress < timeThreshold) {
            console.log('press was within the time threshold');
            clearTimeout(cancelEndCurrentDecree);
        }

        checkCurrentDecree();

        cancelEndCurrentDecree = setTimeout(function endCurrentDecree() {
            console.log('press outside of threshold, restarting key chain');
            unmarkAllDecrees();
        }, timeThreshold);

        timeOfLastPress = currentTime;
    }

    function markKeyAsPressed(keyCode) {
        keyboardState[keyCode] = true;
    }

    function markKeyAsNotPressed(event) {
        keyboardState[event.keyCode] = false;
    }

    function checkCurrentDecree() {
        decreeTree.forEach(function(decree) {
            checkCurrentDecreeHelper(decree);
        });
    }

    function checkCurrentDecreeHelper(decree) {

        //if the state is not yet marked as matching or not, mark it
        if (!decree.hasOwnProperty('isMatching')) {
            var isMatchingState = true;
            for (var i = 0; i < decree.keyCodes.length; i++) {
                if (!keyboardState[decree.keyCodes[i]]) {
                    isMatchingState = false;
                    break;
                }
            }
            decree.isMatchingState = isMatchingState;
            console.log('marking state as ' + decree.isMatchingState);
        }

        //if it is matching, call the callback if present, then check its child states and do the same
        if (decree.isMatchingState) {
            if (decree.callback) {
                decree.callback();
            }

            decree.children.forEach(function(childDecree) {
                checkCurrentDecreeHelper(childDecree);
            });
        }
    }

    function unmarkAllDecrees() {
        for (var i = 0; i < decreeTree.length; i++) {
            unmarkAllDecreesHelper(decreeTree[i]);
        }
    }

    function unmarkAllDecreesHelper(decree) {
        delete decree.isMatching;

        for (var j = 0; j < decree.children.length; j++) {
            unmarkAllDecreesHelper(decree.children[j]);
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