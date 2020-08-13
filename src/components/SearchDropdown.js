import React, {Component} from "react";
import Indicator from "../containers/Indicator";
import NotFound from "../containers/errors/NotFound";
import PropTypes from "prop-types";
import SearchDropdownItem from "./SearchDropdownItem";
import {connect} from "react-redux";
import {NavLink, withRouter} from "react-router-dom";
import {DEFAULT_SEARCH_PREVIEW_SIZE} from "../constants";

class SearchDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    render() {
        let {isFetching, postList, searchKey} = this.props;

        let renderItems = postList.slice(0, DEFAULT_SEARCH_PREVIEW_SIZE).map((post, i) => (
            <SearchDropdownItem clearSearchInput={this.props.clearSearchInput} key={i} {...post}/>
        ));

        return (
            <div className="navbar-search-dropdown">
                {isFetching ? <Indicator/> : null}
                {!isFetching && postList.length === 0 ?
                    <NotFound message="По вашему запросу ничего не найдено"/> : null}
                {postList.length > 0 ?
                    <div className="container">
                        <ul className="content">{renderItems}</ul>
                        <div className="is-block" onClick={this.props.clearSearchInput}>
                            {postList.length > DEFAULT_SEARCH_PREVIEW_SIZE ?
                                <NavLink to={"/search/" + searchKey} className="navbar-item is-pulled-right">
                                    Посмотреть все
                                </NavLink> : null}
                        </div>
                    </div> : null}
            </div>
        );
    }
}

SearchDropdown.propTypes = {
    searchKey: PropTypes.string.isRequired,
    clearSearchInput: PropTypes.func.isRequired
};

export default withRouter(connect(
    state => ({
        isFetching: state.postPage.searchPreview.isFetching,
        postList: state.postPage.searchPreview.list
    })
)(SearchDropdown))
