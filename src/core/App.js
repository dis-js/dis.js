const { Client } = require("discord.js");
const log = require("log-beautify");

const { Event } = require("./EventBus");
const { Util } = require("../util/Util");

class App {
    config = {};
    event = new Event();
    client;
    log = log;

    constructor() {
        this._configSet();
    }

    init() {
        this._initClient();
        this._initPlugins();
        this._initListener();
        this._startBot();
    }

    _configSet() {
        Util.filesGet("config", false).forEach((config) => {
            Object.assign(this.config, { ...require(config) });
        });
    }

    _initPlugins() {
        this.event.emit("plugins:loading", this);
        const plugins = Util.filesGet("plugins", this.config.app?.plugins);
        this.log.info("Количество плагинов: " + plugins.length);
        console.group();
        plugins.forEach((plugin, i) => {
            this._defaultRequire(plugin, i);
        });
        this.event.emit("plugins:loaded", this);
        console.groupEnd();
        this.log.show();
    }

    _initClient() {
        this.event.emit("client:loading", this);
        this.client = new Client({ intents: this.config.discord.intents });
        this.event.emit("client:loaded", this);
    }

    _initListener() {
        this.event.emit("listener:loading", this);
        const listeners = Util.filesGet("Listener", this.config.discord.listeners, "/App");
        this.log.info("Количество слушателей: " + listeners.length);
        console.group();
        listeners.forEach((listener, i) => {
            this._defaultRequire(listener, i);
        });
        console.groupEnd();
        this.log.show();
        this.event.emit("listener:loaded", this);
    }

    _startBot() {
        this.client
            .login(this.config.discord?.token)
            .then(() => {
                this.log.ok("Клиент бота подключился");
            })
            .catch((e) => {
                if (e.code === "TOKEN_INVALID") {
                    this.log.error("Указан неверный токен бота");
                    this.log.info("Смотри в файл config.json");
                    this.log.info("Вот его содержимое");
                    this.log.show(require(Util.root + "/config.json"));
                } else {
                    throw e;
                }
            })
            .catch((e) => {
                this.log.error("Неизвестная ошибка");
                this.log.show(e);
            });
    }

    _defaultRequire(file, i) {
        try {
            const e = require(file);
            this.log.ok(i + 1 + ": " + file.split("/")[file.split("/").length - 1]);
            e.run();
        } catch (error) {
            this.log.warn(i + 1 + ": " + file.split("/")[file.split("/").length - 1]);
            if (this.config.app.debug) {
                this.log.error(error);
                this.log.show(error);
            }
        }
    }
}

exports.App = new App();
