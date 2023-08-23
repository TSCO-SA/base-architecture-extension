"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configFiles = exports.createFolders = exports.generateAngularPath = void 0;
const fs = require("fs");
const path = require("path");
const folders_mock_1 = require("./mocks/folders.mock");
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
    const result = creatDir(pathRoot);
    if (result === undefined) {
        return;
    }
    folders_mock_1.FOLDERS.map(item => {
        const auxPath = path.join(result, item.parent);
        const resultParent = creatDir(auxPath);
        if (item.child !== undefined && resultParent !== undefined) {
            item.child.map(child => {
                const auxPathChild = path.join(auxPath, child);
                creatDir(auxPathChild);
            });
        }
    });
};
exports.createFolders = createFolders;
const creatDir = (path) => {
    const result = fs.mkdirSync(path, { recursive: true });
    return result;
};
const configFiles = (extensionRoot, url) => {
    const name = path.basename(url);
    const facadeDestinationUrl = path.join(url, (name + '.facade.ts'));
    const stateDestinationUrl = path.join(url, 'states', (name + '.state.ts'));
    const modelDestinationUrl = path.join(url, 'models', (name + '.model.ts'));
    fs.readFile(path.join(extensionRoot, 'examples', 'facade.exel'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        data = data.replace(/Todo/gm, capitalizeFirstLetter(name));
        data = data.replace(/todo/gm, name);
        fs.writeFile(facadeDestinationUrl, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
    fs.readFile(path.join(extensionRoot, 'examples', 'state.exel'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        data = data.replace(/Todo/gm, capitalizeFirstLetter(name));
        data = data.replace(/todo/gm, name);
        fs.writeFile(stateDestinationUrl, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
    fs.readFile(path.join(extensionRoot, 'examples', 'model.exel'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        data = data.replace(/Todo/gm, capitalizeFirstLetter(name));
        fs.writeFile(modelDestinationUrl, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};
exports.configFiles = configFiles;
const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
//# sourceMappingURL=util.js.map