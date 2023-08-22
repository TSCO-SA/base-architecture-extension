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
//# sourceMappingURL=util.js.map