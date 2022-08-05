// @arfreelance/gulp

const { src, dest } = require("gulp");
const amp = require("./plugins/amp");
const data = require("gulp-data");
const fs = require("fs");
const gulpif = require("gulp-if");
const path = require("path");
const pkgDir = require("pkg-dir");
const pug = require("gulp-pug");

// Pug condition
// -----------------------------------------------------------------------------

const condition = (file) => {
    return file.extname === ".pug";
};

// Pug data loader
// -----------------------------------------------------------------------------

const loader = (file, callback) => {
    const filepath = path.resolve(file.dirname, `${file.stem}.js`);

    return fs.access(filepath, fs.constants.F_OK, (error) => {
        const result = error ? {} : require(filepath);
        return callback(undefined, result);
    });
};

// Pug options
// -----------------------------------------------------------------------------

const basedir = pkgDir.sync() || process.cwd();
const filters = { trim: (text) => text.trim() };
const options = { basedir, filters };

// Build
// -----------------------------------------------------------------------------

module.exports = (source, target) => {
    return src(source)
        .pipe(gulpif(condition, data(loader)))
        .pipe(gulpif(condition, pug(options)))
        .pipe(amp())
        .pipe(dest(target));
};
