"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaceRoot = exports.isNgInstalled = exports.configBaseFiles = exports.createEnvironments = exports.createAngularArchFiles = exports.createAngularFeatureFiles = exports.verifyTerminal = exports.configFiles = exports.verifyDir = exports.createArchFolders = exports.createFeatureFolders = exports.generateAngularPath = void 0;
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const folders_mock_1 = require("./mocks/folders.mock");
const environments_mock_1 = require("./mocks/environments.mock");
const result_1 = require("./result");
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
    const sep = url.includes('/') ? path.sep : path.sep + path.sep;
    const regex = new RegExp(`^.+?src${sep}app${sep}`, "g");
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
const createArchFolders = (pathRoot, folders) => {
    folders.map(item => {
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
const createAngularFeatureFiles = (terminal, url) => {
    const script = `ng g @schematics/angular:module ${removeAngularRoot(url)} --routing \n 
                    ng g @schematics/angular:component ${path.join(removeAngularRoot(url), 'components', 'containers', path.basename(url))}`;
    terminal.show();
    terminal.sendText(script);
};
exports.createAngularFeatureFiles = createAngularFeatureFiles;
const createAngularArchFiles = (terminal, url) => {
    const script = `ng g @schematics/angular:module ${path.join('core')} --routing \n 
                    ng g @schematics/angular:module ${path.join('shared')} --routing \n 
                    ng g @schematics/angular:component ${path.join('core', 'components', 'aside')} --export \n
                    ng g @schematics/angular:component ${path.join('core', 'components', 'header')} --export \n
                    ng g @schematics/angular:component ${path.join('core', 'components', 'footer')} --export \n
                    ng g @schematics/angular:component ${path.join('layout', 'auth')} \n
                    ng g @schematics/angular:component ${path.join('layout', 'home')} 
                    `;
    terminal.show();
    terminal.sendText(script);
};
exports.createAngularArchFiles = createAngularArchFiles;
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
    fs.readFile(path.join(extensionRoot, 'examples', 'response.model.exel'), { encoding: 'utf8' }, (err, data) => {
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
    fs.readFile(path.join(extensionRoot, 'examples', 'response.enum.exel'), { encoding: 'utf8' }, (err, data) => {
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
const tryReadFile = (path) => {
    try {
        return new result_1.Ok(fs.readFileSync(path, { encoding: 'utf8' }));
    }
    catch {
        //TODO: retornar erro em caso de peso errado
        return new result_1.Err(null);
    }
};
const isNgInstalled = () => {
    const workspaceRoot = (0, exports.getWorkspaceRoot)();
    if (!workspaceRoot) {
        return new result_1.Err("Could not find the path to the VS Code workspace, please open a folder to use this extension.");
    }
    const packageConfigPath = path.join(workspaceRoot, "package.json");
    if (!fs.existsSync(packageConfigPath)) {
        return new result_1.Err("Could not find the 'package.json' file. This extension can only be used within a node project.");
    }
    const ngConfigPath = path.join(workspaceRoot, "angular.json");
    if (!fs.existsSync(ngConfigPath)) {
        return new result_1.Err("Could not find the 'angular.json' file. This extension can only be used from within an angular workspace.");
    }
    const packageConfig = tryReadFile(packageConfigPath);
    if (packageConfig.isErr()) {
        return new result_1.Err("An unexpected error has occured");
        ;
    }
    //Procurar chave angular no package json
    const configObject = JSON.parse(packageConfig.ok());
    const devDependencies = configObject.devDependencies;
    if (!isValidAngularVersion(devDependencies["@angular/cli"])) {
        return new result_1.Err("The minimum angular version required to run this extension is Angular 13");
    }
    return new result_1.Ok(null);
};
exports.isNgInstalled = isNgInstalled;
const isValidAngularVersion = (version) => {
    if (!version) {
        return false;
    }
    const versionComponents = version.replace(/^[~^]/gi, "").split(".");
    const majorVersion = Number.parseInt(versionComponents[0]);
    return majorVersion >= 13;
};
const getWorkspaceRoot = () => {
    const workspaces = vscode.workspace.workspaceFolders || [];
    if (workspaces.length === 0) {
        return null;
    }
    //TODO: Definir o que fazer no caso de ter mais de 1 workspace
    return workspaces[0].uri.fsPath;
};
exports.getWorkspaceRoot = getWorkspaceRoot;
//# sourceMappingURL=util.js.map