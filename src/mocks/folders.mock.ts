import { Folders } from "../enums/folders.enum";
import { FolderModel } from "../models/folder.model";

export const FEATUREFOLDERS: FolderModel[] = [
  {
    parent: Folders.components,
    child: [Folders.containers, Folders.presentationals],
  },
  {
    parent: Folders.enums,
  },
  {
    parent: Folders.api,
  },
  {
    parent: Folders.states,
  },
  {
    parent: Folders.pipes,
  },
  {
    parent: Folders.models,
  },
  {
    parent: Folders.helpers,
  },
  {
    parent: Folders.directives,
  },
  {
    parent: Folders.mocks,
  },
];

export const ARCHFOLDERS: FolderModel[] = [
  {
    parent: Folders.basemodels,
    child: [Folders.response],
  },
  {
    parent: Folders.baseenums,
  },
  {
    parent: Folders.core,
    child: [
      Folders.basedataaccess,
      Folders.components,
      Folders.errors,
      Folders.guards,
      Folders.interceptors,
      Folders.services,
    ],
  },
  {
    parent: Folders.featuremodules,
  },
  {
    parent: Folders.layouts,
  },
  {
    parent: Folders.shared,
    child: [
      Folders.components,
      Folders.directives,
      Folders.helpers,
      Folders.notification,
      Folders.pipes,
      Folders.searchconfig,
      Folders.storage,
    ],
  },
];

export const ASSETSFOLDERS: FolderModel[] = [
  {
    parent: Folders.icons,
  },
  {
    parent: Folders.images,
  },
  {
    parent: Folders.logos,
  },
];
