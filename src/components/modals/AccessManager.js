import React, {Component} from "react";
import Recovery from "./Recovery";
import Result from "./AuthResult";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import {connect} from "react-redux";

class AccessManager extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        let {isOpen, isRecovery, isResult, isSignIn, isSignUp} = this.props;

        return (
            <div className={isOpen ? "modal is-active" : "modal"}>
                <div className="modal-background"/>
                {isResult ? <Result/> : null}
                {!isResult && isRecovery ? <Recovery/> : null}
                {!isResult && isSignIn ? <SignIn/> : null}
                {!isResult && isSignUp ? <SignUp/> : null}
            </div>
        )
    }
}

export default connect(
    state => ({
        isOpen: state.accessManager.isOpen,
        isRecovery: state.accessManager.isRecovery,
        isResult: state.accessManager.isResult,
        isSignIn: state.accessManager.isSignIn,
        isSignUp: state.accessManager.isSignUp
    })
)(AccessManager)
