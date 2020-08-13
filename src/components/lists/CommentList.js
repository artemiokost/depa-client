import React, {Component} from "react";
import CommentListItem from "./CommentListItem";
import {connect} from "react-redux";
import {getCommentList} from "../../actions/commentListAction";

class CommentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            totalPages: 0
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getCommentList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        let {commentList} = this.props;

        let renderCommentList = commentList.map(comment => <CommentListItem key={comment.id} {...comment}/>);

        if (this._isMounted && commentList.length > 0) return (
            <div className="content comment-list-aside">
                <h4>Последние комментарии</h4>
                <div className="card">
                    <div className="column">
                        {renderCommentList}
                    </div>
                </div>
            </div>
        );
        return null
    }
}

export default connect(
    state => ({
        commentList: state.commentList.list
    }),
    dispatch => ({
        getCommentList: () => dispatch(getCommentList())
    })
)(CommentList)
