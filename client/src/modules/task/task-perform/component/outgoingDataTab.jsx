import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import parse from 'html-react-parser';

import { ApiImage, Comment } from '../../../../common-components'

import { AuthActions } from '../../../auth/redux/actions';
import { performTaskAction } from '../redux/actions';
import TaskOutputsTab from './taskOutputs';

const formatStatusInfo = (value) => {
    switch (value) {
        case "unfinished":
            return "Chưa hoàn thành";
        case "waiting_approval":
            return "Đang chờ phê duyệt";
        case "rejected":
            return "Bị từ chối";
        case "approved":
            return "Đã phê duyệt";
        default:
            return "";
            break;
    }
}
function OutgoingDataTab(props) {
    const { translate, performtasks } = props;
    const [state, setState] = useState({
        taskId: undefined,
        task: undefined,
        isOutputInformation: {},
        isOutputDocument: {},
        isOutputTaskOutput: {}
    })
    const [documents, setDocuments] = useState([])
    const [informations, setInformations] = useState([])
    const [taskOutputs, setTaskOutputs] = useState([])
    const { task, isOutputInformation, isOutputDocument, isOutputTaskOutput } = state;
    if (props.isOutgoingData && props.taskId !== state.taskId) {
        let isOutputInformation = {}, isOutputDocument = {}, isOutputTaskOutput = {};

        if (props.task && props.task.taskInformations && props.task.taskInformations.length !== 0) {
            props.task.taskInformations.map(item => {
                let element = {};
                element[item._id] = item.isOutput;

                isOutputInformation = Object.assign(isOutputInformation, element);
            });
        }

        if (props.task && props.task.documents && props.task.documents.length !== 0) {
            props.task.documents.map(item => {
                let element = {};
                element[item._id] = item.isOutput;

                isOutputDocument = Object.assign(isOutputDocument, element);
            });
        }

        if (props.task && props.task.taskOutputs && props.task.taskOutputs.length !== 0) {
            props.task.taskOutputs.map(item => {
                let element = {};
                element[item._id] = item.isOutput;

                isOutputTaskOutput = Object.assign(isOutputTaskOutput, element);
            });
        }

        setState({
            ...state,
            taskId: props.taskId,
            task: props.task,
            isOutputInformation: isOutputInformation,
            isOutputDocument: isOutputDocument,
            isOutputTaskOutput: isOutputTaskOutput
        })
    }

    const handleCheckBoxOutputInformation = (info) => {
        setState(state => {
            state.isOutputInformation[info._id] = !state.isOutputInformation[info._id];
            return {
                ...state,
            }
        })

        let check = [], element;

        check = informations.filter(item => {
            if (item._id === info._id) {
                element = item;
                return true
            } else {
                return false
            }
        });

        if (check.length !== 0) {
            informations.splice(informations.indexOf(element), 1);
        } else {
            let data = {
                _id: info._id,
                description: info.description,
                isOutput: !info.isOutput,
                name: info.name,
                type: info.type
            }

            informations.push(data);
        }
    }

    const handleCheckBoxOutputDocument = (document) => {
        setState(state => {
            state.isOutputDocument[document._id] = !state.isOutputDocument[document._id];
            return {
                ...state,
            }
        })

        let check = [], element;
        check = documents.filter(item => {
            if (item._id === document._id) {
                element = item;
                return true
            } else {
                return false
            }
        });
        if (check.length !== 0) {
            documents.splice(documents.indexOf(element), 1);
        } else {
            let data = {
                _id: document._id,
                description: document.description,
                isOutput: !document.isOutput,
            }
            documents.push(data);
        }
    }

    const handleCheckBoxOutputTaskOutput = (taskOutput) => {
        setState(state => {
            state.isOutputTaskOutput[taskOutput._id] = !state.isOutputTaskOutput[taskOutput._id];
            return {
                ...state,
            }
        })

        let check = [], element;
        check = taskOutputs.filter(item => {
            if (item._id === taskOutput._id) {
                element = item;
                return true
            } else {
                return false
            }
        });
        if (check.length !== 0) {
            taskOutputs.splice(taskOutputs.indexOf(element), 1);
        } else {
            let data = {
                _id: taskOutput._id,
                description: taskOutput.description,
                isOutput: !taskOutput.isOutput,
            }
            taskOutputs.push(data);
        }
    }

    const handleSaveEdit = () => {
        const { task } = state;

        if (informations.length !== 0) {
            props.editInformationTask(task._id, informations);
            setInformations([]);
        }

        if (documents.length !== 0) {
            props.editDocument(undefined, task._id, documents)
            setDocuments([]);
        }

        if (taskOutputs.length !== 0) {
            console.log(186, taskOutputs)
            props.editTaskOutputs(task._id, taskOutputs)
            setTaskOutputs([])
        }
    }
    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault()
        props.downloadFile(path, fileName)
    }
    const isImage = (src) => {
        let string = src.toLowerCase().split(".");
        let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
        if (image.indexOf(string[string.length - 1]) !== -1) {
            return true;
        } else {
            return false;
        }
    }
    let task1 = performtasks?.task
    return (
        <React.Fragment>
            {
                task1 &&
                <React.Fragment>
                    <div className="description-box outgoing-content">
                        <h4>{translate('task.task_process.list_of_data_and_info')}</h4>

                        <strong>{translate('task.task_process.information')}:</strong>
                        { /** Danh sách thông tin */
                            task1.taskInformations
                                && task1.taskInformations.length !== 0
                                ? task1.taskInformations.map((info) =>
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                title={translate('task.task_process.export_info')}
                                                name={info.description}
                                                onClick={() => handleCheckBoxOutputInformation(info)}
                                                checked={isOutputInformation[info._id]}
                                            />
                                            <strong style={{ marginRight: '5px' }}>{info.name}:</strong>
                                        </label>
                                        <span>{info.value}</span>
                                    </div>
                                )
                                : <span>{translate('task.task_process.not_have_info')}</span>
                        }

                        <div style={{ marginTop: 10 }}></div>
                        <strong>{translate('task.task_process.document')}:</strong>
                        { /** Danh sách tài liệu */
                            task1.documents
                                && task1.documents.length !== 0
                                ? task1.documents.map((document, index) =>
                                    <div key={index}>
                                        <div>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    title={translate('task.task_process.export_doc')}
                                                    name={document.description}
                                                    onClick={() => handleCheckBoxOutputDocument(document)}
                                                    checked={isOutputDocument && isOutputDocument[document._id]}
                                                    onChange={e => { }}
                                                />
                                                <strong>{parse(document.description)} ({document.files.length} tài liệu)</strong>
                                            </label>
                                        </div>

                                        {
                                            document.files && document.files.length !== 0
                                            && document.files.map((file, index) =>
                                                <div key={index}>
                                                    {isImage(file.name) ?
                                                        <ApiImage
                                                            className="attachment-img files-attach"
                                                            style={{ marginTop: "5px" }}
                                                            src={file.url}
                                                            file={file}
                                                            requestDownloadFile={requestDownloadFile}
                                                        />
                                                        :
                                                        <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, file.url, file.name)}> {file.name} </a>
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                                : <span>{translate('task.task_process.not_have_doc')}</span>
                        }
                        <div style={{ marginTop: 10 }}></div>
                        <strong>Kết quả giao nộp:</strong>
                        {performtasks.task?.taskOutputs?.map(item => {
                            if (item.status === "approved") {
                                return (
                                    <div>
                                        <label>
                                            <input
                                                type="checkbox"
                                                title={"TaskOutputs"}
                                                name={item.tilte}
                                                onClick={() => { handleCheckBoxOutputTaskOutput(item) }}
                                                checked={isOutputTaskOutput && isOutputTaskOutput[item._id]}
                                            // disabled={item.status !== "approved"}
                                            // onChange={e => { }}
                                            />
                                            {item.title}
                                        </label>
                                    </div>
                                )
                            }
                            return <></>;
                        })}
                        <div style={{ marginTop: 20 }}>
                            <button type="button" style={{ width: "100%" }} className="btn btn-block btn-default" onClick={() => handleSaveEdit()} disabled={documents.length === 0 && informations.length === 0 && taskOutputs.length === 0}>{translate('task.task_process.save')}</button>
                        </div>
                    </div>
                    {/* <TaskOutputsTab /> */}


                    { /** Trao đổi */}
                    <div>
                        <h4 style={{ marginBottom: "1.3em" }}>Trao đổi với các công việc khác về dữ liệu ra</h4>
                        {/* <CommentInProcess
                            task={performtasks.task}
                            inputAvatarCssClass="user-img-outgoing-level1"
                        /> */}
                        <Comment
                            data={task1}
                            comments={task1.commentsInProcess}
                            type="outgoing"
                            createComment={(dataId, data, type) => props.createComment(dataId, data, type)}
                            editComment={(dataId, commentId, data, type) => props.editComment(dataId, commentId, data, type)}
                            deleteComment={(dataId, commentId, type) => props.deleteComment(dataId, commentId, type)}
                            createChildComment={(dataId, commentId, data, type) => props.createChildComment(dataId, commentId, data, type)}
                            editChildComment={(dataId, commentId, childCommentId, data, type) => props.editChildComment(dataId, commentId, childCommentId, data, type)}
                            deleteChildComment={(dataId, commentId, childCommentId, type) => props.deleteChildComment(dataId, commentId, childCommentId, type)}
                            deleteFileComment={(fileId, commentId, dataId, type) => props.deleteFileComment(fileId, commentId, dataId, type)}
                            deleteFileChildComment={(fileId, commentId, childCommentId, dataId, type) => props.deleteFileChildComment(fileId, commentId, childCommentId, dataId, type)}
                            downloadFile={(path, fileName) => props.downloadFile(path, fileName)}
                        />
                    </div>
                </React.Fragment>

            }
        </React.Fragment>
    )
}


function mapState(state) {
    const { performtasks } = state;
    return { performtasks };
}
const actions = {
    editDocument: performTaskAction.editDocument,
    editInformationTask: performTaskAction.editInformationTask,
    editTaskOutputs: performTaskAction.editTaskOutputs,
    downloadFile: AuthActions.downloadFile,
    createComment: performTaskAction.createComment,
    editComment: performTaskAction.editComment,
    deleteComment: performTaskAction.deleteComment,
    createChildComment: performTaskAction.createChildComment,
    editChildComment: performTaskAction.editChildComment,
    deleteChildComment: performTaskAction.deleteChildComment,
    deleteFileComment: performTaskAction.deleteFileComment,
    deleteFileChildComment: performTaskAction.deleteFileChildComment,
}

const connectOutgoingDataTab = connect(mapState, actions)(withTranslate(OutgoingDataTab));
export { connectOutgoingDataTab as OutgoingDataTab }