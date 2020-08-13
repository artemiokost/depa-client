import React from "react";
import Avatar from "../Avatar";
import {fromNow} from "../../utils/Helpers";
import {NavLink} from "react-router-dom";

const CommentListItem = ({content, createdAt, extra}) => {

    let {creatorSummary, post} = extra;
    let commentPreview = content.substr(0, 100);
    let titlePreview = post.title.substr(0, 60);
    commentPreview = commentPreview.length < 100 ? commentPreview : commentPreview.concat("...");
    titlePreview = titlePreview.length < 60 ? titlePreview : titlePreview.concat("...");

    return (
        <div className="media" style={{display: "flex", flexDirection: "column"}}>
            <div style={{display: "flex", alignItems: "center"}}>
                <NavLink to={"/user/profile/" + creatorSummary.userId} style={{marginRight: "0.5rem"}}>
                    <Avatar className="is-32x32" imageUrl={creatorSummary.imageUrl} username={creatorSummary.username}/>
                </NavLink>
                <small>
                    <NavLink to={"/user/profile/" + creatorSummary.userId}>@{creatorSummary.username}</NavLink> {fromNow(createdAt)}
                </small>
            </div>
            <div className="media-content">
                <p style={{margin: "0.5rem 0"}}>{commentPreview}</p>
                <NavLink to={"/post/" + post.uri}>{titlePreview}</NavLink>
            </div>
        </div>
    )
};

export default CommentListItem