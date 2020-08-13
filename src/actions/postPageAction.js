import {request} from "../utils/APIUtils";
import {API_BASE_URL, CATEGORY, DEFAULT_SEARCH_PREVIEW_SIZE} from "../constants";

const switchActionType = (categoryId) => {
    switch (categoryId) {
        case CATEGORY.ARTICLE:
            return "FETCH_ARTICLE_PAGE";
        case CATEGORY.BLOG:
            return "FETCH_BLOG_PAGE";
        case CATEGORY.DISCUSSION:
            return "FETCH_DISCUSSION_PAGE";
        case CATEGORY.NEWS:
            return "FETCH_NEWS_PAGE";
        default:
            return "FETCH_POST_PAGE";
    }
};

export const getPostPageByBookmark = (number, size, value, indicator) => dispatch => {
    // Switch action type by category
    let actionType = switchActionType(CATEGORY.ALL);
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: actionType});

    request({
        url: API_BASE_URL + "post/page/" + number + '/' + size + "/bookmark/" + value,
        method: "GET"
    }).then(response => {
        dispatch({type: actionType, status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: actionType, status: "ERROR", error})
    })
};

export const getPostPageByCategoryId = (number, size, categoryId, indicator) => dispatch => {
    getPostPageByCategoryIdAndTargeting(number, size, categoryId, false, indicator).call(this, dispatch)
};

export const getPostPageByCategoryIdAndTargeting = (number, size, categoryId, targeting, indicator, callback) => dispatch => {
    // Switch action type by category
    let actionType = switchActionType(categoryId);
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: actionType});

    request({
        url: API_BASE_URL + "post/page/" + number + '/' + size + "/category/" + categoryId + (targeting ? "/targeting" : ''),
        method: "GET"
    }).then(response => {
        dispatch({type: actionType, status: "SUCCESS", response});
        callback && callback()
    }).catch(error => {
        dispatch({type: actionType, status: "ERROR", error});
        callback && callback()
    })
};

export const getPostPageByCategoryIdAndTagId = (number, size, categoryId, tagId, indicator) => dispatch => {
    // Switch action type by category
    let actionType = switchActionType(categoryId);
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: actionType});

    request({
        url: API_BASE_URL + "post/page/" + number + '/' + size + "/category/" + categoryId + "/tag/" + tagId,
        method: "GET"
    }).then(response => {
        dispatch({type: actionType, status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: actionType, status: "ERROR", error})
    })
};

export const getPostPageByMatch = (number, size, searchKey, indicator) => dispatch => {
    // Switch action type by category
    let actionType = switchActionType(CATEGORY.ALL);
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: actionType});

    request({
        url: API_BASE_URL + "post/page/" + number + '/' + size + "/match/" + searchKey,
        method: "GET"
    }).then(response => {
        dispatch({type: actionType, status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: actionType, status: "ERROR", error})
    })
};

export const getPostPageByPending = (number, size, pending, indicator) => dispatch => {
    // Switch action type by category
    let actionType = switchActionType(CATEGORY.ALL);
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: actionType});

    request({
        url: API_BASE_URL + "post/page/" + number + '/' + size + "/pending/" + pending,
        method: "GET"
    }).then(response => {
        dispatch({type: actionType, status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: actionType, status: "ERROR", error})
    })
};

export const getPostPageByTagId = (number, size, tagId, indicator) => dispatch => {
    // Switch action type by category
    let actionType = switchActionType(CATEGORY.ALL);
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: actionType});

    request({
        url: API_BASE_URL + "post/page/" + number + '/' + size + "/tag/" + tagId,
        method: "GET"
    }).then(response => {
        dispatch({type: actionType, status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: actionType, status: "ERROR", error})
    })
};

export const getPostPageByUserId = (number, size, userId, indicator) => dispatch => {
    // Switch action type by category
    let actionType = switchActionType(CATEGORY.ALL);
    indicator = !!(indicator || indicator == null);
    // Indicator
    if (indicator) dispatch({type: actionType});

    request({
        url: API_BASE_URL + "post/page/" + number + '/' + size + "/user/" + userId,
        method: "GET"
    }).then(response => {
        dispatch({type: actionType, status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: actionType, status: "ERROR", error})
    })
};

export const getPostSearchPreview = searchKey => dispatch => {
    // Indicator
    dispatch({type: "FETCH_SEARCH_PREVIEW"});

    request({
        url: API_BASE_URL + "post/page/" + 0 + '/' + DEFAULT_SEARCH_PREVIEW_SIZE + 1 + "/match/" + searchKey,
        method: "GET"
    }).then(response => {
        dispatch({type: "FETCH_SEARCH_PREVIEW", status: "SUCCESS", response})
    }).catch(error => {
        dispatch({type: "FETCH_SEARCH_PREVIEW", status: "ERROR", error})
    })
};