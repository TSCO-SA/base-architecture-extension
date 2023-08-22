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

const configFiles = (url: string) => {
    const name = path.dirname(url);
    const facadeDestinationUrl = url + path.sep + name + '.facade.ts';
    const stateDestinationUrl = url + path.sep + 'state' + path.sep + name + '.facade.ts';
    //fs.copyFileSync('examples' + path.sep + 'state.ts', );

    
    fs.readFile('examples' + path.sep + 'facade.ts', { encoding: 'utf8' }, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        data = data.replace(/todo/gi, name);

        fs.writeFile(facadeDestinationUrl, data, (err) => {
            if (err) {
                console.error(err);
            }
        });
    });
};
