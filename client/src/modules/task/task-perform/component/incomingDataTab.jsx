import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
// import { CommentInProcess } from './commentInProcess';
class IncomingDataTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            taskId: undefined,
            task: undefined,
            infoTaskProcess: undefined
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isIncomingData && nextProps.taskId !== prevState.taskId) {
            let infoTaskProcess = {};
            for (let i in nextProps.infoTaskProcess) {
                infoTaskProcess[`${nextProps.infoTaskProcess[i]._id}`] = nextProps.infoTaskProcess[i];
            }

            return {
                ...prevState,
                taskId: nextProps.taskId,
                task: nextProps.task,
                infoTaskProcess: infoTaskProcess
            }
        } else {
            return null
        }
    }

    render() {
        const { translate } = this.props;
        const { task, infoTaskProcess } = this.state;
        let listTask = [];

        if (task && task.length !== 0 && task.preceedingTasks && task.preceedingTasks.length !== 0 && infoTaskProcess) {
            task.preceedingTasks.map((item, index) => {
                if (infoTaskProcess[`${item.task && item.task._id}`]) {
                    listTask[index] = {};
                    listTask[index].name = infoTaskProcess[`${item.task && item.task._id}`].name;

                    if (infoTaskProcess[`${item.task && item.task._id}`].taskInformations && infoTaskProcess[`${item.task && item.task._id}`].taskInformations.length !== 0) {
                        listTask[index].informations = infoTaskProcess[`${item.task && item.task._id}`].taskInformations.filter(info => info.isOutput);
                    } else {
                        listTask[index].informations = []
                    }

                    if (infoTaskProcess[`${item.task && item.task._id}`].documents && infoTaskProcess[`${item.task && item.task._id}`].documents.length !== 0) {
                        listTask[index].documents = infoTaskProcess[`${item.task && item.task._id}`].documents.filter(document => document.isOutput);
                    } else {
                        listTask[index].documents = []
                    }

                }
            })
        }

        return (
            <React.Fragment>
                {
                    listTask.length !== 0
                    && listTask.map((task, key) =>
                        <React.Fragment>
                            <div key={key} className="description-box">
                                <h4>{task.name}</h4>

                                {/** Danh sách thông tin */}
                                <div><strong>{translate('task.task_process.information')}</strong></div>
                                {
                                    task.informations.length !== 0
                                        ? task.informations.map((info, key) =>
                                            info.isOutput &&
                                            <div key={key}>
                                                <ul>
                                                    <strong>{info.name}</strong>
                                                    <span> - {info.description}</span>
                                                    <span> - {info.type}</span>
                                                </ul>
                                            </div>
                                        )
                                        : <div>{task.name} {translate('task.task_process.not_export_info')}</div>
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
                                        : <div>{task.name} {translate('task.task_process.not_have_doc')}</div>
                                }
                            </div>
                            {/* <CommentInProcess
                                task={task}
                                inputAvatarCssClass="user-img-incoming-level1"
                            /> */}
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