import React, {PureComponent, Fragment} from "react";
import Indicator from "../../containers/Indicator";
import connect from "react-redux/es/connect/connect";

class AuthResult extends PureComponent {

    render() {
        let {inProcess, isRecovery, isResultSucceeded, isSignIn, isSignUp} = this.props;

        let renderResult = (status, message) => (
            <div className="container is-centered" style={{flexDirection: "column"}}>
                {status ? <div className="p-2 is-centered"><i className="far fa-check fa-7x"/></div> :
                    <div className="p-2 is-centered"><i className="far fa-exclamation-circle fa-7x"/></div>}
                {message !== null ? <p>{message}</p> : null}
            </div>
        );

        return (
            <div className="modal-card">
                <header className="modal-card-head">
                    {inProcess ? <p className="modal-card-title">В процессе...</p> : null}
                    {!inProcess ? <p className="modal-card-title">Результат</p> : null}
                    <button className="delete" aria-label="close" onClick={this.props.toggleManager}/>
                </header>
                <section className="modal-card-body">
                    {inProcess ? <Indicator/> :
                        <Fragment>
                            {isResultSucceeded && isRecovery ? renderResult(true,
                                "Письмо для подтверждения восстановления отправлено") : null}
                            {isResultSucceeded && isSignIn ? renderResult(true,
                                "Вход произведен успешно") : null}
                            {isResultSucceeded && isSignUp ? renderResult(true,
                                "Письмо для подтверждения регистрации отправлено") : null}
                            {!isResultSucceeded && isRecovery ? renderResult(false,
                                "Процедура восстановления не удалась") : null}
                            {!isResultSucceeded && isSignIn ? renderResult(false,
                                "Не удалось совершить вход, используя введенные данные") : null}
                            {!isResultSucceeded && isSignUp ? renderResult(false,
                                "Не удалось провести регистрацию") : null}
                        </Fragment>}
                </section>
                <footer className="modal-card-foot" style={{minHeight: 64}}>
                    {!isResultSucceeded ?
                        <button className="button is-success" onClick={this.props.managerSignIn}>Назад</button> : null}
                </footer>
            </div>
        )
    }
}

export default connect(
    state => ({
        inProcess: state.user.current.inProcess,
        isRecovery: state.accessManager.isRecovery,
        isResultSucceeded: state.accessManager.isResultSucceeded,
        isSignIn: state.accessManager.isSignIn,
        isSignUp: state.accessManager.isSignUp
    }),
    dispatch => ({
        managerSignIn: () => dispatch({type: 'ACCESS_MANAGER_SIGN_IN'}),
        toggleManager: () => dispatch({type: 'TOGGLE_ACCESS_MANAGER'})
    })
)(AuthResult)
