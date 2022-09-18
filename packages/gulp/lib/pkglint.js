// @arfreelance/gulp

const { src, dest } = require("gulp");
const gulpPrettier = require("gulp-prettier");
const pkglint = require("./plugins/pkglint");

// Lint
// -----------------------------------------------------------------------------

module.exports = async (source) => {
    return src(source, { base: "./" })
        .pipe(pkglint())
        .pipe(gulpPrettier())
        .pipe(dest("./"));
};
