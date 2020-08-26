import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';

class OutgoingDataTab extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            taskId: undefined,
            task: undefined,
            isOutput: true
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.taskId !== prevState.taskId) {

            return {
                ...prevState,
                taskId: nextProps.taskId,
                task: nextProps.task,
            }
        }
    }

    handleCheckBoxOutputInformation = (info) => {

    }

    handleCheckBoxOutputDocument = (task, document) => {
        let data = {
            description: document.description,
            isOutput: !document.isOutput,
            files: document.files
        }
        this.props.editDocument(document._id, task._id, data);
        // this.props.getTaskById(task._id);
    }

    render() {
        const { task, isOutput } = this.state;

        return (
            <React.Fragment>
                <div className="description-box">
                    <div className="row">
                    {
                        task
                        && task.taskInformations
                        && task.taskInformations.length !== 0
                        ? task.taskInformations.map(info => 
                            <fieldset className="scheduler-border" style={{ padding: "1em", margin: "0.75em 1.5em 0.75em 1em" }}>
                                <div className="col-md-7">
                                    <strong>Tên: </strong>
                                    <span>{info.name}</span>
                                </div>
                                <div className="col-md-5">
                                    <strong>Kiểu dữ liệu: </strong>
                                    <span>{info.type}</span>
                                </div>
                                <div className="col-md-7">
                                    <strong>Mô tả: </strong>
                                    <span>{info.description}</span>
                                </div>
                                <div className="col-md-5">
                                    <strong>Xuất dữ liệu </strong>
                                    <input
                                        type="checkbox"
                                        style={{ margin: "0.5em 0.5em", padding: "0.6em" }}
                                        name={info.description}
                                        onClick={() => this.handleCheckBoxOutputInformation(info)}
                                        checked={info.isOutput ? true : false}
                                    />
                                </div>
                            </fieldset>
                        )
                        : <div className="col-md-12">Không có thông tin</div>
                    }
                    </div>

                    <div className="row">
                    {
                        task
                        && task.documents
                        && task.documents.length !== 0
                        ? task.documents.map(document => 
                            <fieldset className="scheduler-border" style={{ padding: "1em", margin: "0.75em 1.5em 0.75em 1em" }}>
                                <div className="col-md-7">
                                    <strong>Mô tả: </strong>
                                    <span>{document.description}</span>
                                </div>
                                <div className="col-md-5">
                                    <strong>Xuất dữ liệu </strong>
                                    <input
                                        type="checkbox"
                                        style={{ margin: "0.5em 0.5em", padding: "0.6em" }}
                                        name={document.description}
                                        onClick={() => this.handleCheckBoxOutputDocument(task, document)}
                                        checked={document.isOutput && isOutput ? true : false}
                                    />
                                </div>
                                {
                                    document.files && document.files.length !== 0
                                    && document.files.map(file => 
                                        <div className="col-md-12">
                                            <div className="col-md-6">
                                                <strong>Tên file: </strong>
                                                <span>{file.name}</span>
                                            </div> 
                                            <div className="col-md-6">
                                                <strong>Url: </strong>
                                                <span>{file.url}</span>
                                            </div>
                                        </div>
                                    )
                                }
                            </fieldset>
                        )
                        : <div className="col-md-12">Không có tài liệu</div>
                    }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { } = state;
    return {};
}
const actions = {
    editDocument: performTaskAction.editDocument,
    getTaskById: taskManagementActions.getTaskById
}

const connectOutgoingDataTab = connect(mapState, actions)(withTranslate(OutgoingDataTab));
export { connectOutgoingDataTab as OutgoingDataTab }