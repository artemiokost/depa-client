const accessManager = (state = [], action) => {
    switch (action.type) {
        case "ACCESS_MANAGER_RECOVERY":
            return {
                isOpen: true,
                isRecovery: true,
                isSignIn: false,
                isSignUp: false
            };
        case "ACCESS_MANAGER_RESULT":
            switch (action.status) {
                case "ERROR":
                    return {
                        ...state,
                        isOpen: true,
                        isResult: true,
                        isResultSucceeded: false,
                        error: action.error
                    };
                case "SUCCESS":
                    return {
                        ...state,
                        isOpen: true,
                        isResult: true,
                        isResultSucceeded: true,
                        error: null
                    };
                default:
                    return {
                        ...state,
                        isOpen: true,
                        isResult: true,
                    }
            }
        case "ACCESS_MANAGER_SIGN_IN":
            return {
                isOpen: true,
                isRecovery: false,
                isSignIn: true,
                isSignUp: false
            };
        case "ACCESS_MANAGER_SIGN_UP":
            return {
                isOpen: true,
                isRecovery: false,
                isSignIn: false,
                isSignUp: true
            };
        case "CLOSE_ACCESS_MANAGER":
            return {
                isOpen: false,
                isRecovery: false,
                isSignIn: true,
                isSignUp: false
            };
        case "TOGGLE_ACCESS_MANAGER":
            return {
                isOpen: !state.isOpen,
                isRecovery: false,
                isSignIn: true,
                isSignUp: false
            };
        default:
            return state
    }
};

export default accessManager