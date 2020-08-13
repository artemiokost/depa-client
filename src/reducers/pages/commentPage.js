const commentPage = (state = [], action) => {
    switch (action.type) {
        case 'FETCH_COMMENT_PAGE':
            switch (action.status) {
                case "ERROR":
                    return {
                        isFetching: false,
                        error: action.error,
                        list: [],
                        totalElements: 0
                    };
                case "SUCCESS":
                    return {
                        ...action.response,
                        isFetching: false,
                        error: null
                    };
                default:
                    return {
                        isFetching: true,
                        error: null,
                        list: []
                    }
            }
        default: return state
    }
};

export default commentPage