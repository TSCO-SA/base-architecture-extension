export interface Copy {
    parentFolder: string,
    destination: string,
    files: Array<CopyFilesModel>
}

interface CopyFilesModel {
    origin: string,
    destination: string,
}
