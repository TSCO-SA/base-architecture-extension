export const ENVIRONMENTS = {
    parentFolder: 'examples/environments',
    destination: 'src/environments',
    files: [
        {
            origin: 'prod.exel',
            destination: 'environment.prod.ts'
        },
        {
            origin: 'hml.exel',
            destination: 'environment.hml.ts'
        },
        {
            origin: 'qa.exel',
            destination: 'environment.qa.ts'
        },
        {
            origin: 'dev.exel',
            destination: 'environment.ts'
        }
    ]
};

export const hml = {
    fileReplacements: [
        {
          replace: 'src/environments/environment.ts',
          with: 'src/environments/environment.hml.ts'
        }
    ],
    outputHashing: 'all'
};

export const qa = {
    fileReplacements: [
        {
          replace: 'src/environments/environment.ts',
          with: 'src/environments/environment.qa.ts'
        }
    ],
    outputHashing: 'all'
};