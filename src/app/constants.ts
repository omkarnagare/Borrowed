export class BorrowedAppConstants {

    public static APP_NAME = "Borrowed";
    public static APP_VERSION = "1.0";

    // firestore
    public static USER_COLLECTION = "users";
    public static ITEMS_COLLECTION = "items";

    // firebase storage
    public static PROFILE_IMAGES_COLLECTION = "userProfiles";
    public static ITEM_IMAGES_COLLECTION = "items";

    public static BASE64_IMAGE_PREFIX_DATA = "data:image/jpeg;base64,";

    public static DEVICE_OFFLINE_MESSAGE = "Your device seems to be Offline. Borrowed may not work correctly. App will exit now.";
}

export enum ImageSourceType {
    FRONT_CAMERA = 100,
    BACK_CAMERA = 101,
    GALLERY = 102
}

export enum ImageType {
    USER_PROFILE = 200,
    ITEM = 201
}