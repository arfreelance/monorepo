// @arfreelance/gulp

const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { rollup } = require("rollup");
const { src, dest } = require("gulp");
const { terser } = require("rollup-plugin-terser");
const gulpEslint = require("gulp-eslint-new");
const gulpPrettier = require("gulp-prettier");
const gulpRename = require("gulp-rename");
const gulpTerser = require("gulp-terser");
const prettier = require("rollup-plugin-prettier");

// Options
// -----------------------------------------------------------------------------

const terserOptions = {
    compress: true,
    format: { comments: false },
    mangle: true,
};

const options = {
    rename: { suffix: ".min" },
    rollup: {
        plugins: [
            nodeResolve(),
            babel({ exclude: "node_modules/**", babelHelpers: "bundled" }),
            terser({ ...terserOptions, mangle: false }),
            prettier({ parser: "babel" }),
        ],
    },
};

// Test
// -----------------------------------------------------------------------------

module.exports.test = async (source) => {
    return src(source, { base: "./" })
        .pipe(gulpEslint.fix())
        .pipe(gulpEslint.format())
        .pipe(gulpEslint.failAfterError())
        .pipe(gulpPrettier())
        .pipe(dest("./"));
};

// Build
// -----------------------------------------------------------------------------

module.exports.build = async (source, target, format = "iife") => {
    const input = { input: source, plugins: options.rollup.plugins };
    const output = { dir: target, sourcemap: false, format };
    const bundle = await rollup(input);
    return bundle.write(output);
};

// Minify
// -----------------------------------------------------------------------------

module.exports.minify = async (source, target) => {
    return src(source)
        .pipe(gulpTerser(terserOptions))
        .pipe(gulpRename(options.rename))
        .pipe(dest(target));
};
