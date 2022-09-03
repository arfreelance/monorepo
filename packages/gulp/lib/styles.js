// @arfreelance/gulp

const { src, dest } = require("gulp");
const cleancss = require("gulp-clean-css");
const compiler = require("sass");
const formatter = require("stylelint-formatter-pretty");
const path = require("upath");
const pkgDir = require("pkg-dir");
const postcss = require("gulp-postcss");
const prettier = require("gulp-prettier");
const purgecss = require("./plugins/purgecss");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(compiler);
const stylelint = require("@ronilaukkarinen/gulp-stylelint");

// Paths
// -----------------------------------------------------------------------------

const root = pkgDir.sync() || process.cwd();
const mods = path.resolve(root, "node_modules");

// Options
// -----------------------------------------------------------------------------

const autoprefixer = {
    cascade: false,
};

const cssnano = {
    preset: ["default", { colormin: false, mergeRules: false }],
};

const options = {
    cleancss: {
        format: { breakWith: "lf" },
        rebase: true,
        level: {
            1: {
                roundingPrecision: 5,
                selectorsSortingMethod: false,
                specialComments: 0,
            },
            2: {
                all: false,
                mergeIntoShorthands: true,
                overrideProperties: true,
            },
        },
    },
    postcss: [
        require("./plugins/mqpacker"),
        require("cssnano")(cssnano),
        require("autoprefixer")(autoprefixer),
    ],
    rename: {
        suffix: ".min",
    },
    sass: {
        includePaths: [root, mods],
        outputStyle: "expanded",
        precision: 5,
    },
    stylelint: {
        allowEmptyInput: true,
        failAfterError: true,
        fix: true,
        reporters: [{ formatter, console: true }],
    },
};

// Test
// -----------------------------------------------------------------------------

module.exports.test = (source) => {
    return src(source, { base: "./" })
        .pipe(prettier())
        .pipe(stylelint(options.stylelint))
        .pipe(dest("./"));
};

// Build
// -----------------------------------------------------------------------------

module.exports.build = (source, target) => {
    return src(source)
        .pipe(sass(options.sass))
        .pipe(postcss(options.postcss))
        .pipe(prettier())
        .pipe(stylelint(options.stylelint))
        .pipe(dest(target));
};

// Minify
// -----------------------------------------------------------------------------

module.exports.minify = (source, target, purgecssOptions) => {
    return src(source)
        .pipe(purgecss(purgecssOptions))
        .pipe(cleancss(options.cleancss))
        .pipe(rename(options.rename))
        .pipe(dest(target));
};
