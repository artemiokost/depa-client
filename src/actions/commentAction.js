import {request} from "../utils/APIUtils";
import {API_BASE_URL} from "../constants";

export const createCommentByPostId = (postId, body) => dispatch => {
    // Indicator
    dispatch({type: "CREATE_COMMENT"});

    request({
        url: API_BASE_URL + "post/" + postId + "/comment",
        method: "POST",
        body: JSON.stringify(body)
    }).then(response => {
        dispatch({type: "CREATE_COMMENT", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "CREATE_COMMENT", status: "ERROR", error})
    })
};

export const deleteCommentById = (commentId) => dispatch => {
    request({
        url: API_BASE_URL + "post/comment/" + commentId,
        method: "DELETE"
    }).then(response => {
        dispatch({type: "DELETE_COMMENT", status: "SUCCESS", commentId})
    }).catch(error => {
        dispatch({type: "DELETE_COMMENT", status: "ERROR", error})
    })
};
