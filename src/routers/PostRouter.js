import React from "react";
import Creator from "../components/Creator";
import Post from "../components/Post";
import {Route, Switch} from "react-router-dom";

const PostRouter = () => (
    <Switch>
        <Route exact path="/post/creator" component={Creator}/>
        <Route exact path="/post/:uri" render={(props) => <Post {...props} path="/post/"/>}/>
        <Route exact path="/post/:uri/comment/page/:number" render={(props) => <Post {...props}/>}/>
    </Switch>
);

export default PostRouter