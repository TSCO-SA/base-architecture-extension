"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAngularPath = void 0;
const fs = require("fs");
const path = require("path");
const generateAngularPath = (url) => {
    let newPath = isDirectory(url) ? url : path.dirname(url);
    newPath = removeAngularRoot(newPath) + path.sep;
    return newPath;
};
exports.generateAngularPath = generateAngularPath;
const isDirectory = (path) => {
    return fs.lstatSync(path).isDirectory();
};
const removeAngularRoot = (url) => {
    const sep = path.sep;
    const regex = new RegExp('^.+?src' + sep + sep + 'app' + sep + sep, "g");
    return url.replace(regex, '');
};
const configFiles = (url) => {
    const name = path.dirname(url);
    const facadeDestinationUrl = url + path.sep + name + '.facade.ts';
    const stateDestinationUrl = url + path.sep + 'state' + path.sep + name + '.facade.ts';
    //fs.copyFileSync('examples' + path.sep + 'state.ts', );
    fs.readFile('examples' + path.sep + 'facade.ts', { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        data = data.replace(/todo/gi, name);
        fs.writeFile(facadeDestinationUrl, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};
//# sourceMappingURL=util.js.map