/**
 * Mandoc Default Template
 */

const path = require("path");
const slash = require('slash');
require.resolve('normalize.css');

module.exports = {
    main: "./layout/template.njk",
    cssBaseDir: "./source",
    jsBaseDir: "./source",
    helper: function (register) {
        register("normalizeCSS", slash(require.resolve('normalize.css')));
        register("mathjax", path.join(require.resolve('mathjax'), "../../MathJax.js"));
        register("highlightJs", path.join(require.resolve('highlight.js'), "../../styles/atelier-lakeside-light.css"));
    }
};
