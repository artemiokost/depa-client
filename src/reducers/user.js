const user = (state = [], action) => {
    switch (action.type) {
        case "FETCH_USER_SUMMARY":
            if (action.response && state.current.userSummary) {
                if (action.response.userId === state.current.userSummary.userId) {
                    state.current.userSummary = action.response
                }
            }
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        other: {
                            ...state.other,
                            isFetching: false,
                            error: action.error,
                            userSummary: Object.create(null)
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        other: {
                            ...state.other,
                            isFetching: false,
                            error: null,
                            userSummary: action.response
                        }

                    };
                default:
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false
                        },
                        other: {
                            ...state.other,
                            isFetching: true,
                            error: null
                        }
                    }
            }
        case "RECOVERY":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            error: action.error
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            error: null
                        }

                    };
                default:
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: true,
                            error: null
                        }
                    }
            }
        case "SIGN_IN":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            accessToken: null,
                            error: action.error,
                            userSummary: null
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            accessToken: action.response.accessToken,
                            error: null,
                            userSummary: action.response.userSummary
                        }
                    };
                default:
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: true,
                            error: null,
                            accessToken: null,
                            userSummary: null
                        }
                    }
            }
        case "SIGN_OUT":
            return {
                ...state,
                current: {
                    ...state.current,
                    accessToken: null,
                    bookmarks: [],
                    subscriptions: [],
                    userSummary: null
                }
            };
        case "SIGN_UP":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            error: action.error
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: true,
                            error: null
                        }
                    }
            }
        case "SET_AVATAR":
            return {
                ...state,
                current: {
                    ...state.current,
                    userSummary: {
                        ...state.current.userSummary,
                        imageUrl: action.imageUrl
                    }
                },
                other: {
                    ...state.other,
                    userSummary: {
                        ...state.other.userSummary,
                        imageUrl: action.imageUrl
                    }
                }
            };
        case "SET_CURRENT_USER_ERROR":
            return {
                ...state,
                current: {
                    ...state.current,
                    error: action.value
                }
            };
        case "UPDATE_USER":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            error: action.error
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            ...action.response,
                            inProcess: false,
                            updateFlag: !state.current.updateFlag,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: true,
                            error: null
                        }
                    }
            }
        case "UPDATE_USER_BOOKMARKS":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            error: action.error,
                            bookmarks: []
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            error: null,
                            bookmarks: action.response
                        }
                    };
                default:
                    return {...state}
            }
        case "UPDATE_USER_PROFILE":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            error: action.error
                        }
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: false,
                            updateFlag: !state.current.updateFlag,
                            error: null
                        }
                    };
                default:
                    return {
                        ...state,
                        current: {
                            ...state.current,
                            inProcess: true,
                            error: null
                        }
                    }
            }
        default: return state
    }
};

export default user