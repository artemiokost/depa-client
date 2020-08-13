import React, {Component, Fragment} from "react";
import Indicator from "../../containers/Indicator";
import {connect} from "react-redux";
import {request} from "../../utils/APIUtils";
import {API_BASE_URL} from "../../constants";

class ConfirmEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inProcess: true,
            isResultSucceeded: false,
            token: this.props.match.params.token
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {token: nextProps.match.params.token}
    }

    componentDidMount() {
        this.props.closeAccessManager();
        if (this.props.isAuthenticated) {
            request({
                url: API_BASE_URL + "user/confirm/email",
                method: "POST",
                body: JSON.stringify({token: this.state.token})
            }).then(() => {
                this.setState({inProcess: false, isResultSucceeded: true})
            }).catch(() => {
                this.setState({inProcess: false, isResultSucceeded: false})
            })
        } else  {
            this.setState({inProcess: false})
        }
    }

    render() {
        let {inProcess, isResultSucceeded} = this.state;

        let result = () => (
            isResultSucceeded ?
                <Fragment>
                    <i className="far fa-check fa-7x"/>
                    <p style={{marginTop: "2rem"}}>Подтверждение прошло успешно</p>
                </Fragment> :
                <Fragment>
                    <i className="far fa-exclamation-circle fa-7x"/>
                    <p style={{marginTop: "2rem"}}>Подтверждение не удалось</p>
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
    state => ({isAuthenticated: state.user.current.accessToken !== null}),
    dispatch => ({closeAccessManager: () => dispatch({type: "CLOSE_ACCESS_MANAGER"})})
)(ConfirmEmail)
