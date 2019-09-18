import { PIN_STATE } from './constants';

export interface Item {
    // item information
    itemId?: string;
    itemName: string;
    itemDescription?: string;
    borrowingDate: string;
    itemImage?: string;
    isUrgent?: boolean;
    lendeeName?: string;
    lendeeContact?: string;
    lendeeEmail?: string;

    // maintenance information
    isActive: boolean;
}

export interface SocialUserInfo {
    uid?: string;
    displayName: string;
    email: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    photoURL: string;
}

export interface UserInfo {
    name: string;
    email: string;
    profileImage?: string;
    pin?: string;
}
export interface LogInCredentials {
    email: string;
    password: string;
}
export interface EmailAttributes {
    message: string;
    subject: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    files?: string | string[];
}

export interface WhatsAppAttributes {
    message: string;
    image?: string;
    url?: string;
}

export interface InstagramAttributes {
    message: string;
    image?: string;
}

export interface FacebookAttributes {
    message: string;
    image?: string;
    url?: string;
}

export interface TwitterAttributes {
    message: string;
    image?: string;
    url?: string;
}

export interface GenericShare {
    message?: string;
    subject?: string;
    file?: string | string[];
    url?: string
}

export interface PinModalData {
    title?: string;
    expectedPIN?: string;
    pinSetupState?: PIN_STATE;
    pin?: string;
    verified?: boolean;
}