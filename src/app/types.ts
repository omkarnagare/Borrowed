import { PIN_STATE, SIGN_IN_OPTIONS } from './constants';

export interface Item {
    // item information
    // to be retained
    itemId?: string;
    itemName?: string;
    itemDescription?: string;
    itemImage?: string;

    // to be deprecated
    borrowingDate?: string;
    lendeeName?: string;
    lendeeContact?: string;
    lendeeEmail?: string;

    //new parameters
    transactionType?: string;
    importance?: string;
    eventDate?: string;
    expectedReturnDate?: string;
    personName?: string;
    personContactNumber?: string;
    personEmail?: string;

    // maintenance information
    isActive?: boolean;
}

export interface SocialUserInfo {
    uid?: string;
    displayName: string;
    email: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    photoURL: string;
    signedInWith?: SIGN_IN_OPTIONS;
}

export interface UserInfo {
    name: string;
    email: string;
    profileImage?: string;
    pin?: string;
    signedInWith?: SIGN_IN_OPTIONS;
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