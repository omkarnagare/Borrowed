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

    // themes
    public static THEMES = {
        "purple" : {
            primary : "#655A7C",
            secondary: "#AB92BF",
            tertiary: "#AFC1D6",
            light: "#CEF9F2",
            medium: "#D6CA98",
            dark: "#B89876"
        }, 
        "autumn" : {
            primary : "#F78154",
            secondary: "#4D9078",
            tertiary: "#B4436C",
            light: "#FDE8DF",
            medium: "#FCD0A2",
            dark: "#B89876"
        },
        "night" : {
            primary : "#8CBA80",
            secondary: "#FCFF6C",
            tertiary: "#FE5F55",
            light: "#BCC2C7",
            medium: "#F7F7FF",
            dark: "#495867"
        },
        "neon" : {
            primary : "#39BFBD",
            secondary: "#4CE0B3",
            tertiary: "#FF5E79",
            light: "#F4EDF2",
            medium: "#B682A5",
            dark: "#34162A"
        }
    }
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