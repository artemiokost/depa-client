import React, {Component, Fragment} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {debounce} from "lodash";
import {getUserSummaryByUserId, updateUserById} from "../actions/userAction";
import {request} from "../utils/APIUtils";
import {setStatus} from "../utils/FormValidatorHelper";
import {
    API_BASE_URL,
    EMAIL_REGEX,
    PASSWORD_REGEX,
    ROLE,
    USERNAME_REGEX
} from "../constants";

class ProfileConfig extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isBanned: this.props.userSummary.banned,
            isEditing: false,
            isEmail: false,
            isEmailHelp: false,
            isPassword: false,
            isSecurity: false,
            isUsername: false
        };
        this.email = React.createRef();
        this.emailInput = React.createRef();
        this.password = React.createRef();
        this.passwordInput = React.createRef();
        this.security = React.createRef();
        this.securityInput = React.createRef();
        this.username = React.createRef();
        this.usernameInput = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.updateFlag !== prevProps.updateFlag) {
            if (this.props.isAuthenticated) {
                let currentUserSummary = this.props.currentUserSummary;
                let emailValue = this.emailInput.current.value;
                if (currentUserSummary && emailValue !== currentUserSummary.email) {
                    this.setState({isEmailHelp: true})
                } else {
                    this.setState({isEmailHelp: false});
                }
            }
            this.props.getUserSummaryByUserId(this.props.userSummary.userId, false);
            this.setState({isEditing: false})
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkEmail = debounce(() => {
        if (this._isMounted) {
            let value = this.emailInput.current.value;
            if (value === this.props.userSummary.email) {
                this.setState({isEmail: true});
                setStatus(this.email.current).success();
                return
            }
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
            if (value === this.props.userSummary.username) {
                this.setState({isUsername: true});
                setStatus(this.username.current).success();
                return
            }
            if (USERNAME_REGEX.test(value)) {
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
    }, 1000);

    securityValidator = debounce(() => {
        if (PASSWORD_REGEX.test(this.securityInput.current.value)) {
            this.setState({isSecurity: true});
            setStatus(this.security.current).success()
        } else {
            this.setState({isSecurity: false});
            setStatus(this.security.current).danger()
        }
    }, 1000);

    toggleBanned = () => {
        let userId = this.props.userSummary.userId;
        let value = !this.state.isBanned;
        request({
            url: API_BASE_URL + "user/banned/" + userId + '/' + value,
            method: 'PUT'
        }).then(response => {
            this.setState({isBanned: !this.state.isBanned})
        })
    };

    toggleEditing = () => this.setState({isEditing: !this.state.isEditing});

    update = () => {
        let {userId, email, username} = this.props.currentUserSummary;
        let {isEmail ,isPassword, isSecurity, isUsername} = this.state;
        let emailValue = this.emailInput.current.value;
        let usernameValue = this.usernameInput.current.value;
        let passwordValue = this.passwordInput.current.value;
        let securityValue = this.securityInput.current.value;
        emailValue = isEmail && emailValue !== email ? emailValue : null;
        passwordValue = isPassword && passwordValue !== "defaultValue" ? passwordValue : null;
        usernameValue = isUsername && usernameValue !== username ? usernameValue : null;
        let condition = emailValue || passwordValue || usernameValue;
        if (condition && isSecurity) {
            let body = {
                authInfo: {
                    username: username,
                    password: securityValue
                },
                email: emailValue,
                username: usernameValue,
                password: passwordValue
            };
            this.props.updateById(userId, body)
        } else this.toggleEditing()
    };

    render() {
        let {inProcess, isAuthenticated, currentUserSummary, userSummary} = this.props;
        let {isBanned, isEditing, isEmail, isEmailHelp, isPassword, isSecurity, isUsername} = this.state;
        let {userId, email, username} = userSummary;
        let isAdministrator, hasAuthority;

        if (isAuthenticated) {
            hasAuthority = currentUserSummary.userId === userId;
            isAdministrator = currentUserSummary.roles.includes(ROLE.ADMINISTRATOR)
        }

        let renderSettings = () => {
            let bannedClassNames = classNames("far fa-lg", {"fa-toggle-on": isBanned}, {"fa-toggle-off": !isBanned});
            return (
                <div className="column summary">
                    <div className="field"><h2>Настройки</h2></div>
                    {!hasAuthority && isAdministrator ? <div className="field bi-line">
                        <div>Блокировка</div>
                        <a className="bi-line-item is-centered" onClick={this.toggleBanned}>
                            <i className={bannedClassNames}/></a>
                    </div> : null}
                </div>
            )
        };

        let renderSummary = () => (
            <Fragment>
                <div className="field">
                    Email: {email}
                    {isEmailHelp ? <p className="help is-success">"Письмо для подтверждения отправлено"</p> : null}
                </div>
                <div className="field">Имя пользователя: {username}</div>
                <div className="field">Пароль: ************</div>
            </Fragment>
        );

        let renderSummaryEditing = () => (
            <Fragment>
                <div className="field" ref={this.email}>
                    <label className="label">Email</label>
                    <div className="control has-icons-left has-icons-right">
                        <input className="input" type="email" defaultValue={email}
                               ref={this.emailInput} onInput={this.checkEmail}/>
                        <span className="icon is-small is-left"><i className="far fa-envelope"/></span>
                        <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                    </div>
                    <p className="help is-hidden">{!isEmail ? "Данный адрес электронной почты доступен" : null}</p>
                </div>
                <div className="field" ref={this.username}>
                    <label className="label">Имя пользователя</label>
                    <div className="control has-icons-right">
                        <input className="input" type="text" placeholder="Username" defaultValue={username}
                               ref={this.usernameInput} onInput={this.checkUsername}/>
                        <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                    </div>
                    <p className="help is-hidden">{!isUsername ? "Данное имя пользователя не доступно" : null}</p>
                </div>
                <div className="field" ref={this.password}>
                    <label className="label">Пароль</label>
                    <div className="control has-icons-left has-icons-right">
                        <input className="input" type="password" defaultValue="defaultValue"
                               ref={this.passwordInput} onInput={this.passwordValidator}/>
                        <span className="icon is-small is-left"><i className="far fa-lock"/></span>
                        <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                    </div>
                    <p className="help is-hidden">
                        {!isPassword ? "Пароль не удовлетворяет требованиям безопасности" : null}
                    </p>
                </div>
                <div className="field" ref={this.security}>
                    <label className="label">* Пароль для подтверждения</label>
                    <div className="control has-icons-left has-icons-right">
                        <input className="input" type="password" placeholder="Security" ref={this.securityInput}
                               onInput={this.securityValidator}/>
                        <span className="icon is-small is-left"><i className="far fa-lock"/></span>
                        <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                    </div>
                    <p className="help is-hidden">
                        {!isSecurity ? "Пароль неверен" : null}
                    </p>
                </div>
                {isSecurity ?
                    <button className={classNames("button is-success", {"is-loading": inProcess})}
                            onClick={this.update}>Подтвердить</button> :
                    <button className="button" onClick={this.toggleEditing}>Отмена</button>}
            </Fragment>
        );

        return (
            <div className="app-container">
                <div className="content profile my-1 p-1">
                    <div className="columns">
                        <div className="column summary is-4-desktop">
                            <div className="field">
                                <div className="bi-line">
                                    <h2>Данные пользователя</h2>
                                    {hasAuthority && !isEditing ?
                                        <a className="bi-line-item is-centered" title="Изменить"
                                           onClick={this.toggleEditing}><i className="far fa-pencil-alt"/></a> : null}
                                </div>
                            </div>
                            {hasAuthority && isEditing ? renderSummaryEditing() : renderSummary()}
                        </div>
                        {!hasAuthority && isAdministrator ? renderSettings() : null}
                    </div>
                </div>
            </div>
        )
    }
}

ProfileConfig.propTypes = {
    userSummary: PropTypes.any.isRequired
};

export default connect(
    state => ({
        inProcess: state.user.current.inProcess,
        isAuthenticated: state.user.current.accessToken !== null,
        updateFlag: state.user.current.updateFlag,
        currentUserSummary: state.user.current.userSummary
    }),
    dispatch => ({
        getUserSummaryByUserId: (userId, indicator) => dispatch(getUserSummaryByUserId(userId, indicator)),
        updateById: (userId, body) => dispatch(updateUserById(userId, body))
    })
) (ProfileConfig)
