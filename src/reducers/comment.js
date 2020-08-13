const comment = (state = [], action) => {
    switch (action.type) {
        case "CREATE_COMMENT":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        inProcess: false,
                        error: action.error
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        inProcess: false,
                        error: null
                    };
                default:
                    return {
                        ...state,
                        inProcess: true
                    }
            }
        case "DELETE_COMMENT":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        inProcess: false,
                        error: action.error
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        inProcess: false,
                        error: null
                    };
                default:
                    return {
                        ...state,
                        inProcess: true
                    }
            }
        case "TOGGLE_COMMENT_UPDATE_FLAG":
            return {
                ...state,
                updateFlag: !state.updateFlag
            };
        default: return state
    }
};

export default comment