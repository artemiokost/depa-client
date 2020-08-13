import {request} from "../utils/APIUtils";
import {store} from "../store/configureStore";
import {API_BASE_URL} from "../constants";

export const createPostByCategoryId = (categoryId, body, callback) => dispatch => {
    // Indicator
    dispatch({type: "CREATE_POST"});

    request({
        url: API_BASE_URL + "post/category/" + categoryId,
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "CREATE_POST", status: "SUCCESS", response});
        callback.call(this)
    }).catch(error => {
        dispatch({type: "CREATE_POST", status: "ERROR", error});
        callback.call(this)
    })
};

export const deletePostById = postId => dispatch => {
    // Indicator
    dispatch({type: "DELETE_POST"});

    request({
        url: API_BASE_URL + "post/" + postId,
        method: "DELETE"
    }).then(response => {
        dispatch({type: "DELETE_POST", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "DELETE_POST", status: "ERROR", error})
    })
};

export const getPostByUri = uri => dispatch => {
    // Indicator
    dispatch({type: "FETCH_POST"});

    let isAuthenticated = store.getState().user.current.accessToken != null;

    request({
        url: API_BASE_URL + "post/" + uri + (isAuthenticated ? "/tracking" : ''),
        method: "GET"
    }).then(response => {
        dispatch({type: "FETCH_POST", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "FETCH_POST", status: "ERROR", error})
    })
};

export const updatePostPendingById = (postId, value) => dispatch => {
    request({
        url: API_BASE_URL + "post/pending/" + postId + '/' + value,
        method: "PUT"
    }).then(() => {
        dispatch({type: "UPDATE_POST_PENDING", status: "SUCCESS", pending: value})
    }).catch(error => {
        dispatch({type: "UPDATE_POST_PENDING", status: "ERROR", error})
    })
};

export const updatePostById = (postId, body) => dispatch => {
    // Indicator
    dispatch({type: "UPDATE_POST"});

    request({
        url: API_BASE_URL + "post/" + postId,
        method: "PUT",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "UPDATE_POST", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "UPDATE_POST", status: "ERROR", error})
    })
};
