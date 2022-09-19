const { src, dest } = require("vinyl-fs");
const gulpEslint = require("gulp-eslint-new");
const gulpif = require("gulp-if");
const gulpPackage = require("./pkglint");
const gulpPrettier = require("gulp-prettier");
const gulpStylelint = require("@ronilaukkarinen/gulp-stylelint");
const stylelintFormatter = require("stylelint-formatter-pretty");

// Ignore
// -----------------------------------------------------------------------------

const ignore = [
    "!**/bower_components/**",
    "!**/node_modules/**",
    "!**/public/**",
    "!**/vendor/**",
    "!**/*.min.*",
];

// Conditions
// -----------------------------------------------------------------------------

const onlyEslint = (file) => {
    const exts = [".js"];
    return exts.includes(file.extname);
};

const onlyPackage = (file) => {
    const files = ["package.json"];
    return files.includes(file.basename);
};

const onlyPrettier = (file) => {
    const files = [".firebaserc"];
    const exts = [".css", ".js", ".json", ".md", ".scss", ".firebaserc"];
    return exts.includes(file.extname) || files.includes(file.basename);
};

const onlyStylelint = (file) => {
    const exts = [".css", ".scss"];
    return exts.includes(file.extname);
};

// Options
// -----------------------------------------------------------------------------

const options = {
    allowEmptyInput: true,
    failAfterError: true,
    fix: true,
    reporters: [{ formatter: stylelintFormatter, console: true }],
};

// Lint
// -----------------------------------------------------------------------------

module.exports = (globs) => {
    const opts = { allowEmpty: true, base: "./", dot: true };

    globs = globs.concat(ignore);
    globs = [...new Set(globs)];

    return src(globs, opts)
        .pipe(gulpif(onlyPackage, gulpPackage()))
        .pipe(gulpif(onlyPrettier, gulpPrettier()))
        .pipe(gulpif(onlyEslint, gulpEslint.fix()))
        .pipe(gulpif(onlyEslint, gulpEslint.format()))
        .pipe(gulpif(onlyEslint, gulpEslint.failAfterError()))
        .pipe(gulpif(onlyStylelint, gulpStylelint(options)))
        .pipe(dest("./"));
};
