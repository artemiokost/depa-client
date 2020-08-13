import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";
import {CATEGORY} from "../constants";

const NewsRouter = () => (
    <Switch>
        <Route exact path="/news/" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.NEWS} {...props}/>}/>
        <Route exact path="/news/page/:number" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.NEWS} {...props}/>}/>
        <Route exact path="/news/tag/:tagId" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.NEWS} {...props}/>}/>
        <Route exact path="/news/tag/:tagId/page/:number" render={(props) =>
            <PostPage management={true} categoryId={CATEGORY.NEWS} {...props}/>}/>
    </Switch>
);

export default NewsRouter