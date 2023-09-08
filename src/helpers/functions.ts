import * as fs from "fs";
import * as path from "path";
import { FEATUREFOLDERS } from "../mocks/folders.mock";
import { capitalizeFirstLetter, copyFiles, creatDir, getProjectName, getStyleExtension, getWorkspaceRoot, isValidAngularVersion, removeAngularRoot, tryReadFile, tryWriteFile } from "./util";
import { FolderModel } from "../models/folder.model";
import { ENVIRONMENTS, hml, qa } from "../mocks/environments.mock";
import { ExtensionConfig } from "../models/types";
import { Err, Ok, Result } from "../models/result";
import { APPFILES, CORESERVICESFILES, DATAACESSFILES, NOTIFICATIONFILES } from "../mocks/files.mock";
import { executeScript, executeWithCallBack } from "./terminal";
import { Files } from "../enums/files.enum";
import { Folders } from "../enums/folders.enum";
import { dependencies } from "../mocks/dependencies.mock";
import { DOCKERFILES } from "../mocks/docker-files.mock";

export const createFeatureFolders = (pathRoot: string)=> {
    const result = creatDir(path.resolve(pathRoot));
   
        if(result === undefined){
            return;
        }

    FEATUREFOLDERS.map(item => {
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

export const createArchFolders = (pathRoot: string, folders: FolderModel[])=> {
    
    folders.map(item => {
        const auxPath = path.join(pathRoot, item.parent);
         
        const resultParent = creatDir(auxPath);
        if(item.child !== undefined && resultParent !== undefined){
            item.child.map(child => {
                const auxPathChild = path.join(auxPath, child);
                creatDir(auxPathChild);
            });
        }
    });
};

export const configFiles = (extensionRoot: string , url: string) => {
    const name = path.basename(url);
    const facadeDestinationUrl = path.join(url, ( name + '.facade.ts'));
    const stateDestinationUrl = path.join(url, 'states',( name + '.state.ts'));
    const modelDestinationUrl = path.join(url, 'models',( name + '.model.ts'));
    
    fs.readFile(path.join(extensionRoot, Folders.exemples, 'facade.exel'), { encoding: 'utf8' }, (err, data) => {
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

    fs.readFile(path.join(extensionRoot, Folders.exemples, 'state.exel'), { encoding: 'utf8' }, (err, data) => {
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

    fs.readFile(path.join(extensionRoot, Folders.exemples, 'model.exel'), { encoding: 'utf8' }, (err, data) => {
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

export const configDockerFiles = (extensionRoot: string , url: string, name: string) => {
    // name = getProjectName(url).ok();

    DOCKERFILES.map((item) =>{
      let data = tryReadFile(path.join(extensionRoot, Folders.exemples, "docker", item.origin));
    if(data.isErr()) {return;}
    tryWriteFile( path.join(url, item.destination), data.ok(), name);
    });
  
};

export const createAngularFeatureFiles = (url: string) => {
    const script = `ng g @schematics/angular:module ${removeAngularRoot(url)} --routing \n 
                    ng g @schematics/angular:component ${path.join(removeAngularRoot(url), Folders.components, Folders.containers, path.basename(url))}`;

    executeScript(script);
};

export const createAngularArchFiles = () => {
    const script = `ng g @schematics/angular:module ${path.join(Folders.core,)} --module=app \n 
                    ng g @schematics/angular:module ${path.join(Folders.shared,)} \n 
                    ng g @schematics/angular:component ${path.join(Folders.core, Folders.components, 'aside')} --export \n
                    ng g @schematics/angular:component ${path.join(Folders.core, Folders.components, 'header')} --export \n
                    ng g @schematics/angular:component ${path.join(Folders.core, Folders.components, 'footer')} --export \n
                    ng g @schematics/angular:component ${path.join(Folders.layouts, 'auth')} \n
                    ng g @schematics/angular:component ${path.join(Folders.layouts, 'home')} 
                    `;

    executeScript(script);
};

export const createEnvironments = (extensionRoot: string, url: string) => {
    const originUrl = path.join(extensionRoot, ENVIRONMENTS.parentFolder);
    const destinationUrl = path.join(url, ENVIRONMENTS.destination);

    if(!fs.existsSync(destinationUrl)) {
        creatDir(destinationUrl);
    }

    ENVIRONMENTS.files.forEach(element => {
        fs.copyFileSync(path.join(originUrl, element.origin), path.join(destinationUrl, element.destination));
    });

    fs.readFile(path.join(url, Files.angularJson), { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        const angularFile = JSON.parse(data);
        const configurations = angularFile.projects[angularFile.defaultProject].architect.build.configurations;
        
        configurations.qa = qa;
        configurations.hml = hml;

        fs.writeFile(path.join(url, Files.angularJson), JSON.stringify(angularFile, null, 2), (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};

export const configBaseFiles = (extensionRoot: string , url: string) => {    
    const enumestinationUrl = path.join( url, Folders.baseenums, Files.responseEnum);
    const modelDestinationUrl = path.join(url, Folders.basemodels, Folders.response, Files.responseModel);

    fs.readFile(path.join(extensionRoot, Folders.exemples, Files.responseModelExel), { encoding: 'utf8' }, (err, data) => {
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

    fs.readFile(path.join(extensionRoot, 'examples', Files.responseEnumExel), { encoding: 'utf8' }, (err, data) => {
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

const findNgWorkspace = (currentRoot: string, level: number = 0): string | null  => {
    if(level > 2){
        return null;
    }

    const packageConfigPath = path.join(currentRoot, Files.packageJson); 
    const ngConfigPath = path.join(currentRoot, Files.angularJson); 

    if(fs.existsSync(packageConfigPath) && fs.existsSync(ngConfigPath)){
        return currentRoot;
    }

    const dirs  = fs.readdirSync(currentRoot, {encoding: 'utf8', withFileTypes: true})
                     .filter(dirEnt => dirEnt.isDirectory())
                     .map(dir => dir.name);

    for(const dir of dirs){
        const ngWorkspace = findNgWorkspace(path.join(currentRoot, dir), level + 1);
        if(ngWorkspace){
            return ngWorkspace;
        }
    }

    return null;
};

export const loadExtensionConfig = async (): Promise<Result<ExtensionConfig, string>> => {

    const workspaceRoot = await getWorkspaceRoot();
    if(!workspaceRoot) {
        return new Err(
            "Could not find the path to the VS Code workspace, please open a folder to use this extension."
        );
    }

    const ngWorkspace = findNgWorkspace(workspaceRoot); 
    if(!ngWorkspace){
        return new Err(
            "Could not find an Angular workspace in the selected VS Code workspace. This extension can only be used from a workspace with an Angular project.", 
        );
    }

    const packageConfig = tryReadFile(path.join(ngWorkspace, Files.packageJson));
    if(packageConfig.isErr()) {
        return new Err("An unexpected error has occured");
    }

    const configObject = JSON.parse(packageConfig.ok());
    const devDependencies: Record<string, string> = configObject.devDependencies;

    if(!isValidAngularVersion(devDependencies["@angular/cli"])){
        return new Err("The minimum angular version required to run this extension is Angular 13.");
    }

    return new Ok({
        workspaceRoot, 
        ngWorkspacePath: ngWorkspace
    });
};  

export const copyBaseFiles = (extensionRoot: string, url: string) => {
    //APP Files
    copyFiles(extensionRoot, url, APPFILES);

    //Data Access Files
    copyFiles(extensionRoot, url, DATAACESSFILES);

    //Core Services
    copyFiles(extensionRoot, url, CORESERVICESFILES);

    //Notification service
    const notificationUrl = path.join(url, NOTIFICATIONFILES.destination, Folders.notificationlayout);
    
    executeWithCallBack(`ng g c ${removeAngularRoot(notificationUrl)} --module=app`, url, () => {
        copyFiles(extensionRoot, url, NOTIFICATIONFILES);
    });
};

export const installDependencies = (extensionRoot: string, url: string) => {
    let script = '';

    dependencies.forEach((element, index) => {
        script += element;

        if(index < dependencies.length - 1){
            script += ' && ';
        }  
    });

    executeScript(script);

    //Change style.css / .scss
    const extensionType = getStyleExtension(url);

    if(extensionType.isErr()) {
        return;
    }

    const origin = path.join(extensionRoot, Folders.exemples, Files.styleExel);
    const destination = path.join(url, Folders.src, (Files.style + extensionType.ok()));

    fs.copyFileSync(origin, destination);     
};