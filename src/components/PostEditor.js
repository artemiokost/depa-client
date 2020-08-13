import React, {Component, Fragment} from "react";
import Dialog from "./modals/Dialog";
import EaselEditor from "depa-easel/lib/components/EaselEditor";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {editorStateFromRaw, editorStateToJSON} from "depa-easel/lib/utils";
import {updatePostById} from "../actions/postAction";
import "depa-easel/dist/css/easel.css";

class PostEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isDialog: false,
            readOnly: true,
            editorState: editorStateFromRaw(null),
            initialEditorState: editorStateFromRaw(null)
        };
    }

    componentDidMount() {
        let initialEditorState = editorStateFromRaw(this.props.post.content);
        this.setState({
            editorState: initialEditorState,
            initialEditorState: initialEditorState
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.editorFlag !== prevProps.editorFlag) {
            if (this.state.editorState !== this.state.initialEditorState) {
                this.setState({isDialog: true})
            } else {
                this.toggleReadOnly();
                this.props.toggleEditorButton();
            }
        }
    }

    cancelChanges = () => {
        this.setState({editorState: this.state.initialEditorState, isDialog: false}, () => {
            this.toggleReadOnly();
            this.props.toggleEditorButton()
        });
    };

    closeDialog = () => this.setState({isDialog: false});

    handleEditorState = (editorState) => this.setState({editorState});

    toggleReadOnly = () => this.setState({readOnly: !this.state.readOnly});

    update = () => {
        this.setState({
            initialEditorState: this.state.editorState,
            isDialog: false
        });
        this.toggleReadOnly();
        this.props.toggleEditorButton();
        this.props.updateById(this.props.post.id, {content: editorStateToJSON(this.state.editorState)})
    };

    render() {
        return (
            <Fragment>
                <EaselEditor editorState={this.state.editorState}
                             onChange={this.handleEditorState}
                             readOnly={this.props.isAuthenticated ? this.state.readOnly : true}/>
                {this.state.isDialog ?
                    <Dialog action={this.update}
                            cancelAction={this.cancelChanges}
                            closeAction={this.closeDialog}
                            message="Сохранить изменения?"/> : null}
            </Fragment>
        )
    }
}

PostEditor.propTypes = {
    editorFlag: PropTypes.bool.isRequired,
    post: PropTypes.any.isRequired,
    toggleEditorButton: PropTypes.func.isRequired
};

export default connect(
    state => ({
        isAuthenticated: state.user.current.accessToken !== null
    }),
    dispatch => ({
        updateById: (postId, body) => dispatch(updatePostById(postId, body))
    })
)(PostEditor)
