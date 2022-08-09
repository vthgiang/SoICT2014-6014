import React, { Component, useEffect, useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';
import { ApiImage, DateTimeConverter, DialogModal, QuillEditor, SelectBox, ShowMoreShowLess } from "../../../../../common-components";
import { performTaskAction } from "../../../task-perform/redux/actions";
import parse from 'html-react-parser';
import { getStorage } from "../../../../../config";
import { ModalVersionsTaskOutput } from "../../../task-perform/component/modalVersionsTaskOutput";

const formatTypeInfo = (value) => {
    switch (value) {
        case 0:
            return "Văn bản";
            break;
        case 1:
            return "Tập tin";
            break;
        default:
            return "";
            break;
    }
}

const formatActionAccountable = (value) => {
    switch (value) {
        case "approve":
            return "Đồng ý"
        case "reject":
            return "Từ chối"
        default:
            return "Chưa phê duyệt"
            break;
    }
}

const getTaskOutputsApproved = (taskOutputs) => {
    if (taskOutputs) {
        const taskOutputsApproved = taskOutputs.filter((item) => item.status == "approved")
        return `${taskOutputsApproved.length}`;
    }
    return "0";
};

const isImage = (src) => {
    let string = src.toLowerCase().split(".");
    let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
    if (image.indexOf(string[string.length - 1]) !== -1) {
        return true;
    } else {
        return false;
    }
}

const checkTypeFile = (data) => {
    if (typeof data === 'string' || data instanceof String) {
        let index = data.lastIndexOf(".");
        let typeFile = data.substring(index + 1, data.length);
        if (typeFile === "pdf") {
            return true;
        }
        else return false;
    }
    else return false;
}

function TaskOutputTab(props) {
    const idUser = getStorage("userId");

    const [showAccountables, setShowAccountables] = useState([]);
    const { performtasks } = props;
    const { task } = performtasks;
    const taskOutputs = performtasks?.task?.taskOutputs;

    const [state, setState] = useState(() => {
        return {
            showFile: [],
            showComment: [],
            CommentOfTaskOutputFilePaste: [],
            editAction: "",
            taskOutput: taskOutputs?.[0]
        }
    });

    const { showFile, showComment, taskOutput } = state


    useEffect(() => {
        async function getTaskOutputs() {
            await props.getTaskOutputs(props.task._id)
        }
        getTaskOutputs();
    }, [props.task._id])

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(path, fileName);
    }

    const reverseArr = (arr) => {
        return [].concat(arr).reverse()
    }

    const showFilePreview = (data) => {
        setState({
            ...state,
            currentFilepri: data,
        });
        window.$('#modal-file-preview').modal('show');
    }

    const handleShowFile = (id) => {
        let a;
        let { showFile } = state
        if (showFile.some(obj => obj === id)) {
            a = showFile.filter(x => x !== id);
            setState({
                ...state,
                showFile: a
            })
        } else {
            setState({
                ...state,
                showFile: [...state.showFile, id]
            })
        }
    }

    const handleShowComment = (id) => {
        let a;
        if (state.showComment.some(obj => obj === id)) {
            a = state.showComment.filter(x => x !== id);
            setState({
                ...state,
                showComment: a
            })
        } else {
            setState({
                ...state,
                showComment: [...state.showComment, id]
            })
        }
    }

    const showVersionsTaskOutput = (taskOutput) => {
        window.$(`#modal-versions-task-output-${taskOutput._id}`).modal('show');
    }

    const selectTaskOutput = (value) => {
        const taskOutputSelect = taskOutputs.find((item) => item._id === value[0])
        setState({ ...state, taskOutput: taskOutputSelect })
    }

    let taskOutputsLabel = [{ value: "0", text: "Chọn kết quả cần giao nộp" }]

    for (let i in taskOutputs) {
        taskOutputsLabel.push({ value: taskOutputs[i]._id, text: taskOutputs[i].title })
    }

    return (
        <React.Fragment>
            <div style={{ overFlow: "auto" }}>
                <ModalVersionsTaskOutput taskOutput={taskOutput} />
                <div>
                    <strong style={{ fontWeight: 600, paddingRight: "10px" }}>Tên công việc: </strong>
                    <span>{props.task?.name}</span>
                </div>
                <div>
                    <strong style={{ fontWeight: 600, paddingRight: "10px" }}>Số kết quả cần giao nộp: </strong>
                    <span>{taskOutputs?.length ? taskOutputs.length : "Không có yêu cầu kết quả giao nộp"}</span>
                </div>
                {getTaskOutputsApproved(taskOutputs) != "0" && <div>
                    <strong style={{ fontWeight: 600, color: "green", paddingRight: "10px" }}>Số kết quả đã được phê duyệt: </strong>
                    <span style={{ color: "green" }}>{getTaskOutputsApproved(taskOutputs)}</span>
                </div>}
                {taskOutputsLabel.length > 1 && <div>
                    <strong style={{ fontWeight: 600 }}>Kết quả giao nộp:</strong>
                    <SelectBox
                        id={`select-task-output`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        items={taskOutputsLabel}
                        onChange={(value) => { selectTaskOutput(value) }}
                        value={taskOutput?._id}
                        multiple={false}
                    />
                </div>}
                {taskOutput && <div>
                    <div><strong style={{ fontWeight: 600, paddingRight: "10px" }}>Kiểu dữ liệu:</strong> {formatTypeInfo(taskOutput.type)}</div>
                    <div>
                        <strong style={{ fontWeight: 600 }}>Yêu cầu:</strong>
                        <QuillEditor
                            id={`description-${taskOutput?._id}`}
                            toolbar={false}
                            quillValueDefault={taskOutput?.description}
                            maxHeight={250}
                            enableDropImage={false}
                            enableEdit={false}
                            showDetail={{
                                enable: true,
                                titleShowDetail: "Mô tả yêu cầu",
                                width: "75%"
                            }}
                        />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
                        <div>
                            <span style={{ fontWeight: 600 }}>{taskOutput.submissionResults?.description ? `Kết quả giao nộp lần ${taskOutput.versions.length + 1}` : "Chưa giao nộp kết quả"}</span>
                        </div>
                        <div style={{ display: "flex" }}>
                            {taskOutput.versions?.length > 0 && <a style={{ cursor: "pointer", marginRight: "3px" }}
                                onClick={async () => {
                                    showVersionsTaskOutput(taskOutput);
                                }} ><i className="fa fa-history" aria-hidden="true"></i> Lịch sử giao nộp</a>
                            }
                        </div>
                    </div>
                    <div>
                        <div>
                            {taskOutput?.submissionResults.description?.split('\n')?.map((elem, idx) => (
                                <div key={idx}>
                                    {parse(elem)}
                                </div>
                            ))
                            }
                        </div>
                        {taskOutput?.submissionResults.description &&
                            <ul className="list-inline" style={{ display: "flex", marginTop: "-15px", flexWrap: "wrap" }}>
                                <li className="text-sm" style={{ paddingRight: "10px", paddingLeft: "5px" }}><DateTimeConverter dateTime={taskOutput.submissionResults.createdAt} /></li>
                                <li><a style={{ cursor: "pointer" }} className="text-sm" onClick={() => {
                                    if (showAccountables.includes(taskOutput._id)) {
                                        let newShowAccountable = showAccountables.filter((item) => item !== taskOutput._id)
                                        setShowAccountables(newShowAccountable)
                                    } else {
                                        let newShowAccountable = [...showAccountables, taskOutput._id]
                                        setShowAccountables(newShowAccountable)
                                    }
                                }} >Phê duyệt</a></li>
                                <li><a style={{ cursor: "pointer" }} className="text-sm" onClick={() => handleShowFile(taskOutput.submissionResults._id)} ><i className="fa fa-paperclip" aria-hidden="true"></i> Tập tin đính kèm ({taskOutput.submissionResults.files && taskOutput.submissionResults.files.length})</a></li>
                                <li><a style={{ cursor: "pointer" }} className="text-sm" onClick={() => handleShowComment(taskOutput._id)} ><i className="fa fa-comments-o margin-r-5" aria-hidden="true"></i> Trao đổi ({taskOutput.comments && taskOutput.comments.length})</a></li>
                            </ul>
                        }
                        {showFile.some(obj => obj === taskOutput.submissionResults._id) && taskOutput?.submissionResults.files.length > 0 && <div style={{ cursor: "pointer" }}>
                            <div><strong style={{ fontWeight: 600 }}>Tập tin đính kèm:</strong></div>
                            <ul>
                                {taskOutput?.submissionResults.files.map((elem, index) => {
                                    let listImage = taskOutput?.submissionResults.files?.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                    return <li key={index}>
                                        {isImage(elem.name) ?
                                            <ApiImage
                                                listImage={listImage}
                                                className="attachment-img files-attach"
                                                style={{ marginTop: "5px" }}
                                                src={elem.url}
                                                file={elem}
                                                requestDownloadFile={requestDownloadFile}
                                            />
                                            :
                                            <div>
                                                <a style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
                                                &nbsp;&nbsp;&nbsp;
                                                <a href="#" onClick={() => showFilePreview(elem && elem.url)}>
                                                    <u>{elem && checkTypeFile(elem.url) ?
                                                        <i className="fa fa-eye fa-1"></i> : ""}</u>
                                                </a>
                                            </div>
                                        }
                                    </li>
                                })}
                            </ul>
                        </div>
                        }

                        {showAccountables.includes(taskOutput._id) && taskOutput?.accountableEmployees.map((item, idx) => {
                            return (
                                <div key={idx}>
                                    <b> {item.accountableEmployee?.name} </b>
                                    <span style={{ fontSize: 10, marginRight: 10 }} className="text-green">[ Người phê duyệt ]</span>
                                    {formatActionAccountable(item.action)}
                                    &ensp;
                                    {item.action === "approve" || item.action === "reject" && <DateTimeConverter dateTime={item.updatedAt} />}
                                </div >
                            )
                        })}
                        {showComment.some(x => x === taskOutput._id) && taskOutput?.comments?.length > 0 &&
                            <div>
                                <div style={{ marginBottom: "10px", marginTop: "10px" }}><strong>Trao đổi:</strong></div>
                                {reverseArr(taskOutput?.comments).map(child => {
                                    let listImage = child.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                    return <div key={child._id}>
                                        <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + child.creator?.avatar)} alt="User Image" />

                                        <div>
                                            <div className="content-level1">
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <a style={{ cursor: "pointer", fontWeight: "bold" }}>{child.creator?.name} </a>
                                                </div>

                                                {child.description.split('\n').map((item, idx) => {
                                                    return (
                                                        <span key={idx}>
                                                            {parse(item)}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                            <ul className="list-inline tool-level1">
                                                <li><span className="text-sm">{<DateTimeConverter dateTime={child.createdAt} />}</span></li>
                                                {child.files.length > 0 &&
                                                    <React.Fragment>
                                                        <li style={{ display: "inline-table" }}>
                                                            <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> Tập tin đính kèm ({child.files && child.files.length})</i></b></a></div></li>
                                                        {showFile.some(obj => obj === child._id) &&
                                                            <li style={{ display: "inline-table" }}>
                                                                {child.files.map((elem, index) => {
                                                                    return <div key={index} className="show-files-task">
                                                                        {isImage(elem.name) ?
                                                                            <ApiImage
                                                                                listImage={listImage}
                                                                                className="attachment-img files-attach"
                                                                                style={{ marginTop: "5px" }}
                                                                                src={elem.url}
                                                                                file={elem}
                                                                                requestDownloadFile={requestDownloadFile}
                                                                            />
                                                                            :
                                                                            <div style={{ marginTop: "2px" }}>
                                                                                <a style={{ cursor: "pointer" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
                                                                                <a href="#" onClick={() => showFilePreview(elem && elem.url)}>
                                                                                    <u>{elem && checkTypeFile(elem.url) ?
                                                                                        <i className="fa fa-eye"></i> : ""}</u>
                                                                                </a>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                })}
                                                            </li>
                                                        }
                                                    </React.Fragment>}
                                            </ul>
                                        </div>
                                    </div>
                                })}
                            </div>
                        }
                    </div>
                </div>}
            </div>
        </React.Fragment>
    )

}

function mapState(state) {
    const { performtasks, auth, role } = state;
    return { performtasks, auth, role };
}

const actionCreators = {
    getTaskById: performTaskAction.getTaskById,
    getTaskOutputs: performTaskAction.getTaskOutputs,
};
const connectedTaskOutputTab = connect(mapState, actionCreators)(withTranslate(TaskOutputTab));
export { connectedTaskOutputTab as TaskOutputTab };
