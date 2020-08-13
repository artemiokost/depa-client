export const API_BASE_URL = "https://localhost/";

export const GOOGLE_AD_SENSE_ID = "ca-pub-1111111111111111";

export const CATEGORY = {
    ALL: 0, ARTICLE: 1, BLOG: 2, NEWS: 3, DISCUSSION: 4
};

export const EVENT_TYPE_LIST = ["COMMENT", "MESSAGE"];

export const ROLE = {
    ADMINISTRATOR: "ADMINISTRATOR",
    CONTRIBUTOR: "CONTRIBUTOR",
    MODERATOR: "MODERATOR",
    USER: "USER"
};

export const TAG = {
    MOVIE: 1, OPINION: 2, OTHER: 3, REVIEW: 4, SCIENCE: 5, TECHNOLOGY: 6
};

export const DEFAULT_BIRTH_DATE = "1991-01-01 12:00:00";
export const DEFAULT_COMMENT_LIST_SIZE = 3;
export const DEFAULT_COMMENT_PAGE_SIZE = 16;
export const DEFAULT_POST_PAGE_SIZE = 8;
export const DEFAULT_SEARCH_PREVIEW_SIZE = 2;

export const EMPTY = "empty";

export const ABC_ONLY_REGEX = /^[A-Za-z ]+$/;
export const CHAR_ONLY_REGEX = /^[A-Za-zА-Яа-я ]+$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]*[a-z]{2}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,32}$/;
export const TAG_REGEX =  /^(?=.{2,24}$)[a-zA-Z0-9.\s]+$/;
export const URL_REGEX = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9]+-?)*[a-z0-9]+)(?:\.(?:[a-z0-9]+-?)*[a-z0-9]+)*(?:\.(?:[a-z]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/;
export const USERNAME_REGEX = /^(?=.{4,24}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9]+$/;
