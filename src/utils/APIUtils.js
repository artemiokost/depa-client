import {store} from "../store/configureStore";

export const request = (options) => {

    let {accessToken} = store.getState().user.current;

    let headers = new Headers({
        "Content-Type": "application/json",
    });

    if (accessToken) {
        headers.append("Accept-Encoding", "gzip");
        headers.append("Authorization", "Bearer " + accessToken)
    }

    let defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options).then(response => {
        if (!response.ok) {
            if (response.status === 401) store.dispatch({type: "SIGN_OUT"});
            return response.json().then(Promise.reject.bind(Promise))
        }
        return response.json();
    })
};
