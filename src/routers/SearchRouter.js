import React from "react";
import PostPage from "../components/pages/PostPage";
import {Route, Switch} from "react-router-dom";

const SearchRouter = () => (
    <Switch>
        <Route exact path="/search/:searchKey" render={(props) =>
            <PostPage management={true} {...props}/>}/>
        <Route exact path="/search/:searchKey/page/:number" render={(props) =>
            <PostPage management={true} {...props}/>}/>
    </Switch>
);

export default SearchRouter