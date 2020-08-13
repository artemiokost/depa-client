import React, {Component} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getPostPageByCategoryIdAndTargeting} from "../actions/postPageAction";
import {request} from "../utils/APIUtils";
import {NavLink} from "react-router-dom";
import {API_BASE_URL, CATEGORY} from "../constants";

export const BREADCRUMB_BUTTON = {
    TARGETING: "targeting"
};

class Breadcrumb extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tagName: null
        }
    }

    componentDidMount() {
        this._isMounted = true;
        let tagId = this.props.tagId;
        if (tagId) this.getTagName(tagId)
    }

    componentDidUpdate(prevProps, prevState) {
        let tagId = this.props.tagId;
        if (tagId && tagId !== prevProps.tagId) this.getTagName(tagId)
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getTagName(tagId) {
        request({
            url: API_BASE_URL + "post/tag/" + tagId,
            method: "GET"
        }).then(response => {
            if (this._isMounted) this.setState({tagName: response.name})
        })
    }

    render() {
        let {isAuthenticated, isTargeting, bookmark, pending, categoryId, tagId, searchKey, buttons} = this.props;
        let categoryName;
        let categoryUri;

        switch (categoryId) {
            case CATEGORY.ARTICLE:
                categoryName = "Статьи";
                categoryUri = "/article";
                break;
            case CATEGORY.BLOG:
                categoryName = "Блоги";
                categoryUri = "/blog";
                break;
            case CATEGORY.NEWS:
                categoryName = "Новости";
                categoryUri = "/news";
                break;
            case CATEGORY.DISCUSSION:
                categoryName = "Обсуждения";
                categoryUri = "/discussion";
                break;
            default:
                break;
        }

        let renderLink = (label) => (
            <li className="is-active">
                <NavLink to='/'><span>{label}</span></NavLink>
            </li>
        );

        let renderCategoryLink = () => (
            <li className={!searchKey && !tagId ? "is-active" : null}>
                <NavLink to={categoryUri}><span>{categoryName}</span></NavLink>
            </li>
        );

        let renderCreatorButton = () => (
            isAuthenticated ?
                <NavLink title="Опубликовать" to="/post/creator">
                    <i className="far fa-plus"/>
                </NavLink> :
                <a title="Опубликовать" onClick={this.props.toggleAccessManager}>
                    <i className="far fa-plus"/>
                </a>
        );

        let renderTargetingButton = () => (
            isAuthenticated ?
                <a title="Интересное" onClick={this.props.toggleTargeting}>
                    <i className={classNames("far", {"fa-bullseye-arrow": isTargeting, "fa-bullseye": !isTargeting})}/>
                </a> :
                <a title="Интересное" onClick={this.props.toggleAccessManager}>
                    <i className="far fa-bullseye"/>
                </a>
        );

        return (
            <div className="breadcrumb bi-line">
                <ul className="is-marginless">
                    <li><NavLink to="/"><span>Depa</span></NavLink></li>
                    {bookmark ? renderLink("Закладки") : null}
                    {pending ? renderLink("Ожидающие") : null}
                    {categoryId ? renderCategoryLink() : null}
                    {searchKey ? renderLink(searchKey) : null}
                    {tagId ? renderLink(this.state.tagName) : null}
                </ul>
                <div className="bi-line-item">
                    {buttons && buttons.includes(BREADCRUMB_BUTTON.TARGETING) ? renderTargetingButton() : null}
                    {renderCreatorButton()}
                </div>
            </div>
        )
    }
}

Breadcrumb.propTypes = {
    bookmark: PropTypes.bool,
    pending: PropTypes.bool,
    categoryId: PropTypes.number,
    tagId: PropTypes.string,
    searchKey: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.string)
};

export default connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null,
        isTargeting: state.user.current.accessToken !== null && state.breadcrumb.isTargeting
    }),
    dispatch => ({
        getPageByCategoryId: (number, size, categoryId, unread) =>
            dispatch(getPostPageByCategoryIdAndTargeting(number, size, categoryId, unread)),
        toggleAccessManager: () => dispatch({type: "TOGGLE_ACCESS_MANAGER"}),
        toggleTargeting: () => dispatch({type: "TOGGLE_TARGETING"})
    })
) (Breadcrumb)
