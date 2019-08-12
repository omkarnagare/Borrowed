export interface Item {
    itemId?: string;
    itemName: string;
    itemDescription?: string;
    borrowingDate: string;
    itemImage?: string;
    isUrgent?: boolean;
    lendeeName?: string;
    lendeeContact?: string;
}
export interface LogInCredentials {
    email: string;
    password: string;
}