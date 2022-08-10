// @arfreelance/gulp

const { src, dest } = require("gulp");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");

// Build
// -----------------------------------------------------------------------------

module.exports = (source, target) => {
    return src(source)
        .pipe(imagemin())
        .pipe(dest(target))
        .pipe(webp())
        .pipe(dest(target));
};
