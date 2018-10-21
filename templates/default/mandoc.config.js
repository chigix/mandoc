/**
 * Mandoc Default Template
 */

const path = require("path");
const slash = require('slash');
const nunjucks_runtime = require('nunjucks').runtime;
const cheerio = require('cheerio');
const uniqid = require('uniqid');


module.exports = {
    main: "./layout/template.njk",
    cssBaseDir: "./source",
    jsBaseDir: "./source",
    preferCssPageSize: true,
    helper: function (register) {
        register("twoColumnLayout", false);
        register("normalizeCSS", slash(require.resolve('normalize.css')));
        register("mathjax", path.join(require.resolve('mathjax'), "../../MathJax.js"));
        register("highlightJs", path.join(require.resolve('highlight.js'), "../../styles/atelier-lakeside-light.css"));
        register("separateTitle", function (html) {
            const $ = cheerio.load('<body>' + html + '</body>');
            const lead_dom_id = uniqid.time();
            const abstract_dom_id = uniqid.time();
            $('body').prepend('<section id="'
                + lead_dom_id
                + '" class="lead"></section>');
            $('#' + lead_dom_id).prepend($('h1').first());
            // $('#' + lead_dom_id).after('<section id="'
            //     + abstract_dom_id
            //     + '" class="abstract">abstract texts ...</section>');
            return new nunjucks_runtime.SafeString($('body').html());
        });
    }
};
