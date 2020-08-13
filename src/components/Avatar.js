import React, {Component} from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {updateUserProfileById} from "../actions/userAction";
import {EMPTY} from "../constants";

class Avatar extends Component {

    static defaultProps = {
        editing: false,
        withMenu: true
    };

    constructor(props) {
        super(props);
        this.state = {
            imageDataUrl: null
        };
        this.input = React.createRef();
        this.menu = React.createRef()
    }

    inputClick = () => this.input.current.click();

    removeImage = () => {
        this.input.current.value = null;
        this.setState({imageDataUrl: null}, () => {
            this.props.updateProfileById(this.props.currentUserSummary.userId, {imageUrl: EMPTY});
            this.props.setAvatar(null)
        });
    };

    toggleMenu = () => this.menu.current.classList.toggle("is-active");

    uploadImage = () => {
        let file = this.input.current.files[0];
        if (file && file.size < 100000) {
            let reader = new FileReader();
            reader.onloadend = () => this.setState({imageDataUrl: reader.result}, () => {
                this.props.updateProfileById(this.props.currentUserSummary.userId,
                    {imageUrl: this.state.imageDataUrl});
                this.props.setAvatar(this.state.imageDataUrl);
                if (this.props.withMenu) {
                    this.toggleMenu()
                }
            });
            reader.readAsDataURL(file)
        } else {
            this.props.setCurrentUserError("File size is higher then 100KB")
        }
    };

    render() {
        let {className, editing, imageUrl, isAuthenticated, username, withMenu} = this.props;

        let renderChar = () => (
            <div className="container has-background-success">
                <div className="is-semibold">{username.match(/[a-zA-Z]/).pop().toUpperCase()}</div>
            </div>
        );

        let renderDefault = () => (
            <div className="container is-centered has-background-grey-light">
                <i className="far fa-camera"/>
            </div>
        );

        let renderImage = () => (
            <div className="container has-background-grey-light">
                <img src={imageUrl} alt="avatar"/>
            </div>
        );

        let renderEditing = () => (
            <div className="avatar-editing" onClick={withMenu ? this.toggleMenu : this.inputClick}>
                <div className="avatar-menu" ref={this.menu}>
                    <a className="avatar-item" onClick={this.inputClick}>Загрузить</a>
                    <a className="avatar-item" onClick={this.removeImage}>Удалить</a>
                    <a className="avatar-item">Отмена</a>
                </div>
                <input type="file" style={{display: "none"}} ref={this.input} onChange={this.uploadImage}/>
            </div>
        );

        return (
            <div className={classNames("avatar", className)}>
                {imageUrl ? renderImage() : null}
                {!imageUrl && username ? renderChar() : null}
                {!imageUrl && !username ? renderDefault() : null}
                {editing && isAuthenticated ? renderEditing() : null}
            </div>
        )
    }
}

Avatar.propTypes = {
    className: PropTypes.string,
    editing: PropTypes.bool,
    imageUrl: PropTypes.string,
    username: PropTypes.string,
    withMenu: PropTypes.bool
};

export default connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null,
        currentUserSummary: state.user.current.userSummary
    }),
    dispatch => ({
        setAvatar: (imageUrl) => dispatch({type: 'SET_AVATAR', imageUrl}),
        setCurrentUserError: (value) => dispatch({type: "SET_CURRENT_USER_ERROR", value}),
        updateProfileById: (profileId, body) => dispatch(updateUserProfileById(profileId, body))
    })
)(Avatar)
