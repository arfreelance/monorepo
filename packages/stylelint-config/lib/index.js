// @arfreelance/stylelint-config

const _ = require("lodash");

const standard = require("stylelint-config-standard-scss");
const prettier = require("stylelint-config-prettier-scss");

// Custom config
// -----------------------------------------------------------------------------

const custom = {
    extends: [],
    plugins: ["@arfreelance/stylelint-plugin"],
    rules: {
        "no-descending-specificity": null,
        "no-duplicate-selectors": null,
        "no-empty-source": null,
        "number-max-precision": null,
        "value-keyword-case": null,
        "rule-empty-line-before": ["always", { except: ["first-nested"] }],
        "at-rule-empty-line-before": [
            "always",
            {
                except: ["first-nested"],
                ignoreAtRules: ["import", "else", "extend", "use"],
            },
        ],
        "at-rule-no-vendor-prefix": null,
        "media-feature-name-no-vendor-prefix": null,
        "property-no-vendor-prefix": null,
        "selector-no-vendor-prefix": null,
        "value-no-vendor-prefix": null,
        "scss/dollar-variable-empty-line-after": null,
        "scss/dollar-variable-empty-line-before": null,
        "order/properties-order": require("./order"),
    },
};

// Custom config
// -----------------------------------------------------------------------------

const config = _.assign({}, custom, standard, prettier);
config.extends = _.concat(custom.extends, standard.extends, prettier.extends);
config.rules = _.assign({}, standard.rules, prettier.rules, custom.rules);

// Exports
// -----------------------------------------------------------------------------

module.exports = config;
