// @arfreelance/eslint-config

const _ = require("lodash");
const standard = require("eslint-config-standard");
const prettier = require("eslint-config-prettier");

// Prefix
// -----------------------------------------------------------------------------

const prefix = "@arfreelance/";

// Initial config
// -----------------------------------------------------------------------------

const custom = {
    parser: "@babel/eslint-parser",
    parserOptions: { requireConfigFile: false },
    env: { browser: true },
};

const plugins = { plugins: [`${prefix}eslint-plugin`] };
const rules = { rules: _.assign({}, standard.rules, prettier.rules) };

// Merged config
// -----------------------------------------------------------------------------

const merged = _.merge({}, custom, standard, prettier);
const config = _.assign({}, merged, plugins, rules);

// Rename scoped rules
// -----------------------------------------------------------------------------

for (const rule in config.rules) {
    let regex = null;

    if (_.startsWith(rule, "import/")) {
        regex = /^import\//;
    } else if (_.startsWith(rule, "n/")) {
        regex = /^n\//;
    } else if (_.startsWith(rule, "promise/")) {
        regex = /^promise\//;
    }

    if (regex) {
        const renamed = _.replace(rule, regex, prefix);
        config.rules[renamed] = config.rules[rule];
        delete config.rules[rule];
    }
}

// Exports
// -----------------------------------------------------------------------------

module.exports = config;
