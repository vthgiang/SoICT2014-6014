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
        let { task } = this.props
        let { showComment } = this.state
        let information,document
        let listTask = [];
        if (task) {
            if(task.taskInformations) {
                information = task.taskInformations
            }
            if(task.document) {
                document = task.document
            }
            task.preceedingTasks.forEach(x => {
                listTask.push(x.task)
            })
        }
        return (
            <React.Fragment>
                {
                    listTask && listTask.map((task, key) =>
                        <React.Fragment
                        >
                            <div key={key} className="description-box incoming-content">
                                <h4>{task.name}</h4>
                                {/** Danh sách thông tin */}
                                <div><strong>{translate('task.task_process.information')}</strong></div>
                                {
                                    information.length !== 0 ?
                                    information.map((info, key) =>
                                            info.isOutput &&
                                            <div key={key}>
                                                <ul>
                                                    <strong>{info.name}</strong>
                                                    <span> - {info.description}</span>
                                                    <span> - {info.type}</span>
                                                </ul>
                                            </div>
                                        )
                                        : <div>{translate('task.task_process.not_export_info')}</div>
                                }

                                {/** Danh sách tài liệu */}
                                <div><strong>{translate('task.task_process.document')}</strong></div>
                                {
                                    document.length !== 0
                                        ? document.map((document, key) =>
                                            document.isOutput &&
                                            <div key={key}>
                                                <ul>
                                                    <li style={{ listStyle: "none" }}><strong>{document.description}</strong></li>
                                                    <ul>
                                                        {
                                                            document.files
                                                            && document.files.length !== 0
                                                            && document.files.map(file =>
                                                                <li style={{ listStyle: "none", wordWrap: "break-word" }}>
                                                                    <strong>{file.name} </strong><span><a>{file.url}</a></span>
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                </ul>
                                            </div>
                                        )
                                        : <div>{translate('task.task_process.not_have_doc')}</div>
                                }
                                <a style={{ cursor: "pointer" }} onClick={() => this.showComment(task?._id)}><b>Bình luận </b></a>
                                {showComment === "" ?
                                    <i className="fa fa-angle-double-up"></i>
                                    : <i className="fa fa-angle-double-down"></i>
                                }
                                {showComment === task._id &&
                                    <CommentInProcess
                                        task={task}
                                        inputAvatarCssClass="user-img-incoming-level1"
                                    />
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