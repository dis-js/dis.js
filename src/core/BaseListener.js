const { App } = require("./App");
const { Util } = require("../util/Util");

class BaseListener {
    constructor() {
        this.app = App;
        this.client = App.client;
        this.util = Util;
    }

    get event() {
        return this.constructor.name.toLowerCase();
    }

    get jobDir() {
        return this.pathJob + this.name;
    }

    get name() {
        return this.constructor.name;
    }

    get pathJob() {
        return this.app.config.discord.pathJobs;
    }

    get type() {
        return "on";
    }

    baseRequire() {
        const files = this.getActions();
        this.app.log.info("Задачи (" + files.length + "):");
        console.group();
        const required = files.map((file) => {
            file = require(file);
            file = new file();
            this.app.log.ok(file.name);
            return file;
        });
        console.groupEnd();
        console.log();
        return required;
    }

    exec(...args) {
        this.jobs.forEach((e) => {
            e.run(...args);
        });
    }

    getActions() {
        return this.util.filesGet(this.jobDir, this.actions);
    }

    handle() {
        this.client[this.type](this.event, (...args) => {
            if (this.skip(...args)) return;
            this.exec(...args);
        });
    }

    run() {
        try {
            this.jobs = this.baseRequire();
            this.handle();
        } catch (e) {
            this._error(e);
        }
    }

    skip() {
        return false;
    }

    _error(error) {
        throw error;
    }
}

exports.BaseListener = BaseListener;
