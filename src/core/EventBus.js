const EventEmitter = require("node:events");

class Event extends EventEmitter {
    loading(name, callback) {
        return this.on(name + ":loading", callback);
    }

    loaded(name, callback) {
        return this.on(name + ":loaded", callback);
    }
}

exports.Event = Event;
