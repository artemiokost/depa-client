import React from "react";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";
import {createPreview} from "../utils/Helpers";

const SearchDropdownItem = ({id, content, title, uri, clearSearchInput}) => {

    let preview = createPreview(content, 200);

    return (
        <li id={"entry-" + id}>
            <div className="is-block" onClick={clearSearchInput}>
                <NavLink className="navbar-item" to={"/post/" + uri}>
                    <div className="is-block">
                        <h5>{title}</h5>
                        <p>{preview}</p>
                    </div>
                </NavLink>
            </div>
        </li>
    )
};

SearchDropdownItem.propTypes = {
    clearSearchInput: PropTypes.func.isRequired
};

export default SearchDropdownItem