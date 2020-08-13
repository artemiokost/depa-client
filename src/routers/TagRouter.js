import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";

const TagRouter = () => (
    <Switch>
        <Route exact path="/tag/:tagId" render={(props) =>
            <PostPage management={true} {...props}/>}/>
        <Route exact path="/tag/:tagId/page/:number" render={(props) =>
            <PostPage management={true} {...props}/>}/>
    </Switch>
);

export default TagRouter