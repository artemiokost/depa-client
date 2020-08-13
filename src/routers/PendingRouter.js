import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";

const PendingRouter = () => (
    <Switch>
        <Route exact path="/pending/" render={(props) =>
            <PostPage management={true} pending={true} {...props}/>}/>
        <Route exact path="/pending/page/:number" render={(props) =>
            <PostPage management={true} pending={true} {...props}/>}/>
    </Switch>
);

export default PendingRouter