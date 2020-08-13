import React, {Component} from "react";
import classNames from "classnames";
import Breadcrumb from "../Breadcrumb";
import Indicator from "../../containers/Indicator";
import NotFound from "../../containers/errors/NotFound";
import PostListItem from "../lists/PostListItem";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {distinct} from "../../utils/Helpers";
import {request} from "../../utils/APIUtils";
import {API_BASE_URL, CATEGORY, DEFAULT_POST_PAGE_SIZE} from "../../constants";

class PostList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFetching: true,
            counter: 1,
            list: [],
            size: DEFAULT_POST_PAGE_SIZE,
            totalPages: 0
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.getMore();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.userId !== prevProps.userId) {
            this.setState({counter: 0, list: [], totalPages: 0}, () => this.getMore());
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getMore = () => {
        if (this._isMounted) {
            let {categoryId, userId} = this.props;
            let {counter, size} = this.state;
            let queryParam;
            if (categoryId) queryParam = "/category/" + categoryId;
            if (userId) queryParam = "/user/" + userId;
            this.setState({isFetching: true});
            request({
                url: API_BASE_URL + "post/page/" + counter + '/' + size + queryParam,
                method: "GET"
            }).then(response => {
                this.setState({
                    isFetching: false,
                    counter: this.state.counter + 1,
                    list: this.state.list.concat(response.list).filter(distinct),
                    totalPages: response.totalPages
                });
            }).catch(() => this.setState({isFetching: false}))
        }
    };

    render() {
        let {management, categoryId, userSummary} = this.props;
        let {counter, isFetching, list, totalPages} = this.state;

        let renderPostList = () => list.map((post, i) =>
            <PostListItem management={management} mini={post.categoryId === CATEGORY.DISCUSSION} {...post}/>
        );

        let renderMoreButton = () => (
            <button className={classNames("button is-primary", {"is-loading": isFetching})}
                    onClick={this.getMore}><i className="far fa-plus"/>Ещё</button>
        );

        return (
            <div className="column content-list">
                <Breadcrumb categoryId={categoryId} searchKey={userSummary ? userSummary.username : null}/>
                {isFetching && list.length === 0 ? <Indicator/> : null}
                {!isFetching && list.length === 0 ? <NotFound helmet={true} message="Публикации отсутствуют"/> : null}
                {this._isMounted && list.length > 0 ? renderPostList() : null}
                {counter <= totalPages ? <div className="container my-1 is-centered">{renderMoreButton()}</div> : null}
            </div>
        )
    }
}

PostList.propTypes = {
    management: PropTypes.bool,
    categoryId: PropTypes.number,
    userId: PropTypes.number
};

export default connect(
    state => ({
        userSummary: state.user.other.userSummary
    })
)(PostList)
