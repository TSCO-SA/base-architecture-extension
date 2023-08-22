"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configBaseFiles = exports.createEnvironments = exports.createAngularFiles = exports.verifyTerminal = exports.configFiles = exports.verifyDir = exports.createArchFolders = exports.createFeatureFolders = exports.generateAngularPath = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const folders_mock_1 = require("./mocks/folders.mock");
const environments_mock_1 = require("./mocks/environments.mock");
const generateAngularPath = (url) => {
    let newPath = isDirectory(url) ? url : path.dirname(url);
    //newPath = removeAngularRoot(newPath);
    return newPath + path.sep;
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
const createFeatureFolders = (pathRoot) => {
    const result = creatDir(path.resolve(pathRoot));
    if (result === undefined) {
        return;
    }
    folders_mock_1.FEATUREFOLDERS.map(item => {
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
exports.createFeatureFolders = createFeatureFolders;
const createArchFolders = (pathRoot) => {
    folders_mock_1.ARCHFOLDERS.map(item => {
        const auxPath = path.join(pathRoot, item.parent);
        const resultParent = creatDir(auxPath);
        if (item.child !== undefined && resultParent !== undefined) {
            item.child.map(child => {
                const auxPathChild = path.join(auxPath, child);
                creatDir(auxPathChild);
            });
        }
    });
};
exports.createArchFolders = createArchFolders;
const creatDir = (path) => {
    const result = fs.mkdirSync(path, { recursive: true });
    return result;
};
const verifyDir = (path) => {
    return fs.existsSync(path);
};
exports.verifyDir = verifyDir;
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
const verifyTerminal = (terminal) => {
    if (!terminal || terminal.exitStatus) {
        return vscode.window.createTerminal("Base File: Create");
    }
    return terminal;
};
exports.verifyTerminal = verifyTerminal;
const createAngularFiles = (terminal, url) => {
    console.log(url);
    const script = `ng g @schematics/angular:module ${removeAngularRoot(url)} --routing \n 
                    ng g @schematics/angular:component ${path.join(removeAngularRoot(url), 'components', 'containers', path.basename(url))}`;
    terminal.show();
    terminal.sendText(script);
};
exports.createAngularFiles = createAngularFiles;
const createEnvironments = (extensionRoot, url) => {
    const originUrl = path.join(extensionRoot, environments_mock_1.ENVIRONMENTS.parentFolder);
    const destinationUrl = path.join(url, environments_mock_1.ENVIRONMENTS.destination);
    if (!fs.existsSync(destinationUrl)) {
        creatDir(destinationUrl);
    }
    environments_mock_1.ENVIRONMENTS.files.forEach(element => {
        fs.copyFileSync(path.join(originUrl, element.origin), path.join(destinationUrl, element.destination));
    });
    fs.readFile(path.join(url, 'angular.json'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const angularFile = JSON.parse(data);
        const configurations = angularFile.projects[angularFile.defaultProject].architect.build.configurations;
        configurations.qa = environments_mock_1.qa;
        configurations.hml = environments_mock_1.hml;
        fs.writeFile(path.join(url, 'angular.json'), JSON.stringify(angularFile, null, 2), (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};
exports.createEnvironments = createEnvironments;
const configBaseFiles = (extensionRoot, url) => {
    const enumestinationUrl = path.join(url, 'base-enums', 'response.enum.ts');
    const modelDestinationUrl = path.join(url, 'base-models', 'response', 'response.model.ts');
    fs.readFile(path.join(extensionRoot, 'examples', 'response-model.exel'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        fs.writeFile(modelDestinationUrl, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
    fs.readFile(path.join(extensionRoot, 'examples', 'response-enum.exel'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        fs.writeFile(enumestinationUrl, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};
exports.configBaseFiles = configBaseFiles;
//# sourceMappingURL=util.js.map