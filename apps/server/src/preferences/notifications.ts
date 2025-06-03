export enum NotificationType {
    NEW_PASSWORD = 'newPassword',
    NEW_IP = 'newIp',
    NEW_DEVICE_LOGIN = 'newDeviceLogin',
    SHARED_ITEMS = 'sharedItems',
    REQUEST_ACCESS = 'requestAccess',
}

export interface NotificationPreferences { 
    id: number;
    userId: number;
    newlySharedItems: boolean;
    requestAccess: boolean;
}

export interface Notification {
    id: number;
    userId: number;
    type: NotificationType;
    message: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}
