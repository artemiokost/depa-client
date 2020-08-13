import React from "react";
import {Helmet} from "react-helmet";

const Unauthorized = () => (
    <div className="column p-4 is-centered">
        <Helmet>
            <title>401 - Depa</title>
            <meta name="description" content="401"/>
        </Helmet>

        <i className="far fa-exclamation-circle fa-7x"/>
        <p className="has-text-centered" style={{marginTop: "2rem"}}>Необходима авторизация</p>
    </div>
);

export default Unauthorized