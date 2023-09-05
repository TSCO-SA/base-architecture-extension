import * as fs from "fs";
import * as path from "path";
import * as vscode from 'vscode';
import { Result, Ok, Err } from "../models/result";
import { Copy } from "../models/copy.model";
import { Files } from "../enums/files.enum";
import { ExtensionConfig } from "../models/types";

export const generateAngularPath = (url: string) => {
    let newPath = isDirectory(url) ? url : path.dirname(url);
    //newPath = removeAngularRoot(newPath);

    return newPath + path.sep;
};

export const isDirectory = (path: string) => {
    return fs.lstatSync(path).isDirectory();
};

export const removeAngularRoot = (url: string) => {
    const sep = url.includes('/') ? path.sep : path.sep + path.sep;
    const regex = new RegExp(`^.+?src${sep}app${sep}`, "g");
    return url.replace(regex, "");
};

export const creatDir = (path: string) => {
    const result =  fs.mkdirSync(path, { recursive: true  });
    
    return result;
};

export const verifyDir = (path: string) => {
    return fs.existsSync(path);
};

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const tryReadFile = (path: string): Result<string, null> =>  {
    try {
        return new Ok(fs.readFileSync(path, {encoding: 'utf8'}));
    } catch {
        //TODO: retornar erro em caso de peso errado
        return new Err(null);
    }
};
export const tryWriteFile = (path: string, data: string, name: string) =>  {
    data = data.replace(/todo/gm, name);

    fs.writeFile(path, data, (err) => {
        if (err) {
            console.error(err);
        }
    });
};

export const isValidAngularVersion = (version: string): boolean => {
    if(!version){ 
        return false;
    }
    const versionComponents = version.replace(/^[~^]/gi, "").split(".");
    const majorVersion = Number.parseInt(versionComponents[0]);
    
    return majorVersion >= 13;
};

export const getWorkspaceRoot = async () => {
    const workspaces = vscode.workspace.workspaceFolders || [];

    if(workspaces.length ===  0){
        return null;
    }

    if(workspaces.length === 1){
        return workspaces[0].uri.fsPath;
    }

    let quickPickItens: vscode.QuickPickItem[] = [];

    workspaces.forEach(element => {
        quickPickItens.push({label: element.name + ': ', description: element.uri.fsPath});
    });

    const selectedWorkspace =  await vscode.window.showQuickPick(quickPickItens, {
        canPickMany: false,
        placeHolder: "Select workspace to init"
    });

    return selectedWorkspace?.description || null;
};

export const copyFiles = (extensionRoot: string, url: string, copyList: Copy) => {
    const originUrl = path.join(extensionRoot, copyList.parentFolder);
    const destinationUrl = path.join(url, copyList.destination);

    copyList.files.forEach(element => {
        fs.copyFileSync(path.join(originUrl, element.origin), path.join(destinationUrl, element.destination));
    });
};

export const getStyleExtension = (urlRoot: string): Result<string, null> => {
    const angularFileData = tryReadFile(path.join(urlRoot, Files.angularJson));

    if(angularFileData.isErr()) {
        return new Err(null);
    }

    const angularFileObject = JSON.parse(angularFileData.ok());
    const styleExtension = angularFileObject.projects[angularFileObject.defaultProject].architect.build.options.inlineStyleLanguage;
    
    return new Ok(styleExtension);
};

export const getProjectName = (urlRoot: string): Result<string, null> => {
    const angularFileData = tryReadFile(path.join(urlRoot, Files.angularJson));
   
    if(angularFileData.isErr()) {
        return new Err(null);
    }
    const angularFileObject = JSON.parse(angularFileData.ok());
    
    return new Ok(angularFileObject);
};
