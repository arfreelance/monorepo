const { promisify } = require("util");
const { readFile } = require("fs");
const { src, dest } = require("vinyl-fs");
const findUp = require("find-up");
const gulpEslint = require("gulp-eslint-new");
const gulpif = require("gulp-if");
const gulpPackage = require("./pkglint");
const gulpPrettier = require("gulp-prettier");
const gulpStylelint = require("@ronilaukkarinen/gulp-stylelint");
const parse = require("parse-gitignore");
const read = promisify(readFile);
const stylelintFormatter = require("stylelint-formatter-pretty");

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

// Default ignores
// -----------------------------------------------------------------------------

const getIgnores = async () => {
    const ignores = [
        "**/bower_components/**",
        "**/node_modules/**",
        "**/public/**",
        "**/vendor/**",
        "**/*.min.*",
    ];

    try {
        const file = await findUp(".gitignore");
        const data = file ? await read(file, "utf8") : null;
        const globs = data ? parse.globs(data) : [];

        globs.forEach((_) => {
            _.patterns.forEach((glob) => {
                ignores.push(_.type === "unignore" ? `!${glob}` : glob);
            });
        });

        return [...new Set(ignores)];
    } catch (error) {
        throw new Error(error);
    }
};

// Lint
// -----------------------------------------------------------------------------

module.exports = async (globs) => {
    const options = {
        src: {
            allowEmpty: true,
            base: "./",
            dot: true,
            ignore: await getIgnores(),
        },
        stylelint: {
            allowEmptyInput: true,
            failAfterError: true,
            fix: true,
            reporters: [{ formatter: stylelintFormatter, console: true }],
        },
    };

    return src([...new Set(globs)], options.src)
        .pipe(gulpif(onlyPackage, gulpPackage()))
        .pipe(gulpif(onlyPrettier, gulpPrettier()))
        .pipe(gulpif(onlyEslint, gulpEslint.fix()))
        .pipe(gulpif(onlyEslint, gulpEslint.format()))
        .pipe(gulpif(onlyEslint, gulpEslint.failAfterError()))
        .pipe(gulpif(onlyStylelint, gulpStylelint(options.stylelint)))
        .pipe(dest("./"));
};
