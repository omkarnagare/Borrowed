export class BorrowedAppConstants {
    // firestore
    public static USER_COLLECTION = "users";
    public static ITEMS_COLLECTION = "items";

    // firebase storage
    public static PROFILE_IMAGES_COLLECTION = "userProfiles";
    public static ITEM_IMAGES_COLLECTION = "items";

    public static BASE64_IMAGE_PREFIX_DATA = "data:image/jpeg;base64,";
}

export enum ImageSourceType {
    CAMERA = 100,
    GALLERY = 101
}

export enum ImageType {
    USER_PROFILE = 200,
    ITEM = 201
}