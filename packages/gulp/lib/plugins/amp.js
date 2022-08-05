// @arfreelance/gulp-amp

const PLUGIN_NAME = "gulp-amp";

const { dirname, resolve } = require("path");
const { PurgeCSS } = require("purgecss");
const CleanCSS = require("clean-css");
const PluginError = require("plugin-error");
const through = require("through2");

// Amp optimizer
// -----------------------------------------------------------------------------

const AmpOptimizerModule = "@ampproject/toolbox-optimizer";
const AmpOptimizerClass = require(AmpOptimizerModule);
const ampOptimizerPath = require.resolve(AmpOptimizerModule);
const ampOptimizerDir = dirname(ampOptimizerPath);
const ampOptimizer = AmpOptimizerClass.create();

// Tree parser
// -----------------------------------------------------------------------------

const treeParserPath = resolve(ampOptimizerDir, "lib/TreeParser");
const treeParser = require(treeParserPath);

// Node utils
// -----------------------------------------------------------------------------

const { firstChildByTag, hasAttribute } = AmpOptimizerClass.NodeUtils;

// Minify node
// -----------------------------------------------------------------------------

const minifyNode = async (node, body) => {
    if ("attribs" in node.parent && "amp-custom" in node.parent.attribs) {
        const purgecssOptions = {
            content: [{ raw: body, extension: "html" }],
            css: [{ raw: node.data }],
            safelist: [/^(html|:root)$/, /amphtml/],
        };

        const purgecss = new PurgeCSS();
        const purgecssResult = await purgecss.purge(purgecssOptions);
        node.data = purgecssResult.shift().css.trim();
    }

    const cleancssOptions = {
        returnPromise: true,
        format: { breakWith: "lf" },
        rebase: true,
        level: {
            1: {
                roundingPrecision: 5,
                selectorsSortingMethod: false,
                specialComments: 0,
            },
            2: {
                all: false,
                mergeIntoShorthands: true,
                overrideProperties: true,
            },
        },
    };

    const cleancss = new CleanCSS(cleancssOptions);
    const cleancssResult = await cleancss.minify(node.data);
    node.data = cleancssResult.styles.trim();
    return node;
};

// Process node
// -----------------------------------------------------------------------------

const processNode = async (node, body) => {
    if (node.children && Array.isArray(node.children) && node.children.length) {
        node.children = await Promise.all(
            node.children.map(async (subnode) => {
                return node.type === "style"
                    ? await minifyNode(subnode, body)
                    : await processNode(subnode, body);
            })
        );
    }

    return node;
};

// Exports
// -----------------------------------------------------------------------------

module.exports = () => {
    return through.obj(async (file, encoding, callback) => {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            const err = "Streaming not supported";
            const msg = new PluginError(PLUGIN_NAME, err);
            return callback(msg);
        }

        const html = file.contents.toString();
        const tree = await treeParser.parse(html);
        const root = await firstChildByTag(tree, "html");
        const body = await firstChildByTag(root, "body");
        const bodyStr = await treeParser.serialize(body);

        if (
            (await hasAttribute(root, "⚡")) ||
            (await hasAttribute(root, "amp"))
        ) {
            try {
                const optimizedStr = await ampOptimizer.transformHtml(html);
                const optimizedObj = await treeParser.parse(optimizedStr);

                const minifiedObj = await processNode(optimizedObj, bodyStr);
                const minifiedStr = await treeParser.serialize(minifiedObj);

                file.contents = Buffer.from(minifiedStr);
                return callback(null, file);
            } catch (err) {
                const msg = new PluginError(PLUGIN_NAME, err);
                return callback(msg);
            }
        } else {
            return callback(null, file);
        }
    });
};
