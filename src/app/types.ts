export interface Item {
    itemId?: string;
    itemName: string;
    itemDescription?: string;
    borrowingDate: string;
    itemImage?: string;
    isUrgent?: boolean;
    lendeeName?: string;
    lendeeContact?: string;
    lendeeEmail?: string;
}

export interface UserInfo {
    name: string;
    email: string;
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

export interface GenericShare {
    message?: string;
    subject?: string;
    file?: string | string[];
    url?: string
}