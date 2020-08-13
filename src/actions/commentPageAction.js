import {request} from "../utils/APIUtils";
import {API_BASE_URL} from "../constants";

export const getCommentPageByPostId = (number, size, postId, indicator) => dispatch => {
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: "FETCH_COMMENT_PAGE"});

    request({
        url: API_BASE_URL + "post/" + postId + "/comment/page/" + number + "/" + size,
        method: "GET"
    }).then(response => {
        dispatch({type: "FETCH_COMMENT_PAGE", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "FETCH_COMMENT_PAGE", status: "ERROR", error})
    })
};
