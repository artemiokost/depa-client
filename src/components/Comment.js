import React, {Component} from "react";
import classNames from "classnames";
import Avatar from "./Avatar";
import {connect} from "react-redux";
import {fromNow} from "../utils/Helpers";
import {deleteCommentById} from "../actions/commentAction";
import {NavLink} from "react-router-dom";
import {API_BASE_URL, ROLE} from "../constants";
import {request} from "../utils/APIUtils";

class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            voteId: null,
            voteValue: null
        };
    }

    componentDidMount() {
        let {isAuthenticated, currentUserSummary, extra} = this.props;
        let {votes} = extra;
        if (isAuthenticated) {
            let vote = votes.filter(vote => vote.createdBy === currentUserSummary.userId)[0];
            if (vote) this.setState({voteId: vote.id, voteValue: vote.value})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let {isAuthenticated, currentUserSummary, extra} = this.props;
        let {votes} = extra;
        if (isAuthenticated !== prevProps.isAuthenticated) {
            if (isAuthenticated) {
                let vote = votes.filter(vote => vote.createdBy === currentUserSummary.userId)[0];
                if (vote) this.setState({voteId: vote.id, voteValue: vote.value})
            } else {
                this.setState({voteId: null, voteValue: null});
            }
        }
    }

    createVote = () => {
        request({
            url: API_BASE_URL + "post/comment/" + this.props.id + "/vote/" + true,
            method: 'POST'
        }).then((response) => {
            this.setState({voteId: response.id, voteValue: response.value});
        })
    };

    delete = () => this.props.deleteCommentById(this.props.id);

    deleteVote = () => {
        request({
            url: API_BASE_URL + "post/comment/vote/" + this.state.voteId,
            method: 'DELETE'
        }).then(() => {
            this.setState({voteId: null, voteValue: null});
        })
    };

    render() {
        let {isAuthenticated, content, createdAt, createdBy, currentUserSummary, reply, retweet, extra} = this.props;
        let {voteValue} = this.state;
        let {creatorSummary} = extra;
        let hasAuthority;

        if (isAuthenticated) {
            hasAuthority = currentUserSummary.roles.includes(ROLE.MODERATOR) || createdBy === currentUserSummary.userId
        }

        return (
            <div className="media">
                <figure className="media-left">
                    <NavLink to={"/user/profile/" + creatorSummary.userId}>
                        <Avatar className="is-64x64"
                                imageUrl={creatorSummary.imageUrl}
                                username={creatorSummary.username}/>
                    </NavLink>
                </figure>
                <div className="media-content">
                    <strong>{creatorSummary.fullName} </strong>
                    <small>
                        <NavLink to={"/user/profile/" + creatorSummary.userId}>@{creatorSummary.username} </NavLink>
                    </small>
                    <small>{fromNow(createdAt)}</small>
                    <p>{content}</p>
                    <nav className="level is-mobile">
                        <div className="level-left">
                            <a className="level-item" onClick={() => reply(creatorSummary.username)}>
                                <i className="fas fa-reply fa-sm"/>
                            </a>
                            <a className="level-item" onClick={() => retweet(content)}>
                                <i className="fas fa-retweet fa-sm"/>
                            </a>
                            <a className={classNames("level-item", {"is-purple": voteValue})}
                               onClick={voteValue ? this.deleteVote : this.createVote}>
                                <i className="fas fa-heart fa-sm"/>
                            </a>
                        </div>
                    </nav>
                </div>
                <div className="media-right">
                    {hasAuthority ? <button className="delete" onClick={this.delete}/> : null}
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null,
        currentUserSummary: state.user.current.userSummary
    }),
    dispatch => ({
        deleteCommentById: (commentId) => dispatch(deleteCommentById(commentId))
    })
)(Comment)
