const path = require("path");

module.exports = {
    main: "./layout/template.njk",
    cssBaseDir: "./source",
    jsBaseDir: "./source",
    helper: function (register) {
        register("mathjax", path.join(require.resolve('mathjax'), "../../MathJax.js"));
        register("highlightJs", path.join(require.resolve('highlight.js'), "../../styles/atelier-lakeside-light.css"));
    }
};
