import * as fs from "fs";
import * as path from "path";
import * as vscode from 'vscode';
import { FOLDERS } from "./mocks/folders.mock";
import { ENVIRONMENTS, hml, qa } from "./mocks/environments.mock";
import { FolderModel } from "./models/folder.model";
import { Result, Ok, Err} from "./result";

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
 
export const createFolders = (pathRoot: string, folders: FolderModel[], isFeature: boolean = true)=> {
    let result = creatDir(path.resolve(pathRoot));

    if(isFeature){
        if(result === undefined){
            return;
        }
    }
 

    folders.map(item => {
        const auxPath = isFeature && result
         ? path.join(result, item.parent) :  path.join(pathRoot, item.parent);
         
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

export const configBaseFiles = (extensionRoot: string , url: string) => {    
    const enumestinationUrl = path.join( url, 'base-enums','response.enum.ts');
    const modelDestinationUrl = path.join(url, 'base-models','response','response.model.ts');

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

const tryReadFile = (path: string): Result<string, null> =>  {
    try {
        return new Ok(fs.readFileSync(path, {encoding: 'utf8'}));
    } catch {
        //TODO: retornar erro em caso de peso errado
        return new Err(null);
    }
};


export const isNgInstalled = (): Result<null, string> => {
    const workspaceRoot =  getWorkspaceRoot();
    if(!workspaceRoot) {
        return new Err(
            "Could not find the path to the VS Code workspace, please open a folder to use this extension."
        );
    }

    const packageConfigPath = path.join(workspaceRoot, "package.json"); 
    if(!fs.existsSync(packageConfigPath)){
        return new Err(
            "Could not find the 'package.json' file. This extension can only be used within a node project.", 
        );
    }

    const ngConfigPath = path.join(workspaceRoot, "angular.json");
    if(!fs.existsSync(ngConfigPath)){
        return new Err(
            "Could not find the 'angular.json' file. This extension can only be used from within an angular workspace.", 
        );
    }

    const packageConfig = tryReadFile(packageConfigPath);
    if(packageConfig.isErr()) {
        return new Err("An unexpected error has occured"); ;
    }

    //Procurar chave angular no package json
    const configObject = JSON.parse(packageConfig.ok());
    const devDependencies: Record<string, string> = configObject.devDependencies;

    if(!isValidAngularVersion(devDependencies["@angular/cli"])){
        return new Err("The minimum angular version required to run this extension is Angular 13");
    }

    return new Ok(null);
};


const isValidAngularVersion = (version: string): boolean => {
    if(!version){ 
        return false;
    }
    const versionComponents = version.replace(/^[~^]/gi, "").split(".");
    const majorVersion = Number.parseInt(versionComponents[0]);
    
    return majorVersion >= 13;
};


export const getWorkspaceRoot = () => {
    const workspaces = vscode.workspace.workspaceFolders || [];

    if(workspaces.length ===  0){
        return null;
    }

    //TODO: Definir o que fazer no caso de ter mais de 1 workspace
    return workspaces[0].uri.fsPath;
};