import { connect } from 'react-redux';
import React, { Component, useState, useEffect } from 'react';
import { withTranslate } from 'react-redux-multilingual';
import { ApiImage, ContentMaker, DateTimeConverter, DialogModal, ShowMoreShowLess } from '../../../../common-components';
import parse from 'html-react-parser';
import { getStorage } from '../../../../config';
import { AuthActions } from '../../../auth/redux/actions';

const formatStatusInfo = (value) => {
    switch (value) {
        case "rejected":
            return (
                <div style={{ color: "rgba(239, 68, 68)", backgroundColor: "rgba(254, 202, 202)", padding: "1px 5px", borderRadius: "4px" }}>
                    Bị từ chối
                </div>
            );
        case "approved":
            return (
                <div style={{ color: "rgba(16, 185, 129)", backgroundColor: "rgba(167, 243, 208)", padding: "1px 5px", borderRadius: "4px" }}>
                    Đã phê duyệt
                </div>
            );
        default:
            return "";
            break;
    }
}

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

const isImage = (src) => {
    let string = src.toLowerCase().split(".");
    let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
    if (image.indexOf(string[string.length - 1]) !== -1) {
        return true;
    } else {
        return false;
    }
}


const getAcoutableEmployees = (data) => {
    const accountableEmployees = data && data.filter(taskOutput => taskOutput.action === "approve");
    if (accountableEmployees) {
        let users = "";
        accountableEmployees.map((taskOutput, index) => {
            if (index === accountableEmployees.length - 1) {
                users = users + `${taskOutput.accountableEmployee.name}, `
            } else {
                users = users + `${taskOutput.accountableEmployee.name}`
            }
            return taskOutput;
        })
        return users;
    }
    return "Chưa có ai phê duyệt";
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

function TaskOutputDetail(props) {
    const { taskOutput } = props;
    const idUser = getStorage("userId");
    const [showLogs, setShowLogs] = useState(false);
    const [state, setState] = useState(() => {
        return {
            showFile: [],
            showComment: [],
            CommentOfTaskOutputFilePaste: [],
            editAction: ""
        }
    })

    const { showFile, showComment, CommentOfTaskOutputFilePaste, editAction } = state;

    const showFilePreview = (data) => {
        setState({
            ...state,
            currentFilepri: data,
        });
        window.$('#modal-file-preview').modal('show');
    }

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(path, fileName);
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

    const reverseArr = (arr) => {
        return [].concat(arr).reverse()
    }

    if (!taskOutput) {
        return <div></div>;
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-task-output-${taskOutput?._id}`}
                title={`Xem chi tiết ${taskOutput?.title}`}
                formID={`detail-output`}
                size={50}
                maxWidth={600}
                hasSaveButton={false}
                hasNote={false}
            >
                <div>
                    <div className="time-todo-range" style={{ marginBottom: "5px" }}>
                        <div style={{ marginRight: '10px' }}><strong>Mô tả:</strong> {parse(taskOutput.description)}</div>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                        <span style={{ marginRight: '10px' }}><strong>Kiểu dữ liệu:</strong> {formatTypeInfo(taskOutput.type)}</span>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                        <span style={{ marginRight: '10px' }}><strong>Người đã phê duyệt: </strong>{getAcoutableEmployees(taskOutput.accountableEmployees)}</span>
                    </div>
                    <div style={{ marginBottom: "5px" }}>
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Đã giao nộp:</strong>
                        </div>
                        <ShowMoreShowLess
                            id={`description${taskOutput._id}`}
                            classShowMoreLess='tool-level1'
                            styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                        >
                            {
                                taskOutput.submissionResults?.description &&
                                (
                                    <div key={taskOutput?.submissionResults._id}>
                                        {taskOutput.submissionResults.creator ?
                                            <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + taskOutput.submissionResults.creator.avatar)} alt="User Image" /> :
                                            <div className="user-img-level1" />
                                        }
                                        { // khi chỉnh sửa thì ẩn action hiện tại đi
                                            editAction !== taskOutput.submissionResults._id &&
                                            <React.Fragment>
                                                {/* { marginBottom: "35px" } */}
                                                <div className="content-level1" data-width="100%">
                                                    {/* Tên người tạo hoạt động */}
                                                    <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
                                                        {
                                                            taskOutput.submissionResults.creator && <a style={{ cursor: "pointer" }}>{taskOutput.submissionResults.creator?.name} </a>
                                                        }
                                                    </div>
                                                    <div>
                                                        {taskOutput.submissionResults?.description?.split('\n')?.map((elem, idx) => (
                                                            <div key={idx}>
                                                                {parse(elem)}
                                                            </div>
                                                        ))
                                                        }
                                                    </div>
                                                </div>

                                                {<ul className="list-inline tool-level1">
                                                    <li><span className="text-sm">{<DateTimeConverter dateTime={taskOutput.submissionResults.createdAt} />}</span></li>

                                                    {/* Các chức năng tương tác với action */}
                                                    {taskOutput.submissionResults.creator &&
                                                        <React.Fragment>
                                                            {taskOutput.submissionResults.files && taskOutput.submissionResults.files.length > 0 && // Chỉ hiện show file khi có file đính kèm
                                                                <li style={{ display: "inline-table" }}>
                                                                    <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowFile(taskOutput.submissionResults._id)}><i className="fa fa-paperclip" aria-hidden="true"></i> Tập tin đính kèm ({taskOutput.submissionResults.files && taskOutput.submissionResults.files.length})</a>
                                                                </li>
                                                            }
                                                            <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowComment(taskOutput._id)}><i className="fa fa-comments-o margin-r-5"></i>Yêu cầu đã chỉnh sửa ({taskOutput.submissionResults.comments.filter((taskOutput) => taskOutput.status === "edited").length}/{taskOutput.submissionResults.comments.length}) &nbsp;</a></li>
                                                        </React.Fragment>
                                                    }
                                                </ul>}
                                                {showFile.some(obj => obj === taskOutput.submissionResults._id) &&
                                                    <div style={{ cursor: "pointer" }}>
                                                        {taskOutput.submissionResults.files.map((elem, index) => {
                                                            let listImage = taskOutput.submissionResults.files?.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
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
                                                                    <div style={{ marginLeft: "50px" }}>
                                                                        <a style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
                                                                        &nbsp;&nbsp;&nbsp;
                                                                        <a href="#" onClick={() => showFilePreview(elem && elem.url)}>
                                                                            <u>{elem && checkTypeFile(elem.url) ?
                                                                                <i className="fa fa-eye fa-1"></i> : ""}</u>
                                                                        </a>
                                                                    </div>
                                                                }
                                                            </div>
                                                        })}
                                                    </div>
                                                }
                                            </React.Fragment>
                                        }
                                    </div>
                                )
                            }
                            {showComment.some(x => x === taskOutput._id) &&
                                <div className="comment-content-child">
                                    {reverseArr(taskOutput.submissionResults.comments).map(child => {
                                        let listImage = child.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                        return <div key={child._id}>
                                            <img className="user-img-level2" src={(process.env.REACT_APP_SERVER + child.creator?.avatar)} alt="User Image" />
                                            { // Đang edit thì ẩn đi
                                                <div>
                                                    <div className="content-level2">
                                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                            <a style={{ cursor: "pointer" }}>{child.creator?.name} </a>
                                                            {child.status === "edited" && <i className='fa fa-check text-success'> Đã chỉnh sửa</i>}
                                                        </div>

                                                        {child.description.split('\n').map((taskOutput, idx) => {
                                                            return (
                                                                <span key={idx}>
                                                                    {parse(taskOutput)}
                                                                </span>
                                                            );
                                                        })}

                                                        {child.creator?._id === idUser &&
                                                            <div className="btn-group pull-right">
                                                                <span data-toggle="dropdown">
                                                                    <i className="fa fa-ellipsis-h"></i>
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    {/* <li><a style={{ cursor: "pointer" }} onClick={() => handleEditCommentOfTaskComment(child)} >{translate("task.task_perform.edit_comment")}</a></li> */}
                                                                    {/* <li><a style={{ cursor: "pointer" }} onClick={() => props.deleteCommentOfTaskComment(child._id, task._id)} >{translate("task.task_perform.delete_comment")}</a></li> */}
                                                                </ul>
                                                            </div>}
                                                    </div>
                                                    <ul className="list-inline tool-level2">
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
                                            }
                                        </div>
                                    })}
                                </div>
                            }
                        </ShowMoreShowLess>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button className="btn btn-default btn-sm" style={{ width: "60%" }} onClick={async () => {
                                setShowLogs(!showLogs);
                            }}>Xem lịch sử thay đổi</button>
                        </div>
                    </div>
                    {showLogs && <div>
                        {taskOutput?.versions.map((item, index) => {
                            return (
                                <div key={item._id} className={index > 3 ? "hide-component" : ""}>
                                    <div className='item-box'>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ fontWeight: "bold" }}>
                                                Kết quả giao nộp lần {index + 1}
                                                <span className="text-sm"> ({<DateTimeConverter dateTime={item.createdAt} />})</span>
                                            </div>
                                            <div>{formatStatusInfo(item.status)}</div>
                                        </div>
                                        <div style={{ marginBottom: "5px" }}>
                                            <span style={{ marginRight: '10px' }}><strong>Người đã phê duyệt: </strong>{getAcoutableEmployees(item.accountableEmployees)}</span>
                                        </div>
                                        <div style={{ marginBottom: "5px" }}>
                                            <strong>Mô tả:</strong> {parse(item.description)}
                                        </div>
                                        {item.files && <div style={{ marginBottom: "5px" }}>
                                            <strong>Tập tin đính kèm: {item.files.length} tập tin</strong>
                                            {item.files.map((elem, index) => {
                                                let listImage = item.files?.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
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
                                                        <div>
                                                            <a style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
                                                            &nbsp;&nbsp;&nbsp;
                                                            <a href="#" onClick={() => showFilePreview(elem && elem.url)}>
                                                                <u>{elem && checkTypeFile(elem.url) ?
                                                                    <i className="fa fa-eye fa-1"></i> : ""}</u>
                                                            </a>
                                                        </div>
                                                    }
                                                </div>
                                            })}
                                        </div>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                </div>
            </DialogModal >
        </React.Fragment >
    );
}

function mapState(state) {
    const { performtasks, tasks, auth } = state;
    return { performtasks, tasks, auth };
}

const actionCreators = {
    downloadFile: AuthActions.downloadFile,
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(TaskOutputDetail));

export { connectedTaskOutputs as TaskOutputDetail };

