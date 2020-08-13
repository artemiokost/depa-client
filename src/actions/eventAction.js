import {store} from "../store/configureStore";
import {getCommentList} from "./commentListAction";

export const eventActionMap = new Map([
    ["CREATE_COMMENT", (payload) => handleCommentEvent(payload)],
    ["DELETE_COMMENT", (payload) => handleCommentEvent(payload)]
]);

const handleCommentEvent = (payload) => {
    getCommentList().call(this, store.dispatch);
    if (payload != null) {
        let {commentId, postId} = payload;
        if (store.getState().post.id === postId ||
            store.getState().commentPage.list.some(comment => comment.id === commentId)) {
            store.dispatch({type: "TOGGLE_COMMENT_UPDATE_FLAG"})
        }
    }
};

