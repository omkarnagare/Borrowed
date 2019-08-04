export interface Item {
    itemId?: string;
    itemName: string;
    itemDescription?: string;
    dateBorrowed: string;
    itemImage?: string;
    isUrgent?: boolean;
}
export interface LogInCredentials {
    email: string;
    password: string;
}