import * as fs from "fs";
import * as path from "path";
import { PASTAS } from "./mocks/pastas.mock";
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
  const regex = new RegExp("^.+?src" + sep + sep + "app" + sep + sep, "g");
  return url.replace(regex, "");
};
 
export const createFolders = (pathRoot:string)=> {
  const sep = path.sep;
  const result = creatDir(pathRoot);
  if(result !== undefined){
    PASTAS.map(item => {
      const auxPath = result + sep + item.pai;
     const resultPai = creatDir(auxPath);
      if(item.filho !== undefined && resultPai !== undefined){
        item.filho.map(itemFilho => {
          const auxPathFilho = auxPath + sep + itemFilho;
          creatDir(auxPathFilho);
        });
      }
    });
  }
};

 const creatDir = (path: string) => {
 const result =  fs.mkdirSync(path, { recursive: true  });
  return result;
};
