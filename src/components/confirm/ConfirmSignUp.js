import React, {Component, Fragment} from "react";
import Indicator from "../../containers/Indicator";
import {connect} from "react-redux";
import {confirmSignUp} from "../../actions/userAction";

class ConfirmSignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: this.props.match.params.token
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {token: nextProps.match.params.token}
    }

    componentDidMount() {
        this.props.closeAccessManager();
        this.props.confirmSignUp(this.state.token)
    }

    render() {
        let {inProcess, isAuthenticated} = this.props;

        let result = () => (
            isAuthenticated ?
                <Fragment>
                    <i className="far fa-check fa-7x"/>
                    <p style={{marginTop: "2rem"}}>Регистрация прошла успешно</p>
                </Fragment> :
                <Fragment>
                    <i className="far fa-exclamation-circle fa-7x"/>
                    <p style={{marginTop: "2rem"}}>Регистрация не удалась</p>
                </Fragment>
        );

        return (
            <Fragment>
                {inProcess ? <Indicator/> : null}
                {!inProcess ? <div className="column p-4 is-centered">{result()}</div> : null}
            </Fragment>
        )
    }
}

export default connect(
    state => ({
        inProcess: state.user.current.inProcess,
        isAuthenticated: state.user.current.accessToken !== null
    }),
    dispatch => ({
        closeAccessManager: () => dispatch({type: "CLOSE_ACCESS_MANAGER"}),
        confirmSignUp: (token) => dispatch(confirmSignUp(token))
    })
)(ConfirmSignUp)
