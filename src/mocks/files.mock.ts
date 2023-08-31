import { Files } from "../enums/files.enum";
import { Folders } from "../enums/folders.enum";

export const APPFILES = {
    parentFolder: `${Folders.exemples}/${Folders.app}`,
    destination: `${Folders.src}/${Folders.app}`,
    files: [
        {
            origin: `${Files.appRoutingModuleExel}`,
            destination: `${Files.appRoutingModule}`
        },
        {
            origin: `${Files.appComponentHtmlExel}`,
            destination: `${Files.appComponentHtml}`
        }
    ]
};

export const DATAACESSFILES = {
    parentFolder: `${Folders.exemples}/${Folders.core}/${Folders.basedataaccess}`,
    destination: `${Folders.src}/${Folders.app}/${Folders.core}/${Folders.basedataaccess}`,
    files: [
        {
            origin: `${Files.dataAccessModuleExel}`,
            destination: `${Files.dataAccessModule}`
        },
        {
            origin: `${Files.dataAccessServiceExel}`,
            destination: `${Files.dataAccessService}`
        }
    ]
};

export const CORESERVICESFILES = {
    parentFolder: `${Folders.exemples}/${Folders.core}/${Folders.services}`,
    destination: `${Folders.src}/${Folders.app}/${Folders.core}/${Folders.services}`,
    files: [
        {
            origin: `${Files.authDataServiceExel}`,
            destination: `${Files.authDataService}`
        }
    ]
};

export const NOTIFICATIONFILES = {
    parentFolder: `${Folders.exemples}/${Folders.shared}/${Folders.notification}/`,
    destination: `${Folders.src}/${Folders.app}/${Folders.shared}/${Folders.notification}/`,
    files: [
        {
            origin: `${Files.notificationExel}`,
            destination: `${Files.notification}`
        },
        {
            origin: `${Files.notificationServiceExel}`,
            destination: `${Files.notificationService}`
        },
        {
            origin: `${Folders.notificationlayout}/${Files.notificationLayoutHtmlExel}`,
            destination: `${Folders.notificationlayout}/${Files.notificationLayoutHtml}`
        },
        {
            origin: `${Folders.notificationlayout}/${Files.notificationLayoutExel}`,
            destination: `${Folders.notificationlayout}/${Files.notificationLayout}`
        }
    ]
};