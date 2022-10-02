import gulp from "@arfreelance/gulp";

// Functions reference
// -----------------------------------------------------------------------------

const { clean, copy, images, pages, parallel, scripts, series, styles, task } =
    gulp;

// Clean task(s)
// -----------------------------------------------------------------------------

task("clean:ini", async () => {
    return await clean(["public", "tmp"]);
});

task("clean:end", async () => {
    return await clean("tmp");
});

// Images task(s)
// -----------------------------------------------------------------------------

task("images", () => {
    const src = "sources/img/**/*.{gif,jpg,jpeg,png,svg}";
    const dest = "tmp/assets/img";
    return images.build(src, dest);
});

// Pages task(s)
// -----------------------------------------------------------------------------

task("pages", () => {
    const src = "sources/pages/**/*.pug";
    const dest = "tmp/public";
    return pages.build(src, dest);
});

// Root task(s)
// -----------------------------------------------------------------------------

task("root", () => {
    const src = "sources/root/**/*";
    const dest = "tmp/public";
    return copy(src, dest, true);
});

// Scripts task(s)
// -----------------------------------------------------------------------------

task("scripts:test", () => {
    const src = "sources/js/**/*.js";
    return scripts.test(src);
});

task("scripts:build", async () => {
    const src = "sources/js/main.js";
    const dest = "tmp/assets/js";
    return await scripts.build(src, dest, "bundle");
});

task("scripts:minify", () => {
    const src = "tmp/assets/js/**/*.js";
    const dest = "tmp/assets/js";
    return scripts.minify(src, dest);
});

task("scripts", series("scripts:test", "scripts:build", "scripts:minify"));

// Styles task(s)
// -----------------------------------------------------------------------------

task("styles:test", () => {
    const src = "sources/scss/**/*.scss";
    return styles.test(src);
});

task("styles:build", () => {
    const src = "sources/scss/**/*.scss";
    const dest = "tmp/assets/css";
    return styles.build(src, dest);
});

task("styles:minify", () => {
    const src = "tmp/assets/css/**/*.css";
    const dest = "tmp/assets/css";
    return styles.minify(src, dest);
});

task("styles", series("styles:test", "styles:build", "styles:minify"));

// Build task(s)
// -----------------------------------------------------------------------------

task("build", parallel("images", "miscs", "pages", "scripts", "styles"));

// Share task(s)
// -----------------------------------------------------------------------------

task("share:public", () => {
    const src = "tmp/public/**/*";
    const dest = "public";
    return copy(src, dest, true);
});

task("share:assets", () => {
    const src = "tmp/assets/**/*";
    const dest = "public/assets";
    return copy(src, dest, true);
});

task("share", parallel("share:public", "share:assets"));

// Default task(s)
// -----------------------------------------------------------------------------

task("default", series("clean:ini", "build", "share", "clean:end"));
