/**
 * Mandoc Default Template
 */

const path = require("path");
const slash = require('slash');
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
            const lead_section_id = uniqid.time();
            const abstract_section_id = uniqid.time();
            $('body').prepend('<section id="'
                + lead_section_id
                + '" class="lead"></section>');
            $('#' + lead_section_id).prepend($('h1').first());
            // $('#' + lead_section_id).after('<section id="'
            //     + abstract_section_id
            //     + '" class="abstract">abstract texts ...</section>');
            return $('body').html();
        });
    }
};
