import React from "react";
import PropTypes from "prop-types";

const Dialog = ({action, cancelAction, closeAction, message}) => {
    return (
        <div className="modal is-active">
            <div className="modal-background"/>
            <div className="modal-card" style={{width: 400}}>
                <header className="modal-card-head">
                    <p className="modal-card-title" style={{margin: 0}}>Диалог</p>
                    <button className="delete" aria-label="close" onClick={closeAction}/>
                </header>
                <section className="modal-card-body is-centered" style={{height: 100}}>
                    <div className="field"><p>{message}</p></div>
                </section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={action}>Да</button>
                    <button className="button" onClick={cancelAction}>Нет</button>
                </footer>
            </div>
        </div>
    )
};

Dialog.propTypes = {
    action: PropTypes.func.isRequired,
    cancelAction: PropTypes.func.isRequired,
    closeAction: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired
};

export default Dialog
