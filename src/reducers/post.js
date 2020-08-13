const post = (state = [], action) => {
    switch (action.type) {
        case "CREATE_POST":
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
                        updateFlag: !state.updateFlag,
                        error: null
                    };
                default:
                    return {
                        ...state,
                        inProcess: true,
                        error: null
                    }
            }
        case "DELETE_POST":
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
                        updateFlag: !state.updateFlag,
                        error: null
                    };
                default:
                    return {
                        ...state,
                        inProcess: true,
                        error: null
                    }
            }
        case "FETCH_POST":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        isFetching: false,
                        content: null,
                        error: action.error
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        ...action.response,
                        isFetching: false,
                        updateFlag: !state.updateFlag,
                        error: null,
                    };
                default:
                    return {
                        ...state,
                        isFetching: true,
                        categoryId: null,
                        content: null,
                        error: null
                    }
            }
        case "UPDATE_POST":
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
                        inProcess: true,
                        error: null
                    }
            }
        case "UPDATE_POST_PENDING":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        error: action.error
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        pending: action.pending
                    };
                default:
                    return {...state}
            }
        default: return state
    }
};

export default post
