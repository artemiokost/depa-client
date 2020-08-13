const commentList = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_COMMENT_LIST':
            switch (action.status) {
                case "ERROR":
                    return {
                        isFetching: false,
                        error: action.error,
                        list: [],
                    };
                case "SUCCESS":
                    return {
                        isFetching: false,
                        error: null,
                        list: action.response
                    };
                default:
                    return {
                        ...state,
                        isFetching: true,
                        error: null
                    }
            }
        default: return state
    }
};

export default commentList