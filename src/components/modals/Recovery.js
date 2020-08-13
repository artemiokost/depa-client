import React, {Component} from "react";
import connect from "react-redux/es/connect/connect";
import {recovery} from "../../actions/userAction";
import {setStatus} from "../../utils/FormValidatorHelper";
import {EMAIL_REGEX} from "../../constants";

class Recovery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEmail: false
        };
        this.email = React.createRef();
    }

    checkEmail = (e) => {
        if (EMAIL_REGEX.test(e.currentTarget.value)) {
            this.setState({isEmail: true});
            setStatus(this.email.current).success()
        } else {
            this.setState({isEmail: false});
            setStatus(this.email.current).danger()
        }
    };

    submit = () => {
        let email = this.email.current.children[1].firstElementChild.value;
        this.props.recovery(email)
    };

    render() {
        return (
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Восстановление</p>
                    <button className="delete" onClick={this.props.toggleManager}/>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <p>Введите ваш адрес электронной почты и мы отправим на него инструкцию по
                            восстановлению пароля.</p>
                    </div>
                    <div className="field" ref={this.email}>
                        <label className="label">Email</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="email" placeholder="Email"
                                   onInput={this.checkEmail}/>
                            <span className="icon is-small is-left"><i className="far fa-envelope"/></span>
                            <span className="icon is-small is-right"><i className="far is-hidden"/></span>
                        </div>
                        <p className="help is-hidden">
                            {!this.state.isEmail ? "Адрес электронной почты неверен" : null}
                        </p>
                    </div>
                </section>
                <footer className="modal-card-foot" style={{minHeight: 64}}>
                    <button className="button is-success" disabled={!this.state.isEmail}
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
        recovery: (email) => dispatch(recovery(email)),
        toggleManager: () => dispatch({type: 'TOGGLE_ACCESS_MANAGER'})
    })
)(Recovery)
