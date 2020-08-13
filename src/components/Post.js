import React, {Component, Fragment} from "react";
import classNames from "classnames";
import Avatar from "./Avatar";
import CommentPage from "./pages/CommentPage";
import Indicator from "../containers/Indicator";
import NotFound from "../containers/errors/NotFound";
import PostEditor from "./PostEditor";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {createPreview, formatDate, formatDateTime, switchSchemaByCategoryId} from "../utils/Helpers";
import {getUserBookmarkList} from "../actions/userAction";
import {getPostByUri, updatePostPendingById} from "../actions/postAction";
import {request} from "../utils/APIUtils";
import {AdSenseSlot} from "../utils/AdSenseSlot";
import {Helmet} from "react-helmet";
import {Like} from "react-facebook";
import {NavLink} from "react-router-dom";
import {TwitterShareButton} from "react-twitter-embed";
import {API_BASE_URL, CATEGORY, ROLE} from "../constants";

class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isIntermediate: false,
            editorFlag: false,
            hasBookmark: false,
            bookmarkId: null,
            neighbours: [],
            number: 1,
            path: props.match.path.substring(0, props.match.path.indexOf(':')) + props.match.params.uri,
            uri: props.match.params.uri
        };
        this.editorButton = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let number = Number(nextProps.match.params.number);
        return {
            number: number ? number : 1,
            uri: nextProps.match.params.uri
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getByUri(this.state.uri);
        this.setState({isIntermediate: window.innerWidth >= 961})
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.bookmarks !== prevProps.bookmarks || this.props.updateFlag !== prevProps.updateFlag) {
            let {post, bookmarks} = this.props;
            let bookmark = bookmarks.filter(bookmark => bookmark.postId === post.id)[0];
            this.setState({
                hasBookmark: !!bookmark,
                bookmarkId: bookmark ? bookmark.id : null
            });
            this.getNeighbours(this.props.post.id)
        }
        if (this.state.uri !== prevState.uri) this.props.getByUri(this.state.uri);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getNeighbours = (postId) => {
        request({
            url: API_BASE_URL + "post/neighbours/" + postId,
            method: "GET"
        }).then(response => {
            if (this._isMounted) this.setState({neighbours: response})
        })
    };

    toggleBookmarkButton = () => {
        let createOptions = {
            url: API_BASE_URL + "post/bookmark/" + this.props.post.id,
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

    toggleEditorFlag = () => this.setState({editorFlag: !this.state.editorFlag});

    toggleEditorButton = () => {
        let svg = this.editorButton.current.getElementsByTagName("svg")[0];
        svg.classList.toggle("fa-pencil-alt");
        svg.classList.toggle("fa-times")
    };

    togglePendingButton = () => this.props.updatePendingById(this.props.post.id, !this.props.post.pending);

    render() {
        let {isIntermediate, editorFlag, hasBookmark, neighbours, number, path} = this.state;
        let {isAuthenticated, isFetching, post, currentUserSummary} = this.props;
        let {id, views, categoryId, originId, pending, title, imageUrl, content, uri,
            createdAt, updatedAt, createdBy, extra} = post;
        let {commentCount, creatorSummary, origin, tags} = extra;

        let hasAuthority, isModerator;
        let isArticle = categoryId === CATEGORY.ARTICLE;
        let isDiscussion = categoryId === CATEGORY.DISCUSSION;

        if (isAuthenticated) {
            hasAuthority = currentUserSummary.roles.includes(ROLE.MODERATOR) || createdBy === currentUserSummary.userId;
            isModerator = currentUserSummary.roles.includes(ROLE.MODERATOR)
        }

        let preview = createPreview(content, 400);

        let structuredData = {
            "@context": "https://schema.org",
            "@type": switchSchemaByCategoryId(categoryId),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://depa.io/" + uri
            },
            "headline": title + " - Depa",
            "image": imageUrl,
            "datePublished": createdAt,
            "dateModified": updatedAt,
            "author": {
                "@type": "Person",
                "name": creatorSummary.fullName
            },
            "publisher": {
                "@type": "Organization",
                "name": "Depa",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://depa.io/img/depa-logo-mini.png"
                }
            },
            "description": preview
        };

        let renderNeighbours = neighbours.map(neighbour => {
            let preview = createPreview(neighbour.content, 200);
            return (
                <NavLink key={neighbour.id} className="card" to={"/post/" + neighbour.uri}>
                    <div className="card-header">
                        <figure className="image"><img src={neighbour.imageUrl} alt={neighbour.title}/></figure>
                    </div>
                    <div className="card-content"><p>{preview}</p></div>
                </NavLink>
            )
        });

        let renderTags = (content !== null) ? tags.map((tag, i) =>
            <NavLink key={i} className="tag" to={"/tag/" + tag.id}>{tag.name}</NavLink>) : null;

        let renderBookmarkButton = () => (
            <a className="bi-line-item" title="В закладки"
               onClick={isAuthenticated ? this.toggleBookmarkButton : this.props.toggleAccessManager}>
                <i className={classNames({"fas": hasBookmark, "far": !hasBookmark}, "fa-bookmark")}/>
            </a>
        );

        let renderEditorButton = () => (
            <a className="bi-line-item" title="Редактор" ref={this.editorButton} onClick={this.toggleEditorFlag}>
                <i className="far fa-pencil-alt"/>
            </a>
        );

        let renderPendingButton = () => (
            <a className="bi-line-item" title={pending ? "Подтвердить" : "Отозвать"} onClick={this.togglePendingButton}>
                <i className={classNames("far", {"fa-clipboard": pending, "fa-clipboard-check": !pending}, "fa-2x")}/>
            </a>
        );

        let renderContentBlock = () => (
            <div className="content-block">
                <div className="social">
                    <div className="bi-line">
                        <div className="social-button-group">
                            {this._isMounted ? <Like href={window.location.href} layout="button" share={true}/> : null}
                            {this._isMounted ? <TwitterShareButton url={window.location.href}/> : null}
                        </div>
                        {hasAuthority ? renderEditorButton() : null}
                    </div>
                </div>
                <PostEditor post={post} editorFlag={editorFlag}
                            toggleEditorButton={this.toggleEditorButton}/>
                {originId !== null && !isDiscussion ?
                    <div className="origin">
                        <p>Источник: <a href={origin.url}>{origin.name}</a></p>
                    </div> : null}
                <div className="tags">{renderTags}</div>
            </div>
        );

        let renderContentHeader = () => (
            <div className={classNames("content-header", {"is-marginless": isDiscussion})}>
                <div className="bi-line">
                    <h1>{title}</h1>
                    {isModerator ? renderPendingButton() : null}
                </div>
                {renderContentMetadata()}
            </div>
        );

        let renderContentImage = () => (
            <div className="content-image">
                <figure className="image">
                    <NavLink to={"/post/" + uri}><img src={imageUrl} alt={title}/></NavLink>
                </figure>
            </div>
        );

        let renderContentMetadata = () => (
            <div className="bi-line">
                {isDiscussion ?
                    <div className="content-metadata">
                        <NavLink to={"/user/profile/" + creatorSummary.userId}>
                            <Avatar className="is-64x64"
                                    imageUrl={creatorSummary.imageUrl}
                                    username={creatorSummary.username}/>
                        </NavLink>
                        <div className="column">
                            <NavLink to={"/user/profile/" + creatorSummary.userId}>{creatorSummary.username}</NavLink>
                            <span>В сообществе с {formatDate(creatorSummary.createdAt)}</span>
                        </div>
                    </div> :
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
                    </div>}
                {renderBookmarkButton()}
            </div>
        );

        let renderBase = () => (
            <div className="app-container">
                <div className="content">
                    {renderContentHeader()}
                    {imageUrl ? renderContentImage() : null}
                    <div className="columns">
                        <div className="column">
                            {renderContentBlock()}
                            <div className="is-hidden-intermediate" style={{marginTop: '1rem', minWidth: 250}}>
                                {!isIntermediate ? AdSenseSlot.renderSlot0() : null}
                            </div>
                            <div className="content-neighbours">{renderNeighbours}</div>
                            <CommentPage number={number} path={path} postId={id}/>
                        </div>
                        <div className="column is-3 is-hidden-until-intermediate" style={{marginTop: '1rem', minWidth: 250}}>
                            {isIntermediate ? AdSenseSlot.renderSlot2() : null}
                        </div>
                    </div>
                </div>
            </div>
        );

        let renderArticle = () => (
            <Fragment>
                <div className="canopy">{imageUrl ? renderContentImage() : null}</div>
                <div className="app-container">
                    <div className="content article">
                        {renderContentHeader()}
                        <div className="columns">
                            <div className="column">
                                {renderContentBlock()}
                                <div className="is-hidden-intermediate" style={{marginTop: '1rem', minWidth: 250}}>
                                    {!isIntermediate ? AdSenseSlot.renderSlot0() : null}
                                </div>
                                <div className="content-neighbours">{renderNeighbours}</div>
                                <CommentPage number={number} path={path} postId={id}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );

        let renderDiscussion = () => (
            <div className="app-container">
                <div className="content discussion">
                    {renderContentHeader()}
                    <div className="columns">
                        <div className="column">
                            {renderContentBlock()}
                            <div className="is-hidden-intermediate" style={{marginTop: '1rem', minWidth: 250}}>
                                {!isIntermediate ? AdSenseSlot.renderSlot0() : null}
                            </div>
                            <CommentPage number={number} path={path} postId={id}/>
                        </div>
                        <div className="column is-3 is-hidden-touch" style={{marginTop: '1rem'}}>
                            {isIntermediate ? AdSenseSlot.renderSlot2() : null}
                        </div>
                    </div>
                </div>
            </div>
        );

        if (isFetching) return <Indicator/>;
        if (!isFetching && content === null) return <NotFound helmet={true} message="Содержимое не найдено :("/>;
        if (this._isMounted && content !== null) return (
            <Fragment>
                <Helmet>
                    <title>{title + " - Depa"}</title>
                    <meta name="title" content={title}/>
                    <meta name="description" content={preview}/>
                    <meta property="fb:app_id" content="1665490876882427"/>
                    <meta property="og:description" content={preview}/>
                    <meta property="og:image" content={imageUrl}/>
                    <meta property="og:site_name" content="depa.io"/>
                    <meta property="og:title" content={title}/>
                    <meta property="og:type" content="article"/>
                    <meta property="og:url" content={window.location.href}/>
                    <meta name="twitter:card" content="summary"/>
                    <meta name="twitter:creator" content="@depa_official"/>
                    <meta name="twitter:site" content="@depa_official"/>
                    <meta name="twitter:title" content={title}/>
                    <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
                </Helmet>

                {isArticle ? renderArticle() : null}
                {isDiscussion ? renderDiscussion() : null}
                {!isArticle && !isDiscussion ? renderBase() : null}
            </Fragment>
        );
        return null
    }
}

Post.propTypes = {
    page: PropTypes.number,
    match: PropTypes.shape({
        params: PropTypes.shape({
            uri: PropTypes.string.isRequired
        })
    })
};

export default connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null,
        isFetching: state.post.isFetching,
        bookmarks: state.user.current.bookmarks,
        post: state.post,
        currentUserSummary: state.user.current.userSummary,
        updateFlag: state.post.updateFlag
    }),
    dispatch => ({
        getBookmarkList: (size) => dispatch(getUserBookmarkList(size)),
        getByUri: (uri) => dispatch(getPostByUri(uri)),
        toggleAccessManager: () => dispatch({type: "TOGGLE_ACCESS_MANAGER"}),
        updatePendingById: (postId, value) => dispatch(updatePostPendingById(postId, value))
    })
)(Post)
