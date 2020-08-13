import React from "react";
import {Helmet} from "react-helmet";

const NotFound = ({message, helmet}) => (
    <div className="column p-4 is-centered">
        {helmet ?
            <Helmet>
                <title>404 - Depa</title>
                <meta name="description" content="404"/>
            </Helmet> : null}

        <p className="has-text-centered">{message ? message : "Страница не найдена :("}</p>
    </div>
);

export default NotFound