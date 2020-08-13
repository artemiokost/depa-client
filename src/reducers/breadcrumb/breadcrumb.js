const breadcrumb = (state = [], action) => {
    switch (action.type) {
        case "TOGGLE_TARGETING":
            return {
                isTargeting: !state.isTargeting
            };
        default:
            return state
    }
};

export default breadcrumb