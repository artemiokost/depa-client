import accessManager from "./modals/accessManager";
import breadcrumb from "./breadcrumb/breadcrumb";
import comment from "./comment";
import commentList from "./list/commentList";
import commentPage from "./pages/commentPage";
import post from "./post";
import postPage from "./pages/postPage";
import user from "./user";
import {combineReducers} from "redux";

export default combineReducers({
    accessManager,
    breadcrumb,
    comment,
    commentList,
    commentPage,
    post,
    postPage,
    user
})
