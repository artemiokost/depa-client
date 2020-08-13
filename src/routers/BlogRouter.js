import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";
import {CATEGORY} from "../constants";

const BlogRouter = () => (
    <Switch>
        <Route exact path="/blog/" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.BLOG} {...props}/>}/>
        <Route exact path="/blog/page/:number" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.BLOG} {...props}/>}/>
        <Route exact path="/blog/tag/:tagId" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.BLOG} {...props}/>}/>
        <Route exact path="/blog/tag/:tagId/page/:number/" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.BLOG} {...props}/>}/>
    </Switch>
);

export default BlogRouter