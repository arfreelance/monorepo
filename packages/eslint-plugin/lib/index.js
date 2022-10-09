// @arfreelance/eslint-plugin

const _ = require("lodash");

// Plugins
// -----------------------------------------------------------------------------

const plugins = {
    import: require("eslint-plugin-import"),
    node: require("eslint-plugin-n"),
    promise: require("eslint-plugin-promise"),
};

// Rules
// -----------------------------------------------------------------------------

const rules = _.assign({}, plugins.import.rules, plugins.node.rules, plugins.promise.rules);

// Exports
// -----------------------------------------------------------------------------

module.exports = { rules };
