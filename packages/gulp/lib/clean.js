// @arfreelance/gulp

const { promisify } = require("util");
const globby = require("globby");
const path = require("upath");
const rimraf = require("rimraf");
const clean = promisify(rimraf);

// Options
// -----------------------------------------------------------------------------

const options = {
    absolute: true,
    expandDirectories: false,
    gitignore: true,
    onlyFiles: false,
};

// Normalize
// -----------------------------------------------------------------------------

const normalize = (sources) => {
    if (Array.isArray(sources)) {
        sources = sources.map((source) => {
            return path.normalizeSafe(source);
        });
    }

    return sources;
};

// Exports
// -----------------------------------------------------------------------------

module.exports = async (sources) => {
    sources = normalize(sources);
    sources = await globby(sources, options);
    sources = sources.map((source) => {
        return clean(source);
    });

    return Promise.all(sources);
};
