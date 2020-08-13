import React from "react";
import Agreement from "../containers/Agreement";
import Privacy from "../containers/Privacy";
import Profile from "../components/Profile";
import ConfirmEmail from "../components/confirm/ConfirmEmail";
import ConfirmRecovery from "../components/confirm/ConfirmRecovery";
import ConfirmSignUp from "../components/confirm/ConfirmSignUp";
import {Route, Switch} from "react-router-dom";

const UserRouter = () => (
    <Switch>
        <Route exact path="/user/agreement" component={Agreement}/>
        <Route exact path="/user/confirm/email/:token" component={ConfirmEmail}/>
        <Route exact path="/user/confirm/recovery/:token" component={ConfirmRecovery}/>
        <Route exact path="/user/confirm/signUp/:token" component={ConfirmSignUp}/>
        <Route exact path="/user/privacy" component={Privacy}/>
        <Route exact path="/user/profile/:userId" component={Profile}/>
    </Switch>
);

export default UserRouter