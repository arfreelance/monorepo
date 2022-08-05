// @arfreelance/gulp

const { src, dest } = require("gulp");
const imagemin = require("gulp-imagemin");

// Build
// -----------------------------------------------------------------------------

module.exports = (source, target) => {
    return src(source).pipe(imagemin()).pipe(dest(target));
};
