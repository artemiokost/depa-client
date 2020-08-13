import React, {Component, Fragment} from "react";
import classNames from "classnames";
import Aside from "./Aside";
import Breadcrumb, {BREADCRUMB_BUTTON} from "./Breadcrumb";
import Indicator from "../containers/Indicator";
import NotFound from "../containers/errors/NotFound";
import PostListItem from "./lists/PostListItem";
import {connect} from "react-redux";
import {distinct} from "../utils/Helpers";
import {getPostPageByCategoryIdAndTargeting} from "../actions/postPageAction";
import {AdSenseSlot} from "../utils/AdSenseSlot";
import {Helmet} from "react-helmet";
import {Logo} from "../svg/Logo";
import {CATEGORY, DEFAULT_POST_PAGE_SIZE} from "../constants";

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            counter: 1,
            list: [],
            size: DEFAULT_POST_PAGE_SIZE
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.getPageByCategoryId(0, 2, CATEGORY.ARTICLE);
        this.props.getPageByCategoryId(0, 2, CATEGORY.BLOG);
        this.getMore(() => this.setState({isReady: this.state.list.length > 0}));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.isTargeting !== prevProps.isTargeting) {
            this.setState({counter: 1, list: []}, () => this.getMore())
        }
        if (this.props.postList.categoryNews !== prevProps.postList.categoryNews) {
            this.setState({list: this.state.list.concat(this.props.postList.categoryNews).filter(distinct)})
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getMore = (callback) => {
        this.props.getPageByCategoryId(this.state.counter, this.state.size, CATEGORY.NEWS, this.props.isTargeting, callback);
        this.setState({counter: this.state.counter + 1});
    };

    render() {
        let {isFetching, postList, totalPages} = this.props;
        let {isReady, counter, list} = this.state;

        let structuredData = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "url": "https://depa.io/",
            "name": "Depa",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://depa.io/search/{search_term}",
                "query-input": "required name=search_term"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "support@depa.io",
                "url": "https://depa.io/",
                "contactType": "technical support",
                "areaServed": "RU",
                "availableLanguage": ["English", "Russian"]
            },
            "logo": "https://depa.io/img/depa-logo.png",
            "foundingDate": "2018",
            "sameAs": ["https://habr.com/", "https://medium.com/", "https://shazoo.ru/", "https://tutorialzine.com/"]
        };

        let renderArticleList = () => postList.categoryArticle.map(post =>
            <PostListItem key={'a-' + post.id} edge={true} {...post}/>);

        let renderBlogList = () => postList.categoryBlog.map(post =>
            <PostListItem key={'b-' + post.id} {...post}/>);

        let renderNewsList = () => list.map((post, i) =>
            <Fragment key={'n-' + post.id}>
                {i !== 0 && i % 4 === 0 ? AdSenseSlot.renderSlot1() : null}
                <PostListItem {...post}/>
            </Fragment>
        );

        let renderMoreButton = () => (
            isFetching.categoryNews || counter <= totalPages.categoryNews ?
                <div className="container my-1 is-centered">
                    <button className={classNames("button is-primary", {"is-loading": isFetching.categoryNews})}
                            onClick={() => this.getMore()}><i className="far fa-plus"/>Ещё
                    </button>
                </div> : null
        );

        let renderIndicator = () => (
            <Fragment>
                {isFetching.categoryNews && list.length === 0 ?
                    <Indicator/> : null}
                {!isFetching.categoryNews && list.length === 0 ?
                    <NotFound helmet={true} message="Публикации отсутствуют"/> : null}
            </Fragment>
        );

        if (this._isMounted) return (
            <Fragment>
                <Helmet>
                    <title>Главная - Depa</title>
                    <meta name="title" content="Главная страница – Depa"/>
                    <meta name="description" content="Your department of unexpected research"/>
                    <meta property="og:image" content={process.env.PUBLIC_URL + "/img/depa-logo.png"}/>
                    <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
                </Helmet>

                <div className="canopy-home">
                    <div className="container">
                        {isFetching.categoryArticle || isFetching.categoryBlog ?
                            <div className="column p-4 is-centered"><Logo className="heart-beat"/></div> : null}
                        {!isFetching.categoryArticle && !isFetching.categoryBlog ?
                            <div className="columns">
                                <div className="column left-edge">
                                    <div className="columns">
                                        {postList.categoryArticle.length > 0 ?
                                            <div className="column">{renderArticleList()[0]}</div> : null}
                                        {postList.categoryBlog.length > 0 ?
                                            <div className="column content-list">{renderBlogList()}</div> : null}
                                    </div>
                                </div>
                                {postList.categoryArticle.length > 1 ?
                                    <div className="column right-edge">{renderArticleList()[1]}</div> : null}
                            </div> : null}
                    </div>
                </div>
                <div className="app-container">
                    {!isReady ? renderIndicator() : null}
                    {this._isMounted && isReady ?
                        <div className="columns">
                            <div className="column content-list">
                                <Breadcrumb categoryId={CATEGORY.NEWS} buttons={[BREADCRUMB_BUTTON.TARGETING]}/>
                                {renderIndicator()}
                                {list.length > 0 ? renderNewsList() : null}
                                {list.length > 0 ? renderMoreButton() : null}
                            </div>
                            <Aside/>
                        </div> : null}
                </div>
            </Fragment>
        );
        return null
    }
}

export default connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null,
        isTargeting: state.user.current.accessToken !== null && state.breadcrumb.isTargeting,
        isFetching: {
            categoryArticle: state.postPage.categoryArticle.isFetching,
            categoryBlog: state.postPage.categoryBlog.isFetching,
            categoryNews: state.postPage.categoryNews.isFetching,
            withoutCategory: state.postPage.withoutCategory.isFetching
        },
        postList: {
            categoryArticle: state.postPage.categoryArticle.list,
            categoryBlog: state.postPage.categoryBlog.list,
            categoryNews: state.postPage.categoryNews.list,
            withoutCategory: state.postPage.withoutCategory.list
        },
        totalPages: {
            categoryArticle: state.postPage.categoryArticle.totalPages,
            categoryBlog: state.postPage.categoryBlog.totalPages,
            categoryNews: state.postPage.categoryNews.totalPages,
            withoutCategory: state.postPage.withoutCategory.totalPages
        }
    }),
    dispatch => ({
        getPageByCategoryId: (number, size, categoryId, targeting, callback) =>
            dispatch(getPostPageByCategoryIdAndTargeting(number, size, categoryId, targeting, true, callback))
    })
)(Home)
