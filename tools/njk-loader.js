const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

module.exports = {
    TemplateLoader: nunjucks.Loader.extend({
        async: true,
        init: function (searchPaths) {
            this.pathsToNames = {};
            if (searchPaths) {
                searchPaths = Array.isArray(searchPaths)
                    ? searchPaths : [searchPaths];
                this.searchPaths = searchPaths.map(path.normalize);
            } else {
                this.searchPaths = ['.'];
            }
        },
        getSource: function (name, callback) {
            const paths = this.searchPaths;
            const full_path = (function () {
                if (path.isAbsolute(name) && fs.existsSync(name)) {
                    return name;
                }
                for (let i = 0; i < paths.length; i++) {
                    const basePath = path.resolve(paths[i]);
                    const p = path.resolve(paths[i], name); // Only allow the current directory and anything
                    // underneath it to be searched
                    if (p.indexOf(basePath) === 0 && fs.existsSync(p)) {
                        return p;
                    }
                }
            })();

            if (!full_path) {
                return callback(null, null);
            }
            this.pathsToNames[full_path] = name;

            callback(null, {
                src: fs.readFileSync(full_path, 'utf-8'),
                path: full_path,
                noCache: true,
            });
        },
    }),
};