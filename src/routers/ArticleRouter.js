import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";
import {CATEGORY} from "../constants";

const ArticleRouter = () => (
    <Switch>
        <Route exact path="/article/" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.ARTICLE} {...props}/>}/>
        <Route exact path="/article/page/:number" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.ARTICLE} {...props}/>}/>
        <Route exact path="/article/tag/:tagId" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.ARTICLE} {...props}/>}/>
        <Route exact path="/article/tag/:tagId/page/:number/" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.ARTICLE} {...props}/>}/>
    </Switch>
);

export default ArticleRouter