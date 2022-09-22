// @arfreelance/gulp

module.exports = [
    {
        extractor: require("purgecss-from-html"),
        extensions: ["html"],
    },
    // {
    //     extractor: require("purgecss-from-js"),
    //     extensions: ["js"],
    // },
    {
        extractor: require("purgecss-from-pug"),
        extensions: ["pug"],
    },
];
