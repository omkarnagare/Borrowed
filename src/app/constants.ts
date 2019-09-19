export class BorrowedAppConstants {

    public static APP_NAME = "Borrowed";
    public static APP_VERSION = "1.0.0";
    public static SUPPORT_EMAIL = "omtechnologies.apps@gmail.com";

    //pin modal keys
    public static PIN_MODAL_TITLE_KEY = "title";
    public static EXPECTED_PIN_KEY = "expectedPIN";
    public static PIN_SET_UP_STATE_KEY = "pinSetupState";
    public static PIN_KEY = "pin";
    public static PIN_VERIFIED_KEY = "verified";

    // firestore
    public static USER_COLLECTION = "users";
    public static ITEMS_COLLECTION = "items";

    // firebase storage
    public static PROFILE_IMAGES_COLLECTION = "userProfiles";
    public static ITEM_IMAGES_COLLECTION = "items";

    //sqlite storage keys
    public static DEFAULT_APP_THEME = "blue";
    public static APP_THEME = "settings.borrowedTheme";

    //google pay info
    public static GOOGLE_PAY_ID = "omkar.balkrishan@okhdfcbank";

    //login 
    public static NO_USER_FOUND_CODE = "auth/user-not-found";
    public static NO_USER_FOUND_MESSAGE = "No such user exists. Please sign up to create new user.";
    public static WRONG_PASSWORD_CODE = "auth/wrong-password";
    public static WRONG_PASSWORD_MESSAGE = "Wrong Password. Please try again.";
    public static USER_DISABLED_CODE = "auth/user-disabled";
    public static USER_DISABLED_MESSAGE = "This user account is deactivated. Please sign up to create new user.";
    public static INVALID_USER_EMAIL_CODE = "auth/invalid-email";
    public static INVALID_USER_EMAIL_MESSAGE = "Invalid Email. Please try again with correct email.";
    public static EMAIL_ALREADY_IN_USE_CODE = "auth/email-already-in-use";
    public static EMAIL_ALREADY_IN_USE_MESSAGE = "The user already exists. Try logging in or use forgot password to continue.";
    public static EMAIL_NOT_ENABLED_CODE = "auth/operation-not-allowed";
    public static EMAIL_NOT_ENABLED_MESSAGE = "This method of authentication is not enabled.";
    public static WEAK_PASSWORD_CODE = "auth/weak-password";
    public static WEAK_PASSWORD_MESSAGE = "Weak Password. Please try again.";
    public static LOGIN_FAILED_MESSAGE = "Log In failed. Please try again";

    // general constants
    public static DEFAULT_ITEM_IMAGE = "/assets/unknown-item.svg";
    public static BASE64_IMAGE_PREFIX_DATA = "data:image/jpeg;base64,";
    public static USER_IMAGE_SUCCESS_MESSAGE = "Profile Image set successfully.";
    public static ITEM_IMAGE_SUCCESS_MESSAGE = "Item Image set successfully.";
    public static DEVICE_OFFLINE_MESSAGE = "Your device seems to be Offline. Borrowed may not work correctly. The app will exit now.";
    public static ERROR_MESSAGE = "Some Error Occurred. Please try again.";
    public static INVALID_FIELDS_MESSAGE = "Please fill all the fields with appropriate values.";
    public static PASSWORD_MISSMATCH_MESSAGE = "Passwords did not match. Please try again.";
    public static INTERSTITIAL_AD_TIMEOUT = 1000 * 60 * 2;

    // themes
    public static THEMES = {
        "neon": {
            primary: "#39BFBD",
            secondary: "#4CE0B3",
            tertiary: "#FF5E79",
            light: "#F4EDF2",
            medium: "#B682A5",
            dark: "#34162A"
        },
        "light-purple": {
            primary: "#655A7C",
            secondary: "#AB92BF",
            tertiary: "#AFC1D6",
            light: "#CEF9F2",
            medium: "#D6CA98",
            dark: "#B89876"
        },
        "blue": {
            primary: "rgb(66, 5, 197)",
            secondary: "rgb(144, 30, 236)",
            tertiary: "rgb(18, 117, 231)",
            light: "rgb(138, 209, 197)",
            medium: "rgb(74, 122, 150)",
            dark: "rgb(3, 20, 95)"
        },
        "pink": {
            primary: "#F49097",
            secondary: "#DFB2F4",
            tertiary: "#F5E960",
            light: "#F2F5FF",
            medium: "#55D6C2",
            dark: "#B89876"
        },
        "green": {
            primary: "#386641",
            secondary: "#6A994E",
            tertiary: "#A7C957",
            light: "#F2E8CF",
            medium: "#BC4749",
            dark: "#B89876"
        },
        "color-combo": {
            primary: "#080708",
            secondary: "#3772FF",
            tertiary: "#DF2935",
            light: "#FDCA40",
            medium: "#E6E8E6",
            dark: "#B89876"
        },
        "black": {
            primary: "#32373B",
            secondary: "#4A5859",
            tertiary: "#F4D6CC",
            light: "#F4B860",
            medium: "#C83E4D",
            dark: "#B89876"
        },
        "dark-purple": {
            primary: "#210124",
            secondary: "#750D37",
            tertiary: "#B3DEC1",
            light: "#DBF9F0",
            medium: "#F7F9F7",
            dark: "#B89876"
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

export enum UserState {
    LOG_IN = 300,
    SIGN_UP = 301,
    FORGOT_PASSWORD = 302
}

export enum PIN_STATE {
    SET_PIN = 400,
    CHANGE_PIN = 401,
    VERIFY_PIN = 402,
    REMOVE_PIN = 403
}