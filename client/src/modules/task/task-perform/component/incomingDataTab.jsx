import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { CommentInProcess } from './commentInProcess';
class IncomingDataTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }

    render() {
        const { translate } = this.props;
        let { task } = this.props
        let listTask = [];
        if(task) {
            task.preceedingTasks.forEach(x => {
                listTask.push(x.task)
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
                                <div><strong>{translate('task.task_process.information')}</strong></div>
                                {
                                    task.taskInformations.length !== 0 ? 
                                        task.taskInformations.map((info, key) =>
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
                                    task.documents.length !== 0
                                        ? task.documents.map((document, key) =>
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
                            </div>
                            <CommentInProcess
                                task={task}
                                inputAvatarCssClass="user-img-incoming-level1"
                            />
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