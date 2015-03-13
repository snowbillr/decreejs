var eventListenerCallbacks = {};

window.addEventListener = function(event, callback) {
    eventListenerCallbacks[event] = callback;
};

window.sendEvent = function(event, keyCode) {
    eventListenerCallbacks[event]({
        keyCode: keyCode,
        type: event
    });
};