import { FolderModel } from "../models/folder.model";

export const FOLDERS: FolderModel [] = [ 
    {
        parent: "components",
        child: ["containers","presentationals"]
    },
    {
        parent: "enums"
    },
    {
        parent: "api"
    },
    {
        parent: "states"
    },
    {
        parent: "pipes"
    },
    {
        parent: "models"
    },
];

