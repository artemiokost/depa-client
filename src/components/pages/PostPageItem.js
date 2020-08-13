import React, {Component} from "react";
import classNames from "classnames";
import Dialog from "../modals/Dialog";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {deletePostById} from "../../actions/postAction";
import {createPreview, formatDateTime} from "../../utils/Helpers";
import {getUserBookmarkList} from "../../actions/userAction";
import {request} from "../../utils/APIUtils";
import {NavLink} from "react-router-dom";
import {API_BASE_URL, ROLE} from "../../constants";

class PostPageItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasBookmark: false,
            isDialog: false,
            bookmarkId: null
        };
    }

    componentDidMount() {
        this._isMounted = true;
        let {id, bookmarks} = this.props;
        let bookmark = bookmarks.filter(bookmark => bookmark.postId === id)[0];
        this.setState({
            hasBookmark: !!bookmark,
            bookmarkId: bookmark ? bookmark.id : null
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.bookmarks !== prevProps.bookmarks) {
            let {id, bookmarks} = this.props;
            let bookmark = bookmarks.filter(bookmark => bookmark.postId === id)[0];
            this.setState({
                hasBookmark: !!bookmark,
                bookmarkId: bookmark ? bookmark.id : null
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    closeDialog = () => this.setState({isDialog: false});

    delete = () => {
        this.setState({isDialog: false});
        this.props.deleteById(this.props.id)
    };

    toggleBookmarkButton = () => {
        let createOptions = {
            url: API_BASE_URL + "post/bookmark/" + this.props.id,
            method: "POST"
        };
        let deleteOptions = {
            url: API_BASE_URL + "post/bookmark/" + this.state.bookmarkId,
            method: "DELETE"
        };
        request(!this.state.hasBookmark ? createOptions : deleteOptions).then(() => {
            if (this._isMounted) {
                this.props.getBookmarkList();
                this.setState({hasBookmark: !this.state.hasBookmark})
            }
        }).catch(error => console.log(error));
    };

    toggleDialog = () => this.setState({isDialog: !this.state.isDialog});

    render() {
        let {management, mini} = this.props;
        let {id, views, content, imageUrl, title, uri, createdAt, createdBy, extra} = this.props;
        let {isAuthenticated, currentUserSummary} = this.props;
        let {hasBookmark, isDialog} = this.state;
        let {commentCount, creatorSummary} = extra;
        let hasAuthority;

        if (isAuthenticated) {
            hasAuthority = currentUserSummary.roles.includes(ROLE.MODERATOR) || createdBy === currentUserSummary.userId
        }

        let preview = createPreview(content, 600);

        let renderBookmarkButton = () => (
            <a className="bi-line-item" title="В закладки"
               onClick={isAuthenticated ? this.toggleBookmarkButton : this.props.toggleAccessManager}>
                <i className={classNames({"fas": hasBookmark, "far": !hasBookmark}, "fa-bookmark")}/>
            </a>
        );

        let renderContentMetadata = () => (
            <div className="bi-line">
                <div className="content-metadata">
                    <NavLink to={"/user/profile/" + creatorSummary.userId}>{creatorSummary.username}</NavLink>
                    <span>{formatDateTime(createdAt)}</span>
                    <div className="is-flex">
                        <i className="far fa-book-open"/>
                        <span>{views}</span>
                    </div>
                    <div className="is-flex">
                        <i className="far fa-comment-alt"/>
                        <span>{commentCount}</span>
                    </div>
                </div>
                {renderBookmarkButton()}
            </div>
        );

        let renderImageUrl = () => (
            <figure className="image">
                <NavLink to={"/post/" + uri}><img src={imageUrl} alt={title}/></NavLink>
            </figure>
        );

        let renderBase = () => (
            <div id={id} className="content divided">
                <div className="content-header">
                    <div className="bi-line">
                        <NavLink to={"/post/" + uri}><h4>{title}</h4></NavLink>
                        {hasAuthority && management ? <button className="delete" onClick={this.toggleDialog}/> : null}
                    </div>
                    {renderContentMetadata()}
                </div>
                <div className="content-image">{imageUrl ? renderImageUrl() : null}</div>
                <div className="content-block"><p>{preview}</p></div>
                {isDialog ?
                    <Dialog action={this.delete}
                            cancelAction={this.closeDialog}
                            closeAction={this.closeDialog}
                            message="Вы уверены, что хотите удалить данную запись?"/> : null}
            </div>
        );

        let renderMini = () => (
            <div id={id} className="content divided">
                <div className="box">
                    <div className="bi-line">
                        <NavLink to={"/post/" + uri}><h4>{title}</h4></NavLink>
                        {hasAuthority && management ? <button className="delete" onClick={this.toggleDialog}/> : null}
                    </div>
                    {renderContentMetadata()}
                </div>
                {isDialog ?
                    <Dialog action={this.delete}
                            cancelAction={this.closeDialog}
                            closeAction={this.closeDialog}
                            message="Вы уверены, что хотите удалить данную запись?"/> : null}
            </div>
        );

        return mini ? renderMini() : renderBase()
    }
}

PostPageItem.propTypes = {
    management: PropTypes.bool
};

export default connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null,
        bookmarks: state.user.current.bookmarks,
        currentUserSummary: state.user.current.userSummary
    }),
    dispatch => ({
        deleteById: (postId) => dispatch(deletePostById(postId)),
        getBookmarkList: (size) => dispatch(getUserBookmarkList(size)),
        toggleAccessManager: () => dispatch({type: "TOGGLE_ACCESS_MANAGER"})
    })
)(PostPageItem)
