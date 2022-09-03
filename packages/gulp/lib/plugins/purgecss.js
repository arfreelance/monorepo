// @arfreelance/gulp-purgecss

const PLUGIN_NAME = "gulp-purgecss";

const { PurgeCSS } = require("purgecss");
const PluginError = require("plugin-error");
const through = require("through2");

// Exports
// -----------------------------------------------------------------------------

module.exports = (options) => {
    return through.obj(async (file, encoding, callback) => {
        if (file.isNull() || !options) {
            return callback(null, file);
        }

        if (file.isStream()) {
            const err = "Streaming not supported";
            const msg = new PluginError(PLUGIN_NAME, err);
            return callback(msg);
        }

        options.css = [{ raw: file.contents.toString() }];

        try {
            const purgecss = new PurgeCSS();
            const result = await purgecss.purge(options);
            const content = result.shift().css.trim();

            file.contents = Buffer.from(content);
            return callback(null, file);
        } catch (err) {
            const msg = new PluginError(PLUGIN_NAME, err);
            return callback(msg);
        }
    });
};
