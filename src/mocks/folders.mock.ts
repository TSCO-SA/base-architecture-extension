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

export const ARCHFOLDERS: FolderModel [] = [ 
    {
        parent: "base-models",
        child: ["response"]
    },
    {
        parent: "base-enums"
    },
    {
        parent: "core",
        child:["base-data-access","components","errors","guards","interceptors","services"]
    },
    {
        parent: "feature-modules",
    },
    {
        parent: "layouts",
    },
    {
        parent: "shared",
        child: ["components","directives","helpers","notification","pipes","search-config","storage"]
    },
];

export const ASSETSFOLDERS: FolderModel [] = [ 
    {
        parent: "icons",
    },
    {
        parent: "images",
    },
    {
        parent: "logos",
    },
];