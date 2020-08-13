export const REACT_SELECT_STYLES = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? "#00758a" : "#dbdbdb",
        boxShadow: state.isFocused ? "0 0 0 0.125em rgba(0, 117, 138, 0.25)" :
            "inset 0 1px 2px rgba(10, 10, 10, 0.1)"
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: "#4a4a4a",
        ":hover": {
            backgroundColor: "#4a4a4a",
            color: "white"
        }
    }),
    option: (provided, state) => ({
        ...provided,
        color: state.isFocused || state.isSelected ? "#0a0a0a" : "#4a4a4a",
        backgroundColor: state.isFocused && !state.isSelected ? "whitesmoke" : state.isSelected ? "#dbdbdb" : null,
        cursor: "pointer"
    })
};