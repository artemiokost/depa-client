import React, {Component, Fragment} from "react";
import Avatar from "./Avatar";
import AccessManager from "./modals/AccessManager";
import SearchDropdown from "./SearchDropdown";
import {connect} from "react-redux";
import {debounce} from "lodash";
import {getPostSearchPreview} from "../actions/postPageAction";
import {Brand} from "../svg/Brand";
import {NavLink, withRouter} from "react-router-dom";
import {ROLE, TAG} from "../constants";

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            searchKey: null
        };
        this.bellButton = React.createRef();
        this.bookmarkButton = React.createRef();
        this.brand = React.createRef();
        this.burgerButton = React.createRef();
        this.menu = React.createRef();
        this.pendingButton = React.createRef();
        this.searchBox = React.createRef();
        this.searchInput = React.createRef();
        this.searchButtons = [];
    }

    clearSearchInput = () => {
        this.searchInput.current.value = null;
        this.setState({searchKey: null})
    };

    searchPreview = debounce(() => {
        let searchKey = this.searchInput.current.value;
        this.setState({searchKey: this.searchInput.current.value});
        this.props.getSearchPreview(searchKey)
    }, 1000);

    toggleMenu = () => {
        let burgerButton = this.burgerButton.current.getElementsByTagName("svg")[0];
        burgerButton.classList.toggle('fa-bars');
        burgerButton.classList.toggle('fa-times');
        this.menu.current.classList.toggle('is-active');
        this.setState({isOpen: !this.state.isOpen})
    };

    toggleSearch = () => {
        if (this.state.isOpen) this.toggleMenu();
        this.clearSearchInput();
        this.toggleSearchButtons();
        this.brand.current.classList.toggle("is-grey");
        this.searchBox.current.classList.toggle("is-active")
    };

    toggleSearchButtons = () => {
        this.searchButtons.forEach(e => {
            let svg = e.getElementsByTagName("svg")[0];
            e.classList.toggle("is-grey");
            svg.classList.toggle("fa-search");
            svg.classList.toggle("fa-times")
        });
    };

    render() {
        let searchKey = this.state.searchKey;
        let {isAuthenticated, currentUserSummary} = this.props;
        let isModerator;

        if (isAuthenticated) isModerator = currentUserSummary.roles.includes(ROLE.MODERATOR);

        let renderAccessManagerButton = () => (
            <a className="navbar-item is-centered is-semibold" title="Войти"
               onClick={this.props.toggleAccessManager}>Войти</a>
        );

        let renderUserButton = () => (
            <div className="navbar-item has-dropdown is-hoverable">
                <NavLink className="user-button" title="Профиль"
                         to={"/user/profile/" + currentUserSummary.profileId}>
                    <Avatar imageUrl={currentUserSummary.imageUrl} username={currentUserSummary.username}/>
                </NavLink>
                <div className="navbar-dropdown is-adapted-touch is-right">
                    <a className="navbar-item" onClick={this.props.signOut}>Выйти</a>
                </div>
            </div>
        );

        let renderExtraFeatures = () => (
            <Fragment>
                <NavLink className="bell-button" to={"/user/profile/" + currentUserSummary.userId} title="Уведомления">
                    <div ref={this.bellButton}><i className="far fa-bell fa-lg"/></div>
                </NavLink>
                <NavLink className="bookmark-button" to={"/bookmark"} title="Закладки">
                    <div ref={this.bookmarkButton}><i className="far fa-bookmark fa-lg"/></div>
                </NavLink>
                {isModerator ?
                    <NavLink className="pending-button" to={"/pending"} title="Ожидающие">
                        <div ref={this.pendingButton}><i className="far fa-clock fa-lg"/></div>
                    </NavLink> : null}
            </Fragment>
        );

        let renderSearchDropdown = () => (
            <SearchDropdown searchKey={searchKey} clearSearchInput={this.clearSearchInput}/>
        );

        return (
            <div className="navbar has-shadow is-fixed-top-desktop">
                <div className="container">
                    <div className="navbar-brand">
                        <a className="navbar-burger" ref={this.burgerButton} onClick={this.toggleMenu}>
                            <i className="far fa-bars fa-lg"/></a>
                        <NavLink className="navbar-item" to="/">
                            <Brand width="80" height="40" ref={this.brand}/>
                        </NavLink>
                        <a className="search-button" ref={e => this.searchButtons[0] = e}
                           onClick={this.toggleSearch}><i className="far fa-search fa-lg"/>
                        </a>
                    </div>
                    <div className="navbar-menu" ref={this.menu}>
                        <div className="navbar-start">
                            <div className="navbar-item has-dropdown is-hoverable">
                                <NavLink className="navbar-item is-semibold" activeClassName="is-active"
                                         to="/news">Новости</NavLink>
                                <div className="navbar-dropdown">
                                    <NavLink className="navbar-item"
                                             to={"/news/tag/" + TAG.MOVIE}>Кино</NavLink>
                                    <NavLink className="navbar-item"
                                             to={"/news/tag/" + TAG.SCIENCE}>Наука</NavLink>
                                    <NavLink className="navbar-item"
                                             to={"/news/tag/" + TAG.TECHNOLOGY}>Технологии</NavLink>
                                </div>
                            </div>
                            <div className="navbar-item has-dropdown is-hoverable">
                                <NavLink className="navbar-item is-semibold" activeClassName="is-active"
                                         to="/article">Статьи</NavLink>
                                <div className="navbar-dropdown">
                                    <NavLink className="navbar-item"
                                             to={"/article/tag/" + TAG.OPINION}>Мнения</NavLink>
                                    <NavLink className="navbar-item"
                                             to={"/article/tag/" + TAG.REVIEW}>Обзоры</NavLink>
                                </div>
                            </div>
                            <NavLink className="navbar-item is-semibold" activeClassName="is-active"
                                     to="/blog">Блоги</NavLink>
                            <NavLink className="navbar-item is-semibold" activeClassName="is-active"
                                     to="/discussion">Обсуждения</NavLink>
                            <NavLink className="navbar-item is-coronavirus is-semibold" activeClassName="is-active"
                                     to="/tag/120">Коронавирус</NavLink>
                        </div>
                        <div className="navbar-end">
                            <a className="search-button" title="Поиск" ref={e => this.searchButtons[1] = e}
                               onClick={this.toggleSearch}><i className="far fa-search fa-lg"/>
                            </a>
                            {isAuthenticated ? renderExtraFeatures() : null}
                            <div className="navbar-item-divider"/>
                            {isAuthenticated ? renderUserButton() : renderAccessManagerButton()}
                        </div>
                    </div>
                </div>
                <div className="navbar-search" ref={this.searchBox}>
                    <div className="container">
                        <div className="search-field">
                            <div className="control">
                                <input className="input" type="search" autoComplete="off" placeholder="Поиск..."
                                       ref={this.searchInput} onInput={this.searchPreview}/>
                            </div>
                        </div>
                        {searchKey ? renderSearchDropdown() : null}
                    </div>
                </div>
                <AccessManager/>
            </div>
        );
    }
}

export default withRouter(connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null,
        currentUserSummary: state.user.current.userSummary
    }),
    dispatch => ({
        getSearchPreview: (searchKey) => dispatch(getPostSearchPreview(searchKey)),
        signOut: () => dispatch({type: "SIGN_OUT"}),
        toggleAccessManager: () => dispatch({type: "TOGGLE_ACCESS_MANAGER"})
    })
)(Navbar))
