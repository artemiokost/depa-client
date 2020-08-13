import React, {Component, Fragment} from "react";
import Indicator from "../../containers/Indicator";
import {connect} from "react-redux";
import {confirmRecovery} from "../../actions/userAction";
import {setStatus} from "../../utils/FormValidatorHelper";
import {PASSWORD_REGEX} from "../../constants";

class ConfirmRecovery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isForm: true,
            isMatch: false,
            isPassword: false,
            token: this.props.match.params.token
        };
        this.match = React.createRef();
        this.password = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {token: nextProps.match.params.token}
    }

    componentDidMount() {
        this.props.closeAccessManager()
    }

    passwordValidator = () => {
        let passwordInput = this.password.current.children[1].firstElementChild.value;
        if (PASSWORD_REGEX.test(passwordInput)) {
            this.setState({isPassword: true});
            setStatus(this.password.current).success()
        } else {
            this.setState({isPassword: false});
            setStatus(this.password.current).danger()
        }
        this.passwordMatchValidator();
    };

    passwordMatchValidator = () => {
        let matchInput = this.match.current.children[1].firstElementChild.value;
        let passwordInput = this.password.current.children[1].firstElementChild.value;
        if (matchInput === passwordInput) {
            this.setState({isMatch: true});
            setStatus(this.match.current).success()
        } else {
            this.setState({isMatch: false});
            setStatus(this.match.current).danger()
        }
    };

    submit = () => {
        let password = this.password.current.children[1].firstElementChild.value;
        this.props.confirmRecovery(this.state.token, password);
        this.setState({isForm: false})
    };

    render() {
        let {inProcess, isAuthenticated} = this.props;
        let {isForm, isMatch, isPassword} = this.state;
        let isButton = isMatch && isPassword;

        let result = () => (isAuthenticated ?
                <Fragment>
                    <div className="p-2 is-centered"><i className="far fa-check fa-7x"/></div>
                    <p>Восстановление прошло успешно</p>
                </Fragment> :
                <Fragment>
                    <div className="p-2 is-centered"><i className="far fa-exclamation-circle fa-7x"/></div>
                    <p>Восстановление не удалось</p>
                </Fragment>
        );

        return (
            <Fragment>
                {isForm ?
                    <div className="column p-4 is-centered">
                        <div style={{width: 640}}>
                            <div className="field" ref={this.password}>
                                <label className="label">Новый пароль</label>
                                <div className="control has-icons-left has-icons-right">
                                    <input className="input" type="password" placeholder="Password"
                                           onInput={this.passwordValidator}/>
                                    <span className="icon is-small is-left"><i className="far fa-lock"/></span>
                                    <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                                </div>
                                <p className="help is-hidden">
                                    {this.state.isPassword ? "Пароль удовлетворяет требованиям безопасности" :
                                        "Пароль должен состоять из букв разного регистра, " +
                                        "хотя бы одной цифры и одного символа"}
                                </p>
                            </div>
                            <div className="field" ref={this.match}>
                                <label className="label">Подтвердить пароль</label>
                                <div className="control has-icons-left has-icons-right">
                                    <input className="input" type="password" placeholder="Confirm password"
                                           onInput={this.passwordMatchValidator}/>
                                    <span className="icon is-small is-left"><i className="far fa-lock"/></span>
                                    <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                                </div>
                                <p className="help is-hidden">
                                    {!this.state.isMatch ? "Пароль должен совпадать" : null}
                                </p>
                            </div>
                            <button className="button is-success" disabled={!isButton}
                                    onClick={this.submit}>Подтвердить</button>
                        </div>
                    </div> : null}
                {!isForm && inProcess ? <Indicator/> : null}
                {!isForm && !inProcess ?
                    <div className="column is-centered">
                        <div className="p-4">{result()}</div>
                    </div> : null}
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
        confirmRecovery: (token, newPassword) => dispatch(confirmRecovery(token, newPassword))
    })
)(ConfirmRecovery)
