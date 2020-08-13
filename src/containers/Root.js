import React from "react";
import Home from "../components/Home";
import NotFound from "./errors/NotFound";
import RootRouter from "../routers/RootRouter";
import UserRouter from "../routers/UserRouter";
import {Route, Switch} from "react-router-dom";
import PostRouter from "../routers/PostRouter";

const Root = () => (
    <div className="root-container">
        <Switch>
            <Route exact path="/" component={Home}/>

            <Route path="/post" component={PostRouter}/>
            <Route path="/user" component={UserRouter}/>
            <Route path="/" component={RootRouter}/>

            <Route component={() => <NotFound helmet={true}/>}/>
        </Switch>
    </div>
);

export default Root