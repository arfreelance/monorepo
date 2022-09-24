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
    const src = "sources/images/**/*.{gif,jpg,jpeg,png,svg}";
    const dest = "tmp/assets/images";
    return images.build(src, dest);
});

// Miscs task(s)
// -----------------------------------------------------------------------------

task("miscs", () => {
    const src = "sources/miscs/**/*";
    const dest = "tmp/public";
    return copy(src, dest, true);
});

// Pages task(s)
// -----------------------------------------------------------------------------

task("pages", () => {
    const src = "sources/pages/**/*.pug";
    const dest = "tmp/public";
    return pages.build(src, dest);
});

// Scripts task(s)
// -----------------------------------------------------------------------------

task("scripts:test", () => {
    const src = "sources/scripts/**/*.js";
    return scripts.test(src);
});

task("scripts:build", async () => {
    const src = "sources/scripts/main.js";
    const dest = "tmp/assets/scripts";
    return await scripts.build(src, dest, "esm");
});

task("scripts:minify", () => {
    const src = "tmp/assets/scripts/**/*.js";
    const dest = "tmp/assets/scripts";
    return scripts.minify(src, dest);
});

task("scripts", series("scripts:test", "scripts:build", "scripts:minify"));

// Styles task(s)
// -----------------------------------------------------------------------------

task("styles:test", () => {
    const src = "sources/styles/**/*.scss";
    return styles.test(src);
});

task("styles:build", () => {
    const src = "sources/styles/main.scss";
    const dest = "tmp/assets/styles";
    return styles.build(src, dest);
});

task("styles:minify", () => {
    const src = "tmp/assets/styles/**/*.css";
    const dest = "tmp/assets/styles";
    const opts = { content: ["sources/**/*.{js,pug}"] };
    return styles.minify(src, dest, opts);
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
