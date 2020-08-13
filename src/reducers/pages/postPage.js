const postPage = (state = [], action) => {
    switch (action.type) {
        case "FETCH_ARTICLE_PAGE":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        categoryArticle: {
                            isFetching: false,
                            error: action.error,
                            list: [],
                            totalElements: 0
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        categoryArticle: {
                            ...action.response,
                            isFetching: false,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        categoryArticle: {
                            isFetching: true,
                            error: null,
                            list: []
                        }
                    }
            }
        case "FETCH_BLOG_PAGE":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        categoryBlog: {
                            isFetching: false,
                            error: action.error,
                            list: [],
                            totalElements: 0
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        categoryBlog: {
                            ...action.response,
                            isFetching: false,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        categoryBlog: {
                            isFetching: true,
                            error: null,
                            list: []
                        }
                    }
            }
        case "FETCH_NEWS_PAGE":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        categoryNews: {
                            isFetching: false,
                            error: action.error,
                            list: [],
                            totalElements: 0
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        categoryNews: {
                            ...action.response,
                            isFetching: false,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        categoryNews: {
                            isFetching: true,
                            error: null,
                            list: []
                        }
                    }
            }
        case "FETCH_DISCUSSION_PAGE":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        categoryDiscussion: {
                            isFetching: false,
                            error: action.error,
                            list: [],
                            totalElements: 0
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        categoryDiscussion: {
                            ...action.response,
                            isFetching: false,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        categoryDiscussion: {
                            isFetching: true,
                            error: null,
                            list: []
                        }
                    }
            }
        case "FETCH_SEARCH_PREVIEW":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        searchPreview: {
                            isFetching: false,
                            error: action.error,
                            list: [],
                            totalElements: 0
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        searchPreview: {
                            ...action.response,
                            isFetching: false,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        searchPreview: {
                            isFetching: true,
                            error: null,
                            list: []
                        }
                    }
            }
        case "FETCH_POST_PAGE":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        withoutCategory: {
                            isFetching: false,
                            error: action.error,
                            list: [],
                            totalElements: 0
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        withoutCategory: {
                            ...action.response,
                            isFetching: false,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        withoutCategory: {
                            isFetching: true,
                            error: null,
                            list: []
                        }
                    }
            }
        default: return state
    }
};

export default postPage