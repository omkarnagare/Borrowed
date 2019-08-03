export interface Item {
    itemId: string;
    itemName: string;
    itemDescription?: string;
    dateBorrowed: string;
    itemImage?: string;
    itemCategory?: string;
}
export interface LogInCredentials {
    email: string;
    password: string;
}