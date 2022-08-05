// @arfreelance/gulp

const { src, dest } = require("gulp");

// Exports
// -----------------------------------------------------------------------------

module.exports = (source, target, dot = false) => {
    return src(source, { dot }).pipe(dest(target));
};
