// @arfreelance/base

const { task, series, styles } = require("@arfreelance/gulp");

// Test task(s)
// -----------------------------------------------------------------------------

task("test", () => {
    return styles.test("./scss/**/*.scss");
});

// Build task(s)
// -----------------------------------------------------------------------------

task("build", () => {
    return styles.build("./scss/main.scss", "css");
});

// Minify task(s)
// -----------------------------------------------------------------------------

task("minify", () => {
    return styles.minify("./css/main.css", "css");
});

// Default task(s)
// -----------------------------------------------------------------------------

task("default", series("test", "build", "minify"));
