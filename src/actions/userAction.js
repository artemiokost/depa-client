import {request} from "../utils/APIUtils";
import {API_BASE_URL} from "../constants";

export const confirmRecovery = (token, password) => dispatch => {
    // Indicator
    dispatch({type: "SIGN_IN"});

    const body = {token: token, password: password};

    request({
        url: API_BASE_URL + "user/confirm/recovery",
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "SIGN_IN", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "SIGN_IN", status: "ERROR", error})
    })
};

export const confirmSignUp = (token) => dispatch => {
    // Indicator
    dispatch({type: "SIGN_IN"});

    const body = {token: token};

    request({
        url: API_BASE_URL + "user/confirm/signUp",
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "SIGN_IN", status: "SUCCESS", response})
        dispatch(getUserBookmarkList())
    }).catch(error => {
        dispatch({type: "SIGN_IN", status: "ERROR", error})
    })
};

export const getUserBookmarkList = size => dispatch => {
    size = size ? size : 100;
    request({
        url: API_BASE_URL + "post/bookmark/list/" + size,
        method: "GET"
    }).then(response => {
        dispatch({type: "UPDATE_USER_BOOKMARKS", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "UPDATE_USER_BOOKMARKS", status: "ERROR", error})
    })
};

export const getUserSummaryByUserId = (userId, indicator) => dispatch => {
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: "FETCH_USER_SUMMARY"});

    request({
        url: API_BASE_URL + "user/summary/" + userId,
        method: "GET"
    }).then(response => {
        dispatch({type: "FETCH_USER_SUMMARY", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "FETCH_USER_SUMMARY", status: "ERROR", error})
    })
};

export const recovery = (email) => dispatch => {
    // Indicator
    dispatch({type: "ACCESS_MANAGER_RESULT"});
    dispatch({type: "RECOVERY"});

    const body = {email: email};

    request({
        url: API_BASE_URL + "user/recovery",
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "ACCESS_MANAGER_RESULT", status: "SUCCESS"});
        dispatch({type: "RECOVERY", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "ACCESS_MANAGER_RESULT", status: "ERROR", error});
        dispatch({type: "RECOVERY", status: "ERROR", error})
    })
};

export const signIn = (username, password, rememberMe) => dispatch => {
    // Indicator
    dispatch({type: "ACCESS_MANAGER_RESULT"});
    dispatch({type: "SIGN_IN"});

    const body = {username: username, password: password, rememberMe: rememberMe};

    request({
        url: API_BASE_URL + "user/signIn",
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {
        if (!response.userSummary.banned) {
            dispatch({type: "ACCESS_MANAGER_RESULT", status: "SUCCESS"});
            dispatch({type: "SIGN_IN", status: "SUCCESS", response});
            dispatch(getUserBookmarkList())
        } else {
            return Promise.reject("User is banned!")
        }
    }).catch(error => {
        dispatch({type: "ACCESS_MANAGER_RESULT", status: "ERROR"});
        dispatch({type: "SIGN_IN", status: "ERROR", error})
    })
};

export const signUp = (email, username, password) => dispatch => {
    // Indicator
    dispatch({type: "ACCESS_MANAGER_RESULT"});
    dispatch({type: "SIGN_UP"});

    const body = {email: email, username: username, password: password};

    request({
        url: API_BASE_URL + "user/signUp",
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "ACCESS_MANAGER_RESULT", status: "SUCCESS"});
        dispatch({type: "SIGN_UP", status: "SUCCESS", response});
    }).catch(error => {
        dispatch({type: "ACCESS_MANAGER_RESULT", status: "ERROR"});
        dispatch({type: "SIGN_UP", status: "ERROR", error})
    })
};

export const updateUserById = (userId, body) => dispatch => {
    // Indicator
    dispatch({type: "UPDATE_USER"});

    request({
        url: API_BASE_URL + "user/" + userId,
        method: "PUT",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "UPDATE_USER", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "UPDATE_USER", status: "ERROR", error})
    })
};

export const updateUserProfileById = (profileId, body) => dispatch => {
    // Indicator
    dispatch({type: "UPDATE_USER_PROFILE"});

    request({
        url: API_BASE_URL + "user/profile/" + profileId,
        method: "PUT",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "UPDATE_USER_PROFILE", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "UPDATE_USER_PROFILE", status: "ERROR", error})
    })
};
