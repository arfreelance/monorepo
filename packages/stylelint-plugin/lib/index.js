// @arfreelance/stylelint-plugin

const _ = require("lodash");

// Plugins
// -----------------------------------------------------------------------------

const order = require("stylelint-order");
const scss = require("stylelint-scss");

// Merged plugins
// -----------------------------------------------------------------------------

const merged = _.concat(order, scss.default);
const plugin = _.uniqBy(merged, "ruleName");

// Exports
// -----------------------------------------------------------------------------

module.exports = plugin;
