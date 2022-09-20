// @arfreelance/gulp

const { src, dest } = require("gulp");
const gulpif = require("gulp-if");
const imagemin = require("gulp-imagemin");
const isBinary = require("isbinaryfile");
const webp = require("gulp-webp");

// Pug condition
// -----------------------------------------------------------------------------

const condition = (file) => {
    return isBinary.isBinaryFileSync(file.contents);
};

// Build
// -----------------------------------------------------------------------------

module.exports.build = (source, target) => {
    return src(source)
        .pipe(imagemin())
        .pipe(dest(target))
        .pipe(gulpif(condition, webp()))
        .pipe(gulpif(condition, dest(target)));
};
