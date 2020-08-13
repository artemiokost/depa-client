import React, {Component, Fragment} from "react";
import Breadcrumb from "../Breadcrumb";
import Indicator from "../../containers/Indicator";
import NotFound from "../../containers/errors/NotFound";
import Pagination from "../Pagination";
import PostPageItem from "./PostPageItem";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getUserBookmarkList} from "../../actions/userAction";
import {
    getPostPageByBookmark,
    getPostPageByCategoryId,
    getPostPageByCategoryIdAndTagId,
    getPostPageByMatch,
    getPostPageByPending,
    getPostPageByTagId
} from "../../actions/postPageAction";
import {AdSenseSlot} from "../../utils/AdSenseSlot";
import {Helmet} from "react-helmet";
import {CATEGORY, DEFAULT_POST_PAGE_SIZE} from "../../constants";

class PostPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookmark: props.bookmark,
            categoryId: props.categoryId,
            number: 1,
            path: props.match.path,
            pending: props.pending,
            searchKey: props.match.params.searchKey,
            size: DEFAULT_POST_PAGE_SIZE,
            tagId: props.match.params.tagId
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let number = Number(nextProps.match.params.number);
        return {
            bookmark: nextProps.bookmark,
            categoryId: nextProps.categoryId,
            number: number ? number : 1,
            path: nextProps.match.path,
            pending: nextProps.pending,
            searchKey: nextProps.match.params.searchKey,
            tagId: nextProps.match.params.tagId
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetch()
    }

    componentDidUpdate(prevProps, prevState) {
        let {bookmark, categoryId, number, pending, searchKey, tagId} = this.state;
        if (number !== prevState.number || searchKey !== prevState.searchKey ||
            bookmark !== prevState.bookmark || pending !== prevState.pending ||
            categoryId !== prevState.categoryId || tagId !== prevState.tagId) {
            this.fetch()
        }
        if (this.props.updateFlag !== prevProps.updateFlag) {
            this.fetch(false)
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    fetch = (indicator) => {
        let {bookmark, categoryId, number, pending, searchKey, size, tagId,} = this.state;
        if (bookmark) {
            this.props.getBookmarkList();
            this.props.getPageByBookmark(number, size, bookmark, indicator);
        }
        if (categoryId && tagId) this.props.getPageByCategoryIdAndTagId(number, size, categoryId, tagId, indicator);
        if (categoryId && !tagId) this.props.getPageByCategoryId(number, size, categoryId, indicator);
        if (pending) this.props.getPageByPending(number, size, pending, indicator);
        if (searchKey) this.props.getPageByMatch(number, size, searchKey, indicator);
        if (tagId) this.props.getPageByTagId(number, size, tagId, indicator)
    };

    switchCategoryPath = (categoryId) => {
        switch (categoryId) {
            case 1: return "/article";
            case 2: return "/blog";
            case 3: return "/news";
            case 4: return "/discussion";
            default: return ''
        }
    };

    render() {
        let {bookmark, categoryId, number, path, searchKey, tagId} = this.state;
        let {isFetching, management, postList, totalPages} = this.props;

        if (categoryId && !tagId) {
            path = this.switchCategoryPath(categoryId);
        } else if (bookmark) {
            path = "/bookmark";
        } else {
            path = path.substring(0, path.indexOf(':'));
            if (searchKey) {
                path = path + searchKey;
            } else if (tagId) {
                path = path + tagId;
            }
        }

        switch (categoryId) {
            case CATEGORY.ARTICLE:
                isFetching = isFetching.categoryArticle;
                postList = postList.categoryArticle;
                totalPages = totalPages.categoryArticle;
                break;
            case CATEGORY.BLOG:
                isFetching = isFetching.categoryBlog;
                postList = postList.categoryBlog;
                totalPages = totalPages.categoryBlog;
                break;
            case CATEGORY.NEWS:
                isFetching = isFetching.categoryNews;
                postList = postList.categoryNews;
                totalPages = totalPages.categoryNews;
                break;
            case CATEGORY.DISCUSSION:
                isFetching = isFetching.categoryDiscussion;
                postList = postList.categoryDiscussion;
                totalPages = totalPages.categoryDiscussion;
                break;
            default:
                isFetching = isFetching.withoutCategory;
                postList = postList.withoutCategory;
                totalPages = totalPages.withoutCategory;
                break;
        }

        let renderPostList = () => postList.map((post, i) =>
            <Fragment key={'n-' + post.id}>
                {i !== 0 && i % 3 === 0 ? AdSenseSlot.renderSlot1() : null}
                <PostPageItem management={management} mini={post.categoryId === CATEGORY.DISCUSSION} {...post}/>
            </Fragment>
        );

        return (
            <Fragment>
                <Helmet>
                    {categoryId === CATEGORY.ARTICLE ? <title>Статьи - Depa</title> : null}
                    {categoryId === CATEGORY.BLOG ? <title>Блоги - Depa</title> : null}
                    {categoryId === CATEGORY.NEWS ? <title>Новости - Depa</title> : null}
                    {categoryId === CATEGORY.DISCUSSION ? <title>Обсуждения - Depa</title> : null}
                    {categoryId == null ? <title>Все посты - Depa</title> : null}
                    <meta name="description" content="Post page"/>
                </Helmet>

                <div className="column content-page">
                    <Breadcrumb {...this.state}/>
                    {isFetching ? <Indicator/> : null}
                    {!isFetching && postList.length === 0 ? <NotFound helmet={true} message="Содержимое не найдено :("/> : null}
                    {this._isMounted && postList.length > 0 ? renderPostList() : null}
                    <Pagination number={number} path={path} totalPages={totalPages}/>
                </div>
            </Fragment>
        );
    }
}

PostPage.propTypes = {
    management: PropTypes.bool,
    categoryId: PropTypes.number,
    number: PropTypes.number,
    searchKey: PropTypes.number,
    tagId: PropTypes.number
};

export default connect(
    state => ({
        isFetching: {
            categoryArticle: state.postPage.categoryArticle.isFetching,
            categoryBlog: state.postPage.categoryBlog.isFetching,
            categoryNews: state.postPage.categoryNews.isFetching,
            categoryDiscussion: state.postPage.categoryDiscussion.isFetching,
            withoutCategory: state.postPage.withoutCategory.isFetching
        },
        postList: {
            categoryArticle: state.postPage.categoryArticle.list,
            categoryBlog: state.postPage.categoryBlog.list,
            categoryNews: state.postPage.categoryNews.list,
            categoryDiscussion: state.postPage.categoryDiscussion.list,
            withoutCategory: state.postPage.withoutCategory.list
        },
        totalPages: {
            categoryArticle: state.postPage.categoryArticle.totalPages,
            categoryBlog: state.postPage.categoryBlog.totalPages,
            categoryNews: state.postPage.categoryNews.totalPages,
            categoryDiscussion: state.postPage.categoryDiscussion.totalPages,
            withoutCategory: state.postPage.withoutCategory.totalPages
        },
        updateFlag: state.post.updateFlag
    }),
    dispatch => ({
        getBookmarkList: (size) => dispatch(getUserBookmarkList(size)),
        getPageByBookmark: (number, size, value, indicator) =>
            dispatch(getPostPageByBookmark(number, size, value, indicator)),
        getPageByCategoryId: (number, size, categoryId, indicator) =>
            dispatch(getPostPageByCategoryId(number, size, categoryId, indicator)),
        getPageByCategoryIdAndTagId: (number, size, categoryId, tagId, indicator) =>
            dispatch(getPostPageByCategoryIdAndTagId(number, size, categoryId, tagId, indicator)),
        getPageByMatch: (number, size, searchKey, indicator) =>
            dispatch(getPostPageByMatch(number, size, searchKey, indicator)),
        getPageByPending: (number, size, pending, indicator) =>
            dispatch(getPostPageByPending(number, size, pending, indicator)),
        getPageByTagId: (number, size, tagId, indicator) => dispatch(getPostPageByTagId(number, size, tagId, indicator))
    })
)(PostPage)
