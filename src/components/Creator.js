import React, {Component} from "react";
import classNames from "classnames";
import Creatable from "react-select/creatable";
import Cropper from "react-cropper";
import Dropzone from "react-dropzone";
import EaselEditor from "depa-easel/lib/components/EaselEditor";
import Select from "react-select";
import Unauthorized from "../containers/errors/Unauthorized";
import {connect} from "react-redux";
import {createPostByCategoryId} from "../actions/postAction";
import {editorStateFromRaw, editorStateToJSON} from "depa-easel/lib/utils";
import {request} from "../utils/APIUtils";
import {Helmet} from "react-helmet";
import {API_BASE_URL, CATEGORY, ROLE, TAG_REGEX, URL_REGEX} from "../constants";
import {REACT_SELECT_STYLES} from "../constants/defaultStyles";
import "cropperjs/dist/cropper.css"
import "depa-easel/dist/css/easel.css"

class Creator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isAttempt: false,
            isEditor: true,
            readOnly: false,
            categoryId: CATEGORY.BLOG,
            editorState: editorStateFromRaw(null),
            imageUrl: null,
            imageDataUrl: null,
            tagList: [],
            tagOptionList: [],
        };
        this.cropper = React.createRef();
        this.originNameInput = React.createRef();
        this.originUrlInput = React.createRef();
        this.titleInput = React.createRef()
    }

    componentDidMount() {
        this.getTagOptionList()
    }

    create = () => {
        let {isAuthenticated, currentUserSummary} = this.props;
        let {isAttempt, categoryId} = this.state;
        let isContributor, body, origin, originName, originUrl, tags;

        if (isAuthenticated) isContributor = currentUserSummary.roles.includes(ROLE.CONTRIBUTOR);
        if (isContributor && categoryId !== CATEGORY.DISCUSSION) {
            originName = this.originNameInput.current.value;
            originUrl = this.originUrlInput.current.value;
            origin = originName && URL_REGEX.test(originUrl) ? {name: originName, url: originUrl} : null;
        }
        tags = this.state.tagList.map(tag => tag.trim()).filter(tag => TAG_REGEX.test(tag));
        tags = tags.length === 0 ? ["Other"] : tags.slice(0, 8);
        body = {
            content: editorStateToJSON(this.state.editorState),
            imageUrl: this.state.imageUrl,
            title: this.titleInput.current.value,
            origin: origin,
            tags: tags
        };
        this.props.createByCategoryId(categoryId, body, () =>
            !isAttempt ? this.setState({isAttempt: true}) : null)
    };

    getTagOptionList = (searchKey) => {
        searchKey = searchKey ? searchKey : "";
        request({
            url: API_BASE_URL + "post/tag/page/" + 0 + '/' + 8 + "/match/" + searchKey,
            method: "GET"
        }).then(response => {
            this.setState({
                tagOptionList: response.list.map(tag => Object.create({value: tag.name, label: tag.name}))
            });
        })
    };

    handleCategory = (e) => {
        let categoryId = Number.parseInt(e.target.value);
        this.setState({categoryId: categoryId});
        if (categoryId === CATEGORY.DISCUSSION) this.removeImage()
    };

    handleEditorState = (editorState) => this.setState({editorState});

    handleTab = (e) => {
        switch (e.currentTarget.getAttribute("id")) {
            case "editor":
                this.setState({isEditor: true});
                break;
            case "html":
                this.setState({isEditor: false});
                break;
            default:
                break;
        }
    };

    handleTagList = (list) => this.setState({tagList: list ? list.map(option => option.value) : null});

    onCrop = () => {
        this.setState({imageUrl: this.cropper.current.getCroppedCanvas().toDataURL("image/jpeg")});
    };

    onDrop = (files) => {
        let file = files[0];
        if (file && file.size < 4000000) {
            let reader = new FileReader();
            reader.onloadend = () => this.setState({imageDataUrl: reader.result});
            reader.readAsDataURL(file)
        }
    };

    removeImage = () => this.setState({imageUrl: null, imageDataUrl: null});

    render() {
        let {isAttempt, isEditor, readOnly, categoryId, editorState, imageDataUrl, tagOptionList} = this.state;
        let {inProcess, isAuthenticated, currentUserSummary, error} = this.props;
        let isContributor;

        if (isAuthenticated) isContributor = currentUserSummary.roles.includes(ROLE.CONTRIBUTOR);

        let renderImageCropper = () => (
            <Cropper
                aspectRatio={20 / 9}
                crop={this.onCrop}
                guides={false}
                ref={this.cropper}
                src={imageDataUrl}
                style={{maxHeight: 576, width: "100%"}}/>
        );

        let renderImageDropzone = () => (
            <Dropzone onDrop={this.onDrop}>
                {({getRootProps, getInputProps}) => (
                    <div className="drag-n-drop" {...getRootProps()}>
                        <input {...getInputProps()}/>
                        <p>Перетащите изображение...</p>
                    </div>
                )}
            </Dropzone>
        );

        if (!isAuthenticated) return <Unauthorized/>;
        return (
            <div className="app-container">
                <Helmet>
                    <title>Центр творчесва - Depa</title>
                    <meta name="description" content="Creator"/>
                </Helmet>

                <div className="content creator">
                    <section id="title">
                        <h4>Заголовок</h4>
                        <div className="control">
                            <input className="input" type="text" placeholder="Заголовок" ref={this.titleInput}/>
                        </div>
                    </section>
                    {categoryId !== CATEGORY.DISCUSSION ?
                        <section id="image">
                            <div className="bi-line">
                                <h4>Изображение *</h4>
                                {imageDataUrl ? <a className="bi-line-item" onClick={this.removeImage}>
                                    <i className="far fa-trash"/></a> : null}
                            </div>
                            {imageDataUrl ? renderImageCropper() : renderImageDropzone()}
                        </section> : null}
                    <section id="editor">
                        <div className="tabs is-right">
                            <ul>
                                <li className={isEditor ? 'is-active' : null}>
                                    <a id="editor" onClick={this.handleTab}>
                                        <span className="icon"><i className="fas fa-pencil-alt"/></span>
                                        <span>Редактор</span>
                                    </a>
                                </li>
                                <li className={!isEditor ? 'is-active' : null}>
                                    <a id="html" onClick={this.handleTab}>
                                        <span className="icon"><i className="fas fa-code"/></span>
                                        <span>HTML</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {isEditor ?
                            <EaselEditor editorState={editorState} onChange={this.handleEditorState}
                                         readOnly={readOnly}/> :
                            <textarea className="textarea" placeholder={"HTML редактор в данный момент " +
                            "недоступен и скорее всего данная функция будет в дальнейшем исключена"}/>}
                    </section>
                    <section id="category">
                        <h4>Категория</h4>
                        <div className="control">
                            {isContributor ?
                                <label className="radio">
                                    <input type="radio" name="categoryRadio" value={CATEGORY.NEWS}
                                           defaultChecked={categoryId === CATEGORY.NEWS}
                                           onChange={this.handleCategory}/> Новость
                                </label> : null}
                            {isContributor ?
                                <label className="radio">
                                    <input type="radio" name="categoryRadio" value={CATEGORY.ARTICLE}
                                           defaultChecked={categoryId === CATEGORY.ARTICLE}
                                           onChange={this.handleCategory}/> Статья
                                </label> : null}
                            <label className="radio">
                                <input type="radio" name="categoryRadio" value={CATEGORY.BLOG}
                                       defaultChecked={categoryId === CATEGORY.BLOG}
                                       onChange={this.handleCategory}/> Блог
                            </label>
                            <label className="radio">
                                <input type="radio" name="categoryRadio" value={CATEGORY.DISCUSSION}
                                       defaultChecked={categoryId === CATEGORY.DISCUSSION}
                                       onChange={this.handleCategory}/> Обсуждение
                            </label>
                        </div>
                    </section>
                    {isContributor && categoryId !== CATEGORY.DISCUSSION ?
                        <section id="origin">
                            <h4>Источник</h4>
                            <div className="control is-flex">
                                <input className="input" type="text" placeholder="Источник"
                                       ref={this.originNameInput} style={{marginRight: "1rem"}}/>
                                <input className="input" type="text" placeholder="Ссылка"
                                       ref={this.originUrlInput}/>
                            </div>
                        </section> : null}
                    <section id="tags">
                        <h4>Тэги</h4>
                        <div className="control">
                            {isContributor ?
                                <Creatable closeMenuOnSelect={false}
                                           isMulti
                                           maxMenuHeight={180}
                                           options={tagOptionList}
                                           styles={REACT_SELECT_STYLES}
                                           onChange={this.handleTagList}
                                           onInputChange={this.getTagOptionList}/> :
                                <Select closeMenuOnSelect={false}
                                        isMulti
                                        maxMenuHeight={180}
                                        options={tagOptionList}
                                        styles={REACT_SELECT_STYLES}
                                        onChange={this.handleTagList}
                                        onInputChange={this.getTagOptionList}/>}
                        </div>
                    </section>
                    <section id="submit" className="creator-submit">
                        <p id="footnote">
                            {categoryId !== CATEGORY.DISCUSSION ? "* Ограничение по размеру 4MB" : null}
                        </p>
                        <button className={classNames("button is-success", {"is-loading": inProcess})}
                                onClick={this.create}>Создать
                        </button>
                    </section>
                    {isAttempt && !inProcess ?
                        <section id="info">
                            {error ?
                                <div className="notification is-danger">
                                    Процесс завершился неудачей {error.message ? error.message : null}
                                </div> :
                                <div className="notification is-success">
                                    Процесс завершился успешно
                                </div>}
                        </section> : null}
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        error: state.post.error,
        isAuthenticated: state.user.current.accessToken !== null,
        inProcess: state.post.inProcess,
        currentUserSummary: state.user.current.userSummary
    }),
    dispatch => ({
        createByCategoryId: (categoryId, body, callback) => dispatch(createPostByCategoryId(categoryId, body, callback))
    })
)(Creator)
