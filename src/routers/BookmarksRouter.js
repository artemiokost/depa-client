import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";

const BookmarkRouter = () => (
    <Switch>
        <Route exact path="/bookmark/" render={(props) =>
            <PostPage management={true} bookmark={true} {...props}/>}/>
        <Route exact path="/bookmark/page/:number" render={(props) =>
            <PostPage management={true} bookmark={true} {...props}/>}/>
    </Switch>
);

export default BookmarkRouter