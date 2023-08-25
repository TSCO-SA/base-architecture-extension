import * as fs from "fs";
import * as path from "path";
import * as vscode from 'vscode';
import { FOLDERS } from "./mocks/folders.mock";
import { ENVIRONMENTS, hml, qa } from "./mocks/environments.mock";

export const generateAngularPath = (url: string) => {
    let newPath = isDirectory(url) ? url : path.dirname(url);
    //newPath = removeAngularRoot(newPath);

    return newPath + path.sep;
};

const isDirectory = (path: string) => {
    return fs.lstatSync(path).isDirectory();
};

const removeAngularRoot = (url: string) => {
    const sep = path.sep;
    const regex = new RegExp("^.+?src" + sep + sep + "app" + sep + sep, "g");
    return url.replace(regex, "");
};
 
export const createFolders = (pathRoot: string)=> {
    const result = creatDir(path.resolve(pathRoot));

    if(result === undefined){
        return;
    }

    FOLDERS.map(item => {
        const auxPath = path.join(result, item.parent);
        const resultParent = creatDir(auxPath);
        if(item.child !== undefined && resultParent !== undefined){
            item.child.map(child => {
                const auxPathChild = path.join(auxPath, child);
                creatDir(auxPathChild);
            });
        }
    });
};

const creatDir = (path: string) => {
    const result =  fs.mkdirSync(path, { recursive: true  });
    return result;
};

export const verifyDir = (path: string) => {
    return fs.existsSync(path);
};

export const configFiles = (extensionRoot: string , url: string) => {
    const name = path.basename(url);
    const facadeDestinationUrl = path.join(url, ( name + '.facade.ts'));
    const stateDestinationUrl = path.join(url, 'states',( name + '.state.ts'));
    const modelDestinationUrl = path.join(url, 'models',( name + '.model.ts'));
    
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

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const verifyTerminal = (terminal: vscode.Terminal) => {
    if (!terminal || terminal.exitStatus) {
        return vscode.window.createTerminal("Base File: Create");
    }

    return terminal;
};

export const createAngularFiles = (terminal: vscode.Terminal, url: string) => {
    const script = `ng g @schematics/angular:module ${removeAngularRoot(url)} --routing \n 
                    ng g @schematics/angular:component ${path.join(removeAngularRoot(url), 'components', 'containers', path.basename(url))}`;

    terminal.show();
    terminal.sendText(script);
};

export const createEnvironments = (extensionRoot: string , url: string) => {
    const originUrl = path.join(extensionRoot, ENVIRONMENTS.parentFolder);
    const destinationUrl = path.join(url, ENVIRONMENTS.destination);

    if(!fs.existsSync(destinationUrl)) {
        creatDir(destinationUrl);
    }

    ENVIRONMENTS.files.forEach(element => {
        fs.copyFileSync(path.join(originUrl, element.origin), path.join(destinationUrl, element.destination));
    });

    fs.readFile(path.join(url, 'angular.json'), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const angularFile = JSON.parse(data);
        const configurations = angularFile.projects[angularFile.defaultProject].architect.build.configurations;
        
        configurations.qa = qa;
        configurations.hml = hml;

        fs.writeFile(path.join(url, 'angular.json'), JSON.stringify(angularFile, null, 2), (err) => {
            if (err) {
                console.error(err);
            }
        });
    });

    
};
