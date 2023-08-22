import * as fs from 'fs';
import * as path from 'path';

export const generateAngularPath = (url: string) => {
    let newPath = isDirectory(url) ? url : path.dirname(url);
    newPath = removeAngularRoot(newPath) + path.sep;

    return newPath;
};


const isDirectory = (path: string) => {
    return fs.lstatSync(path).isDirectory();
};

const removeAngularRoot = (url: string) => {
    const sep = path.sep;
    const regex = new RegExp('^.+?src' + sep + sep + 'app' + sep + sep,"g");
    return url.replace(regex, '');
};
