import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";
import {CATEGORY} from "../constants";

const DiscussionRouter = () => (
    <Switch>
        <Route exact path="/discussion/" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.DISCUSSION} {...props}/>}/>
        <Route exact path="/discussion/page/:number" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.DISCUSSION} {...props}/>}/>
        <Route exact path="/discussion/tag/:tagId" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.DISCUSSION} {...props}/>}/>
        <Route exact path="/discussion/tag/:tagId/page/:number/" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.DISCUSSION} {...props}/>}/>
    </Switch>
);

export default DiscussionRouter