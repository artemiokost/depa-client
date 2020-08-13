import rootReducer from "../reducers";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import {composeWithDevTools} from "redux-devtools-extension";
import {applyMiddleware, createStore} from "redux";
import {persistReducer, persistStore} from "redux-persist";

const initialListState = {
    error: null,
    isFetching: false,
    list: []
};

const initialPageState = {
    error: null,
    isFetching: false,
    list: [],
    updateFlag: false,
    totalElements: 0
};

const initialUserState = {
    inProcess: false,
    isFetching: false,
    updateFlag: false,
    error: null,
    subscriptions: [],
    userSummary: Object.create(null)
};

const initialState = {
    accessManager: {
        isOpen: false,
        isRecovery: false,
        isResult: false,
        isSignIn: true,
        isSignUp: false
    },
    breadcrumb: {
        isTargeting: false
    },
    comment: {
        id: null,
        content: null,
        error: null,
        extra: {
            creatorSummary: {},
            votes: null
        },
        updateFlag: false
    },
    commentList: initialListState,
    commentPage: initialPageState,
    post: {
        id: null,
        body: '',
        content: null,
        error: null,
        extra: {
            claps: null,
            commentCount: null,
            creatorSummary: {},
            origin: null,
            tags: null
        },
        updateFlag: false
    },
    postPage: {
        categoryArticle: initialPageState,
        categoryBlog: initialPageState,
        categoryNews: initialPageState,
        categoryDiscussion: initialPageState,
        searchPreview: initialPageState,
        withoutCategory: initialPageState
    },
    user: {
        current: {
            ...initialUserState,
            accessToken: null,
            bookmarks: []
        },
        other: initialUserState
    }
};

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, initialState, composeWithDevTools(applyMiddleware(thunk)));
const persistor = persistStore(store);

export {store, persistor}