// @arfreelance/gulp

const rimraf = require("rimraf");

// Exports
// -----------------------------------------------------------------------------

module.exports = (source, callback) => {
    return rimraf(source, callback);
};
