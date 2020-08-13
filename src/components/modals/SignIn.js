import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {signIn} from "../../actions/userAction";

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.username = React.createRef();
        this.password = React.createRef();
        this.rememberMe = React.createRef();
    }

    submit = () => {
        let usernameInput = this.username.current.children[1].firstElementChild.value;
        let passwordInput = this.password.current.children[1].firstElementChild.value;
        let rememberMe = this.rememberMe.current.checked;
        this.props.signIn(usernameInput, passwordInput, rememberMe)
    };

    render() {
        return (
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Войти</p>
                    <button className="delete" onClick={this.props.toggleManager}/>
                </header>
                <section className="modal-card-body">
                    <div className="field" ref={this.username}>
                        <label className="label">Имя пользователя</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="text" placeholder="Username"/>
                            <span className="icon is-small is-left"><i className="far fa-user"/></span>
                        </div>
                    </div>
                    <div className="field" ref={this.password}>
                        <label className="label">Пароль</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="password" placeholder="Password"/>
                            <span className="icon is-small is-left"><i className="far fa-lock"/></span>
                        </div>
                    </div>
                    <div className="field">
                        <a onClick={this.props.managerRecovery}>Забыли пароль?</a>
                        <label className="checkbox is-pulled-right">
                            <input type="checkbox" ref={this.rememberMe}/> Запомнить
                        </label>
                    </div>
                    <div className="field">
                        <a onClick={this.props.managerSignUp}>Еще не зарегистрированы?</a>
                    </div>
                </section>
                <footer className="modal-card-foot" style={{minHeight: 64}}>
                    <button className="button is-success" onClick={this.submit}>Подтвердить</button>
                </footer>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        managerRecovery: () => dispatch({type: 'ACCESS_MANAGER_RECOVERY'}),
        managerSignUp: () => dispatch({type: 'ACCESS_MANAGER_SIGN_UP'}),
        signIn: (username, password, rememberMe) => dispatch(signIn(username, password, rememberMe)),
        toggleManager: () => dispatch({type: 'TOGGLE_ACCESS_MANAGER'})
    })
)(SignIn)
