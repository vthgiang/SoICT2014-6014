import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { CommentInProcess } from './commentInProcess';
import { ApiImage, Comment } from '../../../../common-components'
import { AuthActions } from '../../../auth/redux/actions';
import { performTaskAction } from '../redux/actions';
import { performtasks } from '../redux/reducers';
class IncomingDataTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showComment: ""
        }
    }
    showComment = async (taskId) => {
        if (this.state.showComment === taskId) {
            this.setState({ showComment: "" });
        } else {
            this.setState({ showComment: taskId });
        }
    }
    isImage = (src) => {
        let string = src.split(".")
        let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
        if (image.indexOf(string[string.length - 1]) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        this.props.downloadFile(path, fileName)
    }
    render() {
        const { translate, performtasks } = this.props;
        const { preceedingTasks } = this.props;
        const { showComment } = this.state;

        let listTask = [];
        if (preceedingTasks) {
            preceedingTasks.forEach(item => {
                listTask.push(item.task);
            })
        }

        return (
            <React.Fragment>
                {
                    listTask && listTask.map((task, key) =>
                        <React.Fragment>
                            <div key={key} className="description-box incoming-content">
                                <h4>{task.name}</h4>
                                {/** Danh sách thông tin */}
                                <strong>{translate('task.task_process.information')}:</strong>
                                {
                                    task.taskInformations && task.taskInformations.length !== 0 ?
                                        task.taskInformations.map((info, key) =>
                                            info.isOutput &&
                                            <ul key={key}>
                                                <li>
                                                    <strong>{info.name}:</strong>
                                                    <span>{info.value}</span>
                                                </li>
                                            </ul>
                                        )
                                        : <span>{translate('task.task_process.not_have_info')}</span>
                                }

                                {/** Danh sách tài liệu */}
                                <div></div>
                                <strong>{translate('task.task_process.document')}:</strong>
                                {
                                    task.documents && task.documents.length !== 0
                                        ? task.documents.map((document, key) =>
                                            document.isOutput &&
                                            <ul key={key}>
                                                <li><strong>{document.description} ({document.files.length} tài liệu)</strong></li>
                                                {
                                                    document.files
                                                    && document.files.length !== 0
                                                    && document.files.map((file, index) =>
                                                        <div key={index}>
                                                            {this.isImage(file.name) ?
                                                                <img
                                                                    className="attachment-img files-attach"
                                                                    style={{ marginTop: "5px" }}
                                                                    src={process.env.REACT_APP_SERVER+file.url}
                                                                    file={file}
                                                                    requestDownloadFile={this.requestDownloadFile}
                                                                />
                                                                :
                                                                <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, file.url, file.name)}> {file.name} </a>
                                                            }
                                                        </div>
                                                    )
                                                }
                                            </ul>
                                        )
                                        : <span>{translate('task.task_process.not_have_doc')}</span>
                                }

                                {/* Comment */}
                                <div style={{ marginTop: 10 }}>
                                    <a style={{ cursor: "pointer" }} onClick={() => this.showComment(task?._id)}>
                                        <b>Trao đổi </b>
                                        {showComment === "" ?
                                            <i className="fa fa-angle-double-down"></i>
                                            : <i className="fa fa-angle-double-up"></i>
                                        }
                                    </a>
                                </div>
                                {showComment === task._id &&
                                    <div style={{ marginTop: 10 }}>
                                        <CommentInProcess
                                            task={task}
                                            inputAvatarCssClass="user-img-incoming-level1"
                                        />
                                        {/* <Comment
                                            data={task}
                                            comments={task.commentsInProcess}
                                            currentTask={performtasks?.task?._id}
                                            createComment={(dataId, data) => this.props.createComment(dataId, data)}
                                            editComment={(dataId, commentId, data) => this.props.editComment(dataId, commentId, data)}
                                            deleteComment={(dataId, commentId) => this.props.deleteComment(dataId, commentId)}
                                            createChildComment={(dataId, commentId, data) => this.props.createChildComment(dataId, commentId, data)}
                                            editChildComment={(dataId, commentId, childCommentId, data) => this.props.editChildComment(dataId, commentId, childCommentId, data)}
                                            deleteChildComment={(dataId, commentId, childCommentId) => this.props.deleteChildComment(dataId, commentId, childCommentId)}
                                            deleteFileComment={(fileId, commentId, dataId) => this.props.deleteFileComment(fileId, commentId, dataId)}
                                            deleteFileChildComment={(fileId, commentId, childCommentId, dataId) => this.props.deleteFileChildComment(fileId, commentId, childCommentId, dataId)}
                                            downloadFile={(path, fileName) => this.props.downloadFile(path, fileName)}
                                        /> */}
                                    </div>
                                }
                            </div>
                        </React.Fragment>
                    )
                }
            </React.Fragment>
        )
    }
}


function mapState(state) {
    const { } = state;
    return {};
}
const actions = {
    downloadFile: AuthActions.downloadFile,
    createComment: performTaskAction.createComment,
    editComment: performTaskAction.editComment,
    deleteComment: performTaskAction.deleteComment,
    createChildComment: performTaskAction.createChildComment,
    editChildComment: performTaskAction.editChildComment,
    deleteChildComment: performTaskAction.deleteChildComment,
    deleteFileComment: performTaskAction.deleteFileComment,
    deleteFileChildComment: performTaskAction.deleteFileChildComment
}

const connectIncomingDataTab = connect(mapState, actions)(withTranslate(IncomingDataTab));
export { connectIncomingDataTab as IncomingDataTab }