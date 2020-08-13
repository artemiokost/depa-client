import React from "react";
import ReactDOM from "react-dom";
import EventBus from "vertx3-eventbus-client";
import Footer from "./containers/Footer";
import Navbar from "./components/Navbar";
import Root from "./containers/Root";
import {eventActionMap} from "./actions/eventAction";
import {persistor, store} from "./store/configureStore";
import {FacebookProvider} from "react-facebook";
import {BrowserRouter} from "react-router-dom";
import {PersistGate} from "redux-persist/es/integration/react";
import {Provider} from "react-redux";
import {API_BASE_URL, EVENT_TYPE_LIST} from "./constants";

const eb = new EventBus(API_BASE_URL + "eventbus");

eb.onopen = () => (
    eb.registerHandler("comment-service", null, (error, message) => {
        let event = message.body;
        if (EVENT_TYPE_LIST.includes(event.type)) {
            let action = eventActionMap.get(event.action);
            if (action != null) {
                action.call(this, event.payload)
            }
        } else {
            console.log("Unknown event received: " + JSON.stringify(event))
        }
    })
);

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <FacebookProvider appId="1111111111111111" language="ru_RU">
                <BrowserRouter>
                    <div className="wrapper">
                        <Navbar/>
                        <Root/>
                        <Footer/>
                    </div>
                </BrowserRouter>
            </FacebookProvider>
        </PersistGate>
    </Provider>, document.getElementById('app')
);
