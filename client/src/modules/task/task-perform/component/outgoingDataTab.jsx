import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import parse from 'html-react-parser';

import { ApiImage, Comment } from '../../../../common-components'

import { AuthActions } from '../../../auth/redux/actions';
import { performTaskAction } from '../redux/actions';
import TaskOutputsTab from './taskOutputs';

function OutgoingDataTab(props) {
    const { translate, performtasks } = props;
    const [state, setState] = useState({
        taskId: undefined,
        task: undefined,
        isOutputInformation: {},
        isOutputDocument: {},
    })
    const [documents, setDocuments] = useState([])
    const [informations, setInformations] = useState([])
    const { task, isOutputInformation, isOutputDocument } = state;
    console.log(23, performtasks)
    if (props.isOutgoingData && props.taskId !== state.taskId) {
        let isOutputInformation = {}, isOutputDocument = {};

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

        setState({
            ...state,
            taskId: props.taskId,
            task: props.task,
            isOutputInformation: isOutputInformation,
            isOutputDocument: isOutputDocument
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
        console.log("dcm 0", documents)
        check = documents.filter(item => {
            if (item._id === document._id) {
                element = item;
                return true
            } else {
                return false
            }
        });
        console.log("dcm", documents)
        console.log('check.length', check.length)
        if (check.length !== 0) {
            documents.splice(documents.indexOf(element), 1);
        } else {
            let data = {
                _id: document._id,
                description: document.description,
                isOutput: !document.isOutput,
            }
            console.log("data", data)
            documents.push(data);
            console.log("dcm 2", documents)
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
    console.log('state', state)
    console.log("Document", documents)
    console.log("Infomation", informations)
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
                            return (
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            title={"TaskOutputs"}
                                            name={item.tilte}
                                            onClick={() => { console.log(235) }}
                                            // checked={ }
                                            onChange={e => { }}
                                        />
                                        {item.title}
                                    </label>
                                </div>
                            )
                        })}
                        Yêu cầu xác nhận kết quả giao nộp từ các công việc trong quy trình
                        <div>
                            <div style={{ marginLeft: "20px" }}>
                                <span>Xác nhận bước 1</span>
                                {performtasks.task?.followingTasks.map(x => {
                                    return (
                                        <div>
                                            <input type="checkbox" />
                                            <span>{x.task.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <div style={{ marginLeft: "20px" }}>
                                <span>Xác nhận bước 2</span>
                                <div>
                                    <input type="checkbox" />
                                    <span>Phê duyệt hình thức trình bày</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <button type="button" style={{ width: "100%" }} className="btn btn-block btn-default" onClick={() => handleSaveEdit()} disabled={documents.length === 0 && informations.length === 0}>{translate('task.task_process.save')}</button>
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