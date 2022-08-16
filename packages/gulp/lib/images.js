// @arfreelance/gulp

const { src, dest } = require("gulp");
const imagemin = require("gulp-imagemin");
const map = require("flat-map").default;
const promisify = require("util/promisify");
const readOriginal = require("gulp-scale-images/read-metadata");
const readPromise = promisify(readOriginal);
const scale = require("gulp-scale-images");
const webp = require("gulp-webp");

// Get variant
// -----------------------------------------------------------------------------

const getVariant = async (file, size) => {
    const scale = `${Math.floor(size * 100)}`;
    const suffix = scale.padStart(3, "0");
    const stem = `${file.stem}-${suffix}`;

    const meta = await readPromise(file);
    const maxWidth = Math.floor(meta.width * size);
    const maxHeight = Math.floor(meta.height * size);

    file.stem = stem;
    file.scale = { maxWidth, maxHeight };
    return file;
};

// Mapper
// -----------------------------------------------------------------------------

const mapper = (file, callback) => {
    const variants = Promise.all([
        getVariant(file.clone(), 1),
        getVariant(file.clone(), 0.75),
        getVariant(file.clone(), 0.5),
        getVariant(file.clone(), 0.25),
    ]);

    return callback(null, variants);
};

// Build
// -----------------------------------------------------------------------------

module.exports.build = (source, target) => {
    return src(source).pipe(imagemin()).pipe(dest(target));
};

// Minify
// -----------------------------------------------------------------------------

module.exports.minify = (source, target) => {
    return src(source)
        .pipe(webp())
        .pipe(map(mapper))
        .pipe(scale())
        .pipe(dest(target));
};
