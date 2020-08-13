import React from "react";
import Aside from "../components/Aside";
import ArticleRouter from "./ArticleRouter";
import BlogRouter from "./BlogRouter";
import BookmarksRouter from "./BookmarksRouter";
import DiscussionRouter from "./DiscussionRouter";
import NewsRouter from "./NewsRouter";
import PendingRouter from "./PendingRouter";
import SearchRouter from "./SearchRouter";
import TagRouter from "./TagRouter";
import {Route, Switch} from "react-router-dom";

const RootRouter = () => (
    <div className="app-container">
        <div className="columns">
            <Switch>
                <Route path="/article" component={ArticleRouter}/>
                <Route path="/article/page/:number" component={ArticleRouter}/>
                <Route path="/blog" component={BlogRouter}/>
                <Route path="/blog/page/:number" component={BlogRouter}/>
                <Route path="/bookmark/" component={BookmarksRouter}/>
                <Route path="/bookmark/page/:number" component={BookmarksRouter}/>
                <Route path="/discussion" component={DiscussionRouter}/>
                <Route path="/discussion/page/:number" component={DiscussionRouter}/>
                <Route path="/news" component={NewsRouter}/>
                <Route path="/news/page/:number" component={NewsRouter}/>
                <Route path="/pending" component={PendingRouter}/>
                <Route path="/pending/page/:number" component={PendingRouter}/>
                <Route path="/search" component={SearchRouter}/>
                <Route path="/search/page/:number" component={SearchRouter}/>
                <Route path="/tag/:tagId" component={TagRouter}/>
                <Route path="/tag/:tagId/page/:number" component={TagRouter}/>
            </Switch>
            <Aside/>
        </div>
    </div>
);

export default RootRouter