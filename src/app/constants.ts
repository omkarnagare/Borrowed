export class BorrowedAppConstants {

    public static APP_NAME = "Borrowed";
    public static APP_VERSION = "1.0";

    // firestore
    public static USER_COLLECTION = "users";
    public static ITEMS_COLLECTION = "items";

    // firebase storage
    public static PROFILE_IMAGES_COLLECTION = "userProfiles";
    public static ITEM_IMAGES_COLLECTION = "items";

    //sqlite storage keys
    public static DEFAULT_APP_THEME ="purple";
    public static APP_THEME = "borrowed-theme";

    public static BASE64_IMAGE_PREFIX_DATA = "data:image/jpeg;base64,";
    public static USER_IMAGE_SUCCESS_MESSAGE = "Profile Image set successfully.";
    public static DEVICE_OFFLINE_MESSAGE = "Your device seems to be Offline. Borrowed may not work correctly. The app will exit now.";
    public static ERROR_MESSAGE = "Some Error Occurred. Please try again.";
    public static INVALID_FIELDS_MESSAGE = "Please fill all the fields with appropriate values.";
    public static PASSWORD_MISSMATCH_MESSAGE = "Passwords did not match. Please try again.";

    // themes
    public static THEMES = {
        "purple" : {
            primary : "rgb(66, 5, 197)",
            secondary: "rgb(144, 30, 236)",
            tertiary: "rgb(18, 117, 231)",
            light: "rgb(138, 209, 197)",
            medium: "rgb(74, 122, 150)",
            dark: "rgb(3, 20, 95)"
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