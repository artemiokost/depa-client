import React from "react";
import {NavLink} from "react-router-dom";

const Footer = () => (
    <div className="footer-container">
        <div className="is-flex">
            <div className="is-flex" style={{marginBottom: "1rem"}}>
                <a href="https://github.com/artemiokost" title="Github">
                    <i className="fab fa-github fa-2x"/>
                </a>
                <a href="https://twitter.com/depa_official" title="Twitter">
                    <i className="fab fa-twitter fa-2x"/>
                </a>
                <NavLink title="Privacy" to="/user/privacy">
                    <i className="far fa-fingerprint fa-2x"/>
                </NavLink>
                <a href="mailto:artemiokost@gmail.com" title="Сообщить об ошибке">
                    <i className="fas fa-bug fa-2x"/>
                </a>
                <a><i className="fas fa-question-circle fa-2x" title="О сайте"/></a>
            </div>
        </div>
        <p>Your department of unexpected research</p>
    </div>
);

export default Footer