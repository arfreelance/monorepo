// @arfreelance/gulp-pkglint

const PLUGIN_NAME = "gulp-purgecss";

const PluginError = require("plugin-error");
const through = require("through2");
const normalize = require("normalize-package-data");
const sort = require("sort-package-json");

// Exports
// -----------------------------------------------------------------------------

module.exports = () => {
    return through.obj(async (file, encoding, callback) => {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            const err = "Streaming not supported";
            const msg = new PluginError(PLUGIN_NAME, err);
            return callback(msg);
        }

        if (file.basename !== "package.json") {
            const err = `File name should be "package.json" but it is "${file.basename}"`;
            const msg = new PluginError(PLUGIN_NAME, err);
            return callback(msg);
        }

        let data = file.contents.toString();
        data = JSON.parse(data);

        try {
            normalize(data);
        } catch (error) {
            return callback(error);
        }

        ["_id", "gitHead", "readme"].forEach((field) => {
            if (field in data) {
                delete data[field];
            }
        });

        data = sort(data);
        data = JSON.stringify(data);
        file.contents = Buffer.from(data);
        return callback(null, file);
    });
};
