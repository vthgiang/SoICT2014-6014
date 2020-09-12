import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { CommentInProcess } from './commentInProcess';
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
    render() {
        const { translate } = this.props;
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
                                                    && document.files.map(file =>
                                                        <li style={{ listStyle: "none", wordWrap: "break-word" }}>
                                                            <a href={file.url}>{file.name}</a>
                                                        </li>
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

}

const connectIncomingDataTab = connect(mapState, actions)(withTranslate(IncomingDataTab));
export { connectIncomingDataTab as IncomingDataTab }