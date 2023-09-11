import { Files } from "../enums/files.enum";

export const DOCKERFILES = [
    {
        origin: 'docker-compose.exel',
        destination: Files.dockerCompose
    },
    {
        origin: 'docker-compose.dev.exel',
        destination: Files.dockerComposeDev
    },
    {
        origin: 'docker-compose.hml.exel',
        destination: Files.dockerComposeHml
    },
    {
        origin: 'docker-compose.qa.exel',
        destination: Files.dockerComposeQa
    },
    {
        origin: 'Dockerfile.exe',
        destination: Files.dockerFile
    },
    {
        origin: 'Dockerfile.dev.exel',
        destination: Files.dockerFileDev
    },
];