"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFolders = exports.generateAngularPath = void 0;
const fs = require("fs");
const path = require("path");
const pastas_mock_1 = require("./mocks/pastas.mock");
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
    const regex = new RegExp("^.+?src" + sep + sep + "app" + sep + sep, "g");
    return url.replace(regex, "");
};
const createFolders = (pathRoot) => {
    const sep = path.sep;
    const result = creatDir(pathRoot);
    if (result !== undefined) {
        pastas_mock_1.PASTAS.map(item => {
            const auxPath = result + sep + item.pai;
            const resultPai = creatDir(auxPath);
            if (item.filho !== undefined && resultPai !== undefined) {
                item.filho.map(itemFilho => {
                    const auxPathFilho = auxPath + sep + itemFilho;
                    creatDir(auxPathFilho);
                });
            }
        });
    }
};
exports.createFolders = createFolders;
const creatDir = (path) => {
    const result = fs.mkdirSync(path, { recursive: true });
    return result;
};
//# sourceMappingURL=util.js.map