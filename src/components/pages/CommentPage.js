import React, {Component} from "react";
import Avatar from "../Avatar";
import Comment from "../Comment";
import Indicator from "../../containers/Indicator";
import Pagination from "../Pagination";
import PropTypes from 'prop-types'
import {connect} from "react-redux";
import {createCommentByPostId} from "../../actions/commentAction";
import {getCommentPageByPostId} from "../../actions/commentPageAction";
import {wordEnd} from "../../utils/Helpers";
import {NavLink} from "react-router-dom";
import {DEFAULT_COMMENT_PAGE_SIZE} from "../../constants";

class CommentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            number: props.number,
            size: DEFAULT_COMMENT_PAGE_SIZE,
            path: props.path,
            postId: props.postId,
        };
        this.textArea = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {number: nextProps.number}
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getCommentPageByPostId(this.state.number, this.state.size, this.state.postId)
    }

    componentDidUpdate(prevProps, prevState) {
        let {number, size, postId} = this.state;
        if (number !== prevState.number) {
            this.props.getCommentPageByPostId(number, size, postId)
        }
        if (this.props.updateFlag !== prevProps.updateFlag) {
            this.props.getCommentPageByPostId(number, size, postId, false)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    create = () => this.props.createCommentByPostId(this.props.postId, {content: this.textArea.current.value});

    reply = (username) => {
        if (this.textArea.current) {
            let text = this.textArea.current.value;
            this.textArea.current.value = text === '' ? '@' + username : text.concat(' @' + username)
        }
    };

    retweet = (content) => {
        if (this.textArea.current) {
            let text = this.textArea.current.value;
            this.textArea.current.value = text === '' ? '"' + content + '"' : text.concat(' "' + content + '"')
        }
    };

    render() {
        let {number, path} = this.state;
        let {isAuthenticated, currentUserSummary} = this.props;
        let {inProcess, isFetching, commentList, totalElements, totalPages} = this.props;
        let words = ["Комментарий", "Комментария", "Комментариев"];

        let renderCommentList = commentList.map(comment =>
            <Comment key={comment.id} {...comment} reply={this.reply} retweet={this.retweet}/>
        );

        let renderAuthInviteCard = () => (
            <div className="card auth-invite">
                <div className="card-content">
                    <p>Чтобы иметь возможность оставлять комментарии вам
                        необходимо <a onClick={this.props.toggleManager}>войти</a>
                    </p>
                </div>
            </div>
        );

        let renderCommentArea = () => (
            <div className="media">
                <figure className="media-left">
                    <NavLink to={"/user/profile/" + currentUserSummary.userId}>
                        <Avatar className="is-64x64" imageUrl={currentUserSummary.imageUrl}
                                username={currentUserSummary.username}/>
                    </NavLink>
                </figure>
                <div className="media-content">
                    <div className="field">
                        <p className="control">
                            <textarea className="textarea" placeholder="Написать комментарий..." ref={this.textArea}/>
                        </p>
                    </div>
                    <div className="is-pulled-right">
                        <button className={inProcess ? "button is-primary is-loading" : "button is-primary"}
                                onClick={this.create}>Добавить</button>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="comment-block">
                <div id="counter">
                    <h3><em>{totalElements} {wordEnd(totalElements, words)}</em></h3>
                </div>
                {isFetching ? <Indicator/> : null}
                {this._isMounted && commentList.length !== 0 ? renderCommentList : null}
                <Pagination number={number} path={path + "/comment"} totalPages={totalPages}/>
                {isAuthenticated ? renderCommentArea() : renderAuthInviteCard()}
            </div>
        )
    }
}

CommentPage.propTypes = {
    number: PropTypes.number,
    path: PropTypes.string.isRequired,
    postId: PropTypes.number.isRequired
};

export default connect(
    state => ({
        inProcess: state.comment.inProcess,
        isAuthenticated: state.user.current.accessToken !== null,
        isFetching: state.commentPage.isFetching,
        commentList: state.commentPage.list,
        currentUserSummary: state.user.current.userSummary,
        totalElements: state.commentPage.totalElements,
        totalPages: state.commentPage.totalPages,
        updateFlag: state.comment.updateFlag
    }),
    dispatch => ({
        createCommentByPostId: (postId, body) => dispatch(createCommentByPostId(postId, body)),
        getCommentPageByPostId: (number, size, postId, indicator) => dispatch(getCommentPageByPostId(number, size, postId, indicator)),
        toggleManager: () => dispatch({type: 'TOGGLE_ACCESS_MANAGER'})
    })
)(CommentPage)
