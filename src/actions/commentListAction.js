import {request} from "../utils/APIUtils";
import {API_BASE_URL, DEFAULT_COMMENT_LIST_SIZE} from "../constants";

export const getCommentList = (indicator) => dispatch => {
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: "FETCH_COMMENT_LIST"});

    request({
        url: API_BASE_URL + "post/comment/list/" + DEFAULT_COMMENT_LIST_SIZE,
        method: "GET"
    }).then(response => {
        dispatch({type: "FETCH_COMMENT_LIST", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "FETCH_COMMENT_LIST", status: "ERROR", error})
    })
};
