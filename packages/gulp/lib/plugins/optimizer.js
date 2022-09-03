// @arfreelance/gulp-optimizer

const PLUGIN_NAME = "gulp-optimizer";

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
const ampOptimizer = AmpOptimizerClass.create({ maxHeroImageCount: 10 });

// Tree parser
// -----------------------------------------------------------------------------

const treeParserPath = resolve(ampOptimizerDir, "lib/TreeParser");
const treeParser = require(treeParserPath);

// Node utils
// -----------------------------------------------------------------------------

const { firstChildByTag, hasAttribute } = AmpOptimizerClass.NodeUtils;

// Minify node
// -----------------------------------------------------------------------------

const minifyNode = async (node, body, isAmp) => {
    if (
        !isAmp ||
        ("attribs" in node.parent &&
            ("amp-custom" in node.parent.attribs ||
                "amp-keyframes" in node.parent.attribs))
    ) {
        const purgecssOptions = {
            content: [{ raw: body, extension: "html" }],
            css: [{ raw: node.data }],
            safelist: [/^(html|:root)$/],
        };

        if (isAmp) {
            purgecssOptions.safelist.push(/amp(html)?-/);
        }

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

const processNode = async (node, body, isAmp) => {
    if (node.children && Array.isArray(node.children) && node.children.length) {
        node.children = await Promise.all(
            node.children.map(async (subnode) => {
                return node.type === "style"
                    ? await minifyNode(subnode, body, isAmp)
                    : await processNode(subnode, body, isAmp);
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

        const docStr = file.contents.toString();
        const docObj = await treeParser.parse(docStr);

        const htmlObj = await firstChildByTag(docObj, "html");
        const htmlStr = await treeParser.serialize(htmlObj);

        const bodyObj = await firstChildByTag(htmlObj, "body");
        const bodyStr = await treeParser.serialize(bodyObj);

        const isAmp =
            (await hasAttribute(htmlObj, "⚡")) ||
            (await hasAttribute(htmlObj, "amp"));

        try {
            let str = htmlStr;
            let obj = docObj;

            if (isAmp) {
                str = await ampOptimizer.transformHtml(str);
                obj = await treeParser.parse(str);
            }

            obj = await processNode(obj, bodyStr, isAmp);
            str = await treeParser.serialize(obj);

            file.contents = Buffer.from(str);
            return callback(null, file);
        } catch (err) {
            const msg = new PluginError(PLUGIN_NAME, err);
            return callback(msg);
        }
    });
};
