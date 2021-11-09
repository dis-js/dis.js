const { App } = require("./App");

class BaseJob {
    constructor() {
        this.app = App;
        this.client = App.client;
        this.name = this.constructor.name;
    }

    skip() {
        return false;
    }

    run(...args) {
        if (this.skip(...args)) return;
        this.handle(...args);
    }
}

exports.BaseJob = BaseJob;
