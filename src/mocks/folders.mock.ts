import { FolderModel } from "../models/folder.model";

export const FEATUREFOLDERS: FolderModel [] = [ 
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
    {
        parent: "helpers"
    },
    {
        parent: "directives"
    },
    {
        parent: "mocks"
    },
];

export const BASEFOLDERS: FolderModel [] = [ 
    {
        parent: "base-models",
        child: ["response"]
    },
    {
        parent: "base-enums"
    },
];