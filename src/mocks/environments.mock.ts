import { Files } from "../enums/files.enum";
import { Folders } from "../enums/folders.enum";

export const ENVIRONMENTS = {
    parentFolder: `${Folders.exemples}/${Folders.environments}`,
    destination: `${Folders.src}/${Folders.environments}`,
    files: [
        {
            origin: 'prod.exel',
            destination: Files.environmentProd
        },
        {
            origin: 'hml.exel',
            destination: Files.environmentHml
        },
        {
            origin: 'qa.exel',
            destination: Files.environmentQa
        },
        {
            origin: 'dev.exel',
            destination: Files.environment
        }
    ]
};

export const hml = {
    fileReplacements: [
        {
          replace: `${Folders.src}/${Folders.environments}/${Files.environment}`,
          with: `${Folders.src}/${Folders.environments}/${Files.environmentHml}`
        }
    ],
    outputHashing: 'all'
};

export const qa = {
    fileReplacements: [
        {
          replace: `${Folders.src}/${Folders.environments}/${Files.environment}`,
          with: `${Folders.src}/${Folders.environments}/${Files.environmentQa}`
        }
    ],
    outputHashing: 'all'
};