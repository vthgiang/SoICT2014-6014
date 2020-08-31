import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from '../../task-management/redux/actions';

class OutgoingDataTab extends Component {

    constructor(props) {
        super(props);
        
        this.DOCUMENT = [];
        this.INFORMATION = [];

        this.state = {
            taskId: undefined,
            task: undefined,
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isOutgoingData && nextProps.taskId !== prevState.taskId) {
            let isOutputInformation = {}, isOutputDocument = {};
            
            if (nextProps.task && nextProps.task.taskInformations && nextProps.task.taskInformations.length !== 0) {
                nextProps.task.taskInformations.map(item => {
                    let element = {};
                    element[item._id] = item.isOutput;

                    isOutputInformation = Object.assign(isOutputInformation, element);
                });
            }

            if (nextProps.task && nextProps.task.documents && nextProps.task.documents.length !== 0) {
                nextProps.task.documents.map(item => {
                    let element = {};
                    element[item._id] = item.isOutput;

                    isOutputDocument = Object.assign(isOutputDocument, element);
                });
            }

            return {
                ...prevState,
                taskId: nextProps.taskId,
                task: nextProps.task,
                isOutputInformation: isOutputInformation,
                isOutputDocument: isOutputDocument
            }
        } else {
            return null
        }
    }

    handleCheckBoxOutputInformation = (info) => {
        this.setState(state => {
            state.isOutputInformation[info._id] = !state.isOutputInformation[info._id];
            return {
                ...state,
            }
        })

        let check = [], element;

        check = this.INFORMATION.filter(item => {
            if (item._id === info._id) {
                element = item;
                return true
            } else {
                return false
            } 
        });

        if (check.length !== 0) {
            this.INFORMATION.splice(this.INFORMATION.indexOf(element), 1);
        } else {
            let data = {
                _id: info._id,
                description: info.description,
                isOutput: !info.isOutput,
                name: info.name,
                type: info.type
            }

            this.INFORMATION.push(data);
        }
    }

    handleCheckBoxOutputDocument = (document) => {
        this.setState(state => {
            state.isOutputDocument[document._id] = !state.isOutputDocument[document._id];
            return {
                ...state,
            }
        })

        let check = [], element;

        check = this.DOCUMENT.filter(item => {
            if (item._id === document._id) {
                element = item;
                return true
            } else {
                return false
            } 
        });

        if (check.length !== 0) {
            this.DOCUMENT.splice(this.DOCUMENT.indexOf(element), 1);
        } else {
            let data = {
                _id: document._id,
                description: document.description,
                isOutput: !document.isOutput,
            }

            this.DOCUMENT.push(data);
        }
    }

    handleSaveEdit = () => {
        const { task } = this.state;

        if (this.INFORMATION.length !== 0) {
            this.props.editInformationTask(task._id, this.INFORMATION);
            this.INFORMATION = [];
        }

        if (this.DOCUMENT.length !== 0) {
            this.props.editDocument(undefined, task._id, this.DOCUMENT)
            this.DOCUMENT = [];
        }
    }

    render() {
        const { task, isOutputInformation, isOutputDocument } = this.state;

        return (
            <React.Fragment>
                <div className="description-box">
                    {
                        task &&
                        <div className="row">
                            <h4 className="col-md-12">Danh sách thông tin và tài liệu</h4>

                            { /** Danh sách thông tin */
                                task.taskInformations
                                && task.taskInformations.length !== 0
                                ? task.taskInformations.map((info) =>
                                    <div className="col-md-12">
                                        <input
                                            type="checkbox"
                                            title="Xuất thông tin"
                                            style={{ margin: "0.5em 0.5em", padding: "0.6em" }}
                                            name={info.description}
                                            onClick={() => this.handleCheckBoxOutputInformation(info)}
                                            checked={isOutputInformation[info._id]}
                                        />
                                        <strong>{info.name}</strong>
                                        <span> - {info.description}</span>
                                        <span> - {info.type}</span>
                                    </div>
                                )
                                : <div className="col-md-12">Không có thông tin</div>
                            }

                            
                            { /** Danh sách tài liệu */
                                task.documents
                                && task.documents.length !== 0
                                ? task.documents.map(document =>
                                    <div>
                                        <div className="col-md-12">
                                            <input
                                                type="checkbox"
                                                title="Xuất tài liệu"
                                                style={{ margin: "0.5em 0.5em", padding: "0.6em" }}
                                                name={document.description}
                                                onClick={() => this.handleCheckBoxOutputDocument(document)}
                                                checked={isOutputDocument[document._id]}
                                            />
                                            <strong>{document.description}</strong>
                                        </div>

                                        {
                                            document.files && document.files.length !== 0
                                            && document.files.map(file =>
                                                <div className="col-md-6">
                                                    <ul>
                                                        <strong>{file.name}</strong>
                                                        <span> - <a>{file.url}</a></span>
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                                : <div className="col-md-12">Không có tài liệu</div>
                            }

                            <div className="col-md-12">
                                <button type="button" className="btn btn-success pull-right" style={{ marginRight: "2em" }} onClick={() => this.handleSaveEdit()} disabled={this.DOCUMENT.length === 0 && this.INFORMATION.length === 0}>Lưu</button>
                            </div>
                        </div>
                    }
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
    editInformationTask: performTaskAction.editInformationTask,
    getTaskById: taskManagementActions.getTaskById
}

const connectOutgoingDataTab = connect(mapState, actions)(withTranslate(OutgoingDataTab));
export { connectOutgoingDataTab as OutgoingDataTab }