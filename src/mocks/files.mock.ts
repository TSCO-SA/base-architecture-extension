export const APPFILES = {
    parentFolder: 'examples/app',
    destination: 'src/app',
    files: [
        {
            origin: 'app-routing.module.exel',
            destination: 'app-routing.module.ts'
        },
        {
            origin: 'app.component.exel',
            destination: 'app.component.html'
        }
    ]
};

export const DATAACESSFILES = {
    parentFolder: 'examples/core/base-data-access',
    destination: 'src/app/core/base-data-access',
    files: [
        {
            origin: 'data-access.module.exel',
            destination: 'data-access.module.ts'
        },
        {
            origin: 'data-access.service.exel',
            destination: 'data-access.service.ts'
        }
    ]
};

export const NOTIFICATIONFILES = {
    parentFolder: 'examples/shared/notification/',
    destination: 'src/app/shared/notification/',
    files: [
        {
            origin: 'notification.exel',
            destination: 'notification.ts'
        },
        {
            origin: 'notification.service.exel',
            destination: 'notification.service.ts'
        },
        {
            origin: 'notification-layout/notification-layout.component.css.exel',
            destination: 'notification-layout/notification-layout.component.css'
        },
        {
            origin: 'notification-layout/notification-layout.component.html.exel',
            destination: 'notification-layout/notification-layout.component.html'
        },
        {
            origin: 'notification-layout/notification-layout.component.exel',
            destination: 'notification-layout/notification-layout.component.ts'
        }
    ]
};