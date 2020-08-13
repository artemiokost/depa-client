import React, {Component} from "react";
import {connect} from "react-redux";
import {debounce} from "lodash"
import {request} from "../../utils/APIUtils";
import {setStatus} from "../../utils/FormValidatorHelper";
import {signUp} from "../../actions/userAction";
import {API_BASE_URL, EMAIL_REGEX, EMPTY, PASSWORD_REGEX, USERNAME_REGEX} from "../../constants";

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAgree: false,
            isEmail: false,
            isMatch: false,
            isUsername: false,
            isPassword: false
        };
        this.email = React.createRef();
        this.emailInput = React.createRef();
        this.match = React.createRef();
        this.matchInput = React.createRef();
        this.username = React.createRef();
        this.usernameInput = React.createRef();
        this.password = React.createRef();
        this.passwordInput = React.createRef();
        this._isMounted = false
    }

    checkAgree = (e) => {
        if (e.currentTarget.checked) {
            this.setState({isAgree: true});
        } else {
            this.setState({isAgree: false});
        }
    };

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    conditions = () => window.open("/user/agreement", "_blank");

    checkEmail = debounce(() => {
        if (this._isMounted) {
            let value = this.emailInput.current.value;
            if (EMAIL_REGEX.test(value)) {
                request({
                    url: API_BASE_URL + "user/check/email",
                    method: "POST",
                    body: JSON.stringify({email: value})
                }).then(response => {
                    this.setState({isEmail: response.status});
                    if (response.status) {
                        setStatus(this.email.current).success()
                    } else {
                        setStatus(this.email.current).danger()
                    }
                })
            } else {
                this.setState({isEmail: false});
                setStatus(this.email.current).danger()
            }
        }
    }, 1000);

    checkUsername = debounce(() => {
        if (this._isMounted) {
            let value = this.usernameInput.current.value;
            if (USERNAME_REGEX.test(value) && value !== EMPTY) {
                request({
                    url: API_BASE_URL + "user/check/username",
                    method: "POST",
                    body: JSON.stringify({username: value})
                }).then(response => {
                    this.setState({isUsername: response.status});
                    if (response.status) {
                        setStatus(this.username.current).success()
                    } else {
                        setStatus(this.username.current).danger()
                    }
                })
            } else {
                this.setState({isUsername: false});
                setStatus(this.username.current).danger()
            }
        }
    }, 1000);

    passwordValidator = debounce(() => {
        if (PASSWORD_REGEX.test(this.passwordInput.current.value)) {
            this.setState({isPassword: true});
            setStatus(this.password.current).success()
        } else {
            this.setState({isPassword: false});
            setStatus(this.password.current).danger()
        }
        this.passwordMatchValidator();
    }, 1000);

    passwordMatchValidator = debounce(() => {
        if (this.matchInput.current.value === this.passwordInput.current.value) {
            this.setState({isMatch: true});
            setStatus(this.match.current).success()
        } else {
            this.setState({isMatch: false});
            setStatus(this.match.current).danger()
        }
    }, 1000);

    submit = () => {
        let email = this.emailInput.current.value;
        let username = this.usernameInput.current.value;
        let password = this.passwordInput.current.value;
        this.props.signUp(email, username, password)
    };

    render() {
        let {isAgree, isEmail, isMatch, isUsername, isPassword} = this.state;
        let isButton = isAgree && isEmail && isMatch && isUsername && isPassword;

        return (
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Регистрация</p>
                    <button className="delete" onClick={this.props.toggleManager}/>
                </header>
                <section className="modal-card-body">
                    <div className="field" ref={this.email}>
                        <label className="label">Email</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="email" placeholder="Email"
                                   ref={this.emailInput} onInput={this.checkEmail}/>
                            <span className="icon is-small is-left"><i className="far fa-envelope"/></span>
                            <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                        </div>
                        <p className="help is-hidden">
                            {isEmail ? "Данный адрес электронной почты доступен" :
                                "Данный адрес электронной почты не доступен"}
                        </p>
                    </div>
                    <div className="field" ref={this.username}>
                        <label className="label">Имя пользователя</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="text" placeholder="Username"
                                   ref={this.usernameInput} onInput={this.checkUsername}/>
                            <span className="icon is-small is-left"><i className="far fa-user"/></span>
                            <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                        </div>
                        <p className="help is-hidden">
                            {isUsername ? "Данное имя пользователя доступно" : "Данное имя пользователя не доступно"}
                        </p>
                    </div>
                    <div className="field" ref={this.password}>
                        <label className="label">Пароль</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="password" placeholder="Password"
                                   ref={this.passwordInput} onInput={this.passwordValidator}/>
                            <span className="icon is-small is-left"><i className="far fa-lock"/></span>
                            <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                        </div>
                        <p className="help is-hidden">
                            {isPassword ? "Пароль удовлетворяет требованиям безопасности" :
                                "Пароль должен состоять из букв разного регистра, " +
                                "хотя бы одной цифры и одного символа"}
                        </p>
                    </div>
                    <div className="field" ref={this.match}>
                        <label className="label">Подтвердить пароль</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="password" placeholder="Confirm password"
                                   ref={this.matchInput} onInput={this.passwordMatchValidator}/>
                            <span className="icon is-small is-left"><i className="far fa-lock"/></span>
                            <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                        </div>
                        <p className="help is-hidden">
                            {!isMatch ? "Пароль должен совпадать" : null}
                        </p>
                    </div>
                    <div className="field">
                        <label className="checkbox"><input type="checkbox" onInput={this.checkAgree}/></label>
                        <label> Я согласен с <a onClick={this.conditions}>Условиями пользования</a></label>
                    </div>
                </section>
                <footer className="modal-card-foot" style={{minHeight: 64}}>
                    <button className="button is-success" disabled={!isButton}
                            onClick={this.submit}>Подтвердить</button>
                    <button className="button" onClick={this.props.managerSignIn}>Отмена</button>
                </footer>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        managerSignIn: () => dispatch({type: 'ACCESS_MANAGER_SIGN_IN'}),
        signUp: (email, username, password) => dispatch(signUp(email, username, password)),
        toggleManager: () => dispatch({type: 'TOGGLE_ACCESS_MANAGER'})
    })
)(SignUp)
