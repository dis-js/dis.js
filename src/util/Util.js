const { readdirSync } = require("node:fs");

class Util {
    root = require.main.path;

    filesGet(path, only, prefix) {
        only = only === undefined ? [] : only;
        prefix = prefix ?? "";
        const fullPath = this.root + prefix + "/" + path;
        let files;
        try {
            files = readdirSync(fullPath);
        } catch {
            files = [];
        }
        if (only)
            files = files.filter((file) => {
                file = file.split(".");
                file.pop();
                return only.includes(file.join("."));
            });
        return files.map((fileName) => fullPath + "/" + fileName);
    }
}

exports.Util = new Util();
