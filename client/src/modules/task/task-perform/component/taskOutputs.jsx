import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import OutputDetail from './modalDetailOutput';
import parse from 'html-react-parser';
import { getStorage } from '../../../../config';
import { ApiImage, ContentMaker, DateTimeConverter, QuillEditor, SelectBox, ShowMoreShowLess, UploadFile } from '../../../../common-components';
import { performTaskAction } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';
import Swal from 'sweetalert2';
import { xor } from 'lodash';
import { ModalVersionsTaskOutput } from './modalVersionsTaskOutput';
import "./taskOutput.css"

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

const formatStatusInfo = (value) => {
    switch (value) {
        case "unfinished":
            return (
                <div style={{ color: "rgba(239, 68, 68)", backgroundColor: "rgba(254, 202, 202)", padding: "1px 5px", borderRadius: "4px" }}>
                    Chưa hoàn thành
                </div>
            );
        case "inprogess":
            return (
                <div style={{ color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "1px 5px", borderRadius: "4px" }}>
                    Đang thực hiện
                </div>
            );
        case "waiting_for_approval":
            return (
                <div style={{ color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "1px 5px", borderRadius: "4px" }}>
                    Đang chờ phê duyệt
                </div>
            );
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

const checkRoleAccountable = (userId, accountable) => {
    let check;
    const accountableEmployee = accountable?.find(taskOutput => taskOutput.accountableEmployee._id == userId);
    check = accountableEmployee ? true : false;
    return check;
}

const valueType = (idUser, accountableEmployees) => {
    const accountableEmployee = accountableEmployees.find(taskOutput => taskOutput.accountableEmployee._id === idUser);
    if (!accountableEmployee) {
        return "waiting_for_approval";
    }
    return accountableEmployee.action;
}

const getAcountableEmployees = (data) => {
    const accountableEmployees = data && data.filter(taskOutput => (taskOutput.action !== "approve" && taskOutput.action !== "reject"));
    if (accountableEmployees) {
        let users = "";
        accountableEmployees.map((taskOutput, index) => {
            if (index !== accountableEmployees.length - 1) {
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

function TaskOutputsTab(props) {
    const { performtasks, auth, role } = props;
    const idUser = getStorage("userId");
    const [showPanels, setShowPanels] = useState([]);
    const [taskOutput, setTaskOutput] = useState();
    const [state, setState] = useState(() => {
        return {
            newAction: {
                creator: idUser,
                description: "",
                files: [],
                descriptionsDefault: ""
            },
            newActionEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newCommentOfTaskOutput: {
                creator: idUser,
                description: "",
                status: "",
                files: [],
                descriptionDefault: ""
            },
            newCommentOfTaskOutputEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            showFile: [],
            showComment: [],
            CommentOfTaskOutputFilePaste: [],
            editAction: ""
        }
    })
    const { newAction, showFile, showComment, editAction, newActionEdited, newCommentOfTaskOutput, newCommentOfTaskOutputEdited } = state;
    const { task } = performtasks;

    useEffect(() => {
        props.getTaskOutputs(performtasks.task._id)
    }, [performtasks.task._id])

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

    const handleEditAction = async (taskOutput) => {
        console.log(184, taskOutput._id)
        await setState({
            ...state,
            editAction: taskOutput._id,
            newActionEdited: {
                ...state.newActionEdited,
                descriptionDefault: taskOutput.submissionResults.description
            }
        })
        console.log(193, editAction)
    }
    console.log(195, newActionEdited)
    const onEditActionFilesChange = (files) => {
        setState({
            ...state,
            newActionEdited: {
                ...state.newActionEdited,
                files: files,
            }
        })
    }
    const onActionFilesChange = (files) => {
        setState({
            ...state,
            newAction: {
                ...state.newAction,
                files: files,
            }
        })
    }

    const onCommentFilesChange = (files, taskOutputId) => {
        let { newCommentOfTaskOutput } = state;
        newCommentOfTaskOutput[taskOutputId] = {
            ...newCommentOfTaskOutput[taskOutputId],
            status: "not_edited_yet",
            files: files
        }
        setState(state => {
            return {
                ...state,
                newCommentOfTaskOutput,
            }
        })
    }

    const handleChangleCommentOfTaskOutput = (value, taskOutput) => {
        let { newCommentOfTaskOutput } = state;
        newCommentOfTaskOutput[taskOutput._id] = {
            ...newCommentOfTaskOutput[taskOutput._id],
            creator: idUser,
            description: value,
            descriptionDefault: null
        }
        setState((state) => {
            return {
                ...state,
                newCommentOfTaskOutput
            }
        })
    }
    const onFilesError = (error, file) => {
    }

    const handleSaveEditAction = (e, id, description, taskId, actionId) => {
        e.preventDefault();
        let { newActionEdited } = state;
        let data = new FormData();
        newActionEdited.files.forEach(x => {
            data.append("files", x)
        })
        data.append("type", "edit");
        data.append("actionId", actionId)
        data.append("description", newActionEdited.description)
        data.append("creator", newActionEdited.creator)
        if (newActionEdited.description !== "" || newActionEdited.files) {
            props.editSubmissionResults(taskId, id, data);
        }
        setState({
            ...state,
            editAction: "",
            newActionEdited: {
                ...state.newActionEdited,
                files: [],
                description: "",
                descriptionDefault: null
            }
        })
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

    const showVersionsTaskOutput = (taskOutput) => {
        window.$(`#modal-versions-task-output-${taskOutput._id}`).modal('show');
    }

    const submitAction = (taskOutputId, taskId, index, type) => {
        let { newAction } = state;

        const data = new FormData();

        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        data.append("index", index)
        newAction.files && newAction.files.forEach(x => {
            data.append("files", x);
        })
        if (newAction.creator && newAction.description) {
            if (type === 0) {
                props.createTaskOutputs(taskId, taskOutputId, data);
            }
            if (type === 1 && newAction.files.length > 0) {
                props.createTaskOutputs(taskId, taskOutputId, data);
            }
            // props.createTaskAction(taskId, data);
        }
        // Reset state cho việc thêm mới action
        setState({
            ...state,
            filePaste: [],
            newAction: {
                ...state.newAction,
                description: "",
                files: [],
                descriptionDefault: ''
            },
        })
    }

    const submitComment = (taskOutputId, taskId) => {
        let { newCommentOfTaskOutput, CommentOfTaskOutputFilePaste } = state;
        const data = new FormData();
        if (taskOutputId) {
            data.append("creator", newCommentOfTaskOutput[`${taskOutputId}`]?.creator);
            data.append("description", newCommentOfTaskOutput[`${taskOutputId}`]?.description);
            newCommentOfTaskOutput[`${taskOutputId}`]?.files && newCommentOfTaskOutput[`${taskOutputId}`].files.forEach(x => {
                data.append("files", x);
            })
            if (newCommentOfTaskOutput[`${taskOutputId}`]?.description && newCommentOfTaskOutput[`${taskOutputId}`]?.creator) {
                props.createCommentOfTaskOutput(taskId, taskOutputId, data);
            }
            let commentOfTaskOutput = {
                description: "",
                files: [],
                descriptionDefault: ''
            }
            CommentOfTaskOutputFilePaste = []
            setState(state => {
                return {
                    ...state,
                    newCommentOfTaskOutput: commentOfTaskOutput,
                    CommentOfTaskOutputFilePaste
                }
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

    const handleApprove = (status, taskOutputId) => {
        if (status === "waiting_for_approval") {
            Swal.fire({
                html: "<h3>Xác nhận gửi yêu cầu phê duyệt kết quả này</h3>",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "No",
                confirmButtonText: "Yes"
            }).then((res) => {
                if (res.value) {
                    props.approveTaskOutputs(performtasks.task._id, taskOutputId, { action: "waiting_for_approval", creator: idUser })
                }
            });
        }
        if (status === "approve") {
            Swal.fire({
                html: "<h3>Phê duyệt kết quả giao nộp này</h3>",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "No",
                confirmButtonText: "Yes"
            }).then((res) => {
                if (res.value) {
                    props.approveTaskOutputs(performtasks.task._id, taskOutputId, { action: "approve", creator: idUser })
                }
            });
        }
        if (status === "reject") {
            Swal.fire({
                html: "<h3>Từ chối kết quả giao dịch này<br/>Lý do từ chối:</h3>",
                icon: "error",
                showCancelButton: true,
                input: "text",
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "No",
                confirmButtonText: "Yes"
            }).then((res) => {
                if (res.value) {
                    props.approveTaskOutputs(
                        performtasks.task._id,
                        taskOutputId,
                        {
                            action: "reject",
                            description: res.value,
                            creator: idUser,
                        }
                    )
                }
            });
        }
    }

    const handleDeleteFile = (fileId, fileName, actionId, type) => {
        let { performtasks, translate } = props
        Swal.fire({
            html: `<div style="max-width: 100%; max-height: 100%" >Xác nhận xóa ${fileName} ? <div>`,
            showCancelButton: true,
            cancelButtonText: `Hủy bỏ`,
            confirmButtonText: `Đồng ý`,
        }).then((result) => {
            if (result.isConfirmed) {
                save(performtasks?.task?._id)
            }
        })
        setState({
            ...state,
            deleteFile: {
                fileId: fileId,
                actionId: actionId,
                fileName: fileName,
                type: type
            }
        });
    }

    const save = (taskId) => {
        let { deleteFile } = state
        if (deleteFile.type === "action") {
            props.deleteFileAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "task") {
            props.deleteFileTask(deleteFile.fileId, deleteFile.actionId, taskId)
        }
    }

    if (!performtasks?.task?.taskOutputs) {
        return <div>Chưa có thông tin</div>
    }

    const checkTest = (value) => {
        if (value === "approved") {
            return <i className="fa fa-check-square-o" aria-hidden="true"></i>
        }
        if (value === "rejected") {
            return <i className="fa fa-times text-danger"></i>
        }
        // return <i className="fa fa-circle text-warning"></i>
        return <i className="fa fa-square-o"></i>
    }

    return (
        <div>
            <ModalVersionsTaskOutput taskOutput={taskOutput} />
            <div>
                {/* Kết quả */}
                {performtasks.task.taskOutputs.map((taskOutput, index) => {
                    return (
                        <ShowMoreShowLess
                            id={`historyLog${taskOutput._id}`}
                            styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                        >
                            {/* phê duyệt */}
                            <div key={taskOutput._id} className={`item-box ${index > 3 ? "hide-component" : "block"}`}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>{taskOutput.status === "approved" && <i className='fa fa-check text-success' style={{ marginRight: "3px" }}></i>}<a style={{ fontWeight: 700, cursor: "pointer", marginLeft: taskOutput.status !== "approved" ? "17px" : 0 }}>{taskOutput.title}</a></div>
                                    <div onClick={() => {
                                        if (showPanels.includes(taskOutput._id)) {
                                            let newShowPanels = showPanels.filter((panels) => panels !== taskOutput._id)
                                            setShowPanels(newShowPanels)
                                        } else {
                                            let newShowPanels = [...showPanels, taskOutput._id]
                                            setShowPanels(newShowPanels)
                                        }
                                    }}>
                                        <i className={`fa ${showPanels.includes(taskOutput._id) ? "fa-angle-up" : "fa-angle-down"}`}></i>
                                    </div>
                                </div>
                                <div style={{ display: `${showPanels.includes(taskOutput._id) ? "" : "none"}` }}>
                                    <div className='description'>
                                        <div className='acountable-employees'><strong>{getAcountableEmployees(taskOutput.accountableEmployees)} chưa phê duyệt kết quả giao nộp</strong></div>
                                        <div><strong>Yêu cầu:</strong> {parse(taskOutput.description)}</div>
                                        <div><strong>Kiểu dữ liệu:</strong> {formatTypeInfo(taskOutput.type)}</div>
                                        {/* <div><strong>Người đã phê duyệt: </strong>{getAcoutableEmployees(taskOutput.accountableEmployees)}</div> */}
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>Kết quả giao nộp lần 1</span>
                                                <span className="text-sm" style={{ paddingRight: "10px", paddingLeft: "5px" }}>(<DateTimeConverter dateTime={taskOutput.submissionResults.createdAt} />)</span>
                                                {
                                                    taskOutput.status === "inprogess" && role === "responsible" &&
                                                    <a style={{ cursor: "pointer" }} onClick={() => { handleApprove("waiting_for_approval", taskOutput._id) }}>Yêu cầu phê duyệt</a>
                                                }
                                            </div>
                                            <div style={{ display: "flex" }}>
                                                <a className="edit text-yellow" style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => handleEditAction(taskOutput)}><i className="material-icons">edit</i></a>
                                                <a className="delete text-red" style={{ display: "flex", alignItems: "center" }} onClick={() => { }}><i className="material-icons" id="delete-event"></i></a>
                                            </div>
                                        </div>
                                        {role === "responsible" && !taskOutput?.submissionResults?.description && <React.Fragment>
                                            <div>
                                                <ContentMaker
                                                    idQuill={`add-action-${taskOutput._id}`}
                                                    imageDropAndPasteQuill={false}
                                                    inputCssClass="text-input-task-output" controlCssClass="tool-task-output row"
                                                    onFilesChange={onActionFilesChange}
                                                    onFilesError={onFilesError}
                                                    files={newAction.files}
                                                    placeholder={"Mô tả kết quả"}
                                                    text={newAction.descriptionDefault}
                                                    submitButtonText={'Giao nộp'}
                                                    onTextChange={(value, imgs) => {
                                                        setState({
                                                            ...state,
                                                            newAction: {
                                                                ...state.newAction,
                                                                description: value,
                                                                descriptionDefault: null
                                                            }
                                                        })
                                                    }}
                                                    onSubmit={(e) => { submitAction(taskOutput._id, performtasks.task._id, performtasks.task.taskActions.length, taskOutput.type) }}
                                                />
                                            </div>
                                        </React.Fragment>
                                        }
                                        <ShowMoreShowLess
                                            id={`description${taskOutput._id}`}
                                            classShowMoreLess='tool-level1'
                                            styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                                        >
                                            {
                                                taskOutput?.submissionResults?.description &&
                                                (
                                                    <div key={taskOutput?.submissionResults._id}>
                                                        { // khi chỉnh sửa thì ẩn action hiện tại đi
                                                            editAction !== taskOutput._id &&
                                                            <React.Fragment>
                                                                <div>
                                                                    <div>
                                                                        {taskOutput.submissionResults?.description?.split('\n')?.map((elem, idx) => (
                                                                            <div key={idx}>
                                                                                {parse(elem)}
                                                                            </div>
                                                                        ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                                {/* Các action lựa chọn của người phê duyệt */}

                                                                <ul className="list-inline" style={{ display: "flex", justifyContent: "end" }}>
                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => handleShowFile(taskOutput.submissionResults._id)} ><i className="fa fa-paperclip" aria-hidden="true"></i> Tập tin đính kèm ({taskOutput.submissionResults.files && taskOutput.submissionResults.files.length})</a></li>
                                                                    {
                                                                        checkRoleAccountable(idUser, taskOutput.accountableEmployees) && (taskOutput.status === "waiting_for_approval" || taskOutput.status === "rejected") &&
                                                                        <>
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => { handleApprove("approve", taskOutput._id) }} ><i className="fa fa-check" aria-hidden="true"></i> Phê duyệt</a></li>
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => { handleApprove("reject", taskOutput._id) }} ><i className="fa fa-times" aria-hidden="true"></i> Từ chối</a></li>
                                                                        </>
                                                                    }
                                                                    <li><a style={{ cursor: "pointer" }}
                                                                        onClick={async () => {
                                                                            await setTaskOutput(taskOutput);
                                                                            showVersionsTaskOutput(taskOutput);
                                                                        }} ><i className="fa fa-history" aria-hidden="true"></i> Lịch sử giao nộp</a></li>
                                                                </ul>

                                                                {showFile.some(obj => obj === taskOutput.submissionResults._id) &&
                                                                    <div style={{ cursor: "pointer" }}>
                                                                        <div>Tập tin đính kèm:</div>
                                                                        <ul>
                                                                            {taskOutput.submissionResults.files.map((elem, index) => {
                                                                                let listImage = taskOutput.submissionResults.files?.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
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
                                                            </React.Fragment>
                                                        }
                                                        {editAction == taskOutput._id &&
                                                            <React.Fragment>
                                                                <div>
                                                                    <ContentMaker
                                                                        idQuill={`edit-action-${taskOutput.submissionResults._id}`}
                                                                        inputCssClass="text-input-task-output" controlCssClass="tool-task-output row"
                                                                        onFilesChange={onEditActionFilesChange}
                                                                        onFilesError={onFilesError}
                                                                        files={newActionEdited.files}
                                                                        text={newActionEdited.descriptionDefault}
                                                                        submitButtonText={"Lưu"}
                                                                        cancelButtonText={"Hủy bỏ"}
                                                                        handleEdit={(x) => handleEditAction(x)}
                                                                        onTextChange={(value, imgs) => {
                                                                            setState({
                                                                                ...state,
                                                                                newActionEdited: {
                                                                                    ...state.newActionEdited,
                                                                                    description: value
                                                                                }
                                                                            })
                                                                        }}
                                                                        onSubmit={(e) => {
                                                                            handleSaveEditAction(e, taskOutput._id, taskOutput.submissionResults.description, task._id, taskOutput.submissionResults._id)
                                                                        }}
                                                                    />

                                                                    {taskOutput.submissionResults.files.length > 0 &&
                                                                        <div className="tool-level1" style={{ marginTop: -10 }}>
                                                                            {taskOutput.submissionResults.files.map((file, index) => {
                                                                                return <div key={index}>
                                                                                    <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => {
                                                                                        handleDeleteFile(file._id, file.name, taskOutput.submissionResults._id, "action")
                                                                                    }}><i className="fa fa-times"></i></a>
                                                                                </div>
                                                                            })}
                                                                        </div>}
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                    </div>
                                                )
                                            }
                                            {/* Sửa thành trao đổi */}
                                            {/* {
                                                checkRoleAccountable(idUser, taskOutput.accountableEmployees) &&
                                                <div>
                                                    <img className="user-img-level2"
                                                        src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar"
                                                    />
                                                    <ContentMaker
                                                        idQuill={`add-comment-action-${taskOutput._id}`}
                                                        imageDropAndPasteQuill={false}
                                                        inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                        onFilesChange={(files) => onCommentFilesChange(files, taskOutput._id)}
                                                        onFilesError={onFilesError}
                                                        files={newCommentOfTaskOutput[`${taskOutput._id}`]?.files}
                                                        text={newCommentOfTaskOutput[`${taskOutput._id}`]?.descriptionDefault}
                                                        placeholder={"Thêm yêu cầu chỉnh sửa"}
                                                        submitButtonText={"Yêu cầu chỉnh sửa"}
                                                        onTextChange={(value, imgs) => handleChangleCommentOfTaskOutput(value, taskOutput)}
                                                        onSubmit={(e) => submitComment(taskOutput._id, task._id)}
                                                    />
                                                </div>
                                            } */}
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
                                                                            <a style={{ cursor: "pointer", fontWeight: "bold" }}>{child.creator?.name} </a>
                                                                            {child.status === "not_edited_yet" && role === "responsible" &&
                                                                                // color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "2px 4px", borderRadius: "10px"
                                                                                <div style={{ cursor: "pointer" }}
                                                                                    onClick={() => {
                                                                                        props.editCommentOfTaskOutput(task._id, taskOutput._id, child._id, { status: "edited", creator: idUser })
                                                                                    }}
                                                                                >
                                                                                    <a>Xác nhận chỉnh sửa</a>
                                                                                </div>
                                                                            }
                                                                            {child.status === "not_edited_yet" && role !== "responsible" && <div>Chưa chỉnh sửa</div>}
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

                                        {/* <div style={{ display: "flex", justifyContent: "center" }}>
                                            <button className="btn btn-default btn-sm" style={{ width: "60%" }} onClick={async () => {
                                                await setTaskOutput(taskOutput);
                                                showVersionsTaskOutput(taskOutput);
                                            }}>Xem các phiên bản chỉnh sửa</button>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </ShowMoreShowLess>
                    )
                })}
            </div>
        </div>
    )
}

function mapState(state) {
    const { performtasks, tasks, auth } = state;
    return { performtasks, tasks, auth };
}

const actionCreators = {
    createTaskOutputs: performTaskAction.createTaskOutputs,
    getTaskOutputs: performTaskAction.getTaskOutputs,
    downloadFile: AuthActions.downloadFile,
    approveTaskOutputs: performTaskAction.approveTaskOutputs,
    editSubmissionResults: performTaskAction.editSubmissionResults,
    deleteFileAction: performTaskAction.deleteFileAction,
    deleteSubmissionResults: performTaskAction.deleteSubmissionResults,
    createCommentOfTaskOutput: performTaskAction.createCommentOfTaskOutput,
    editCommentOfTaskOutput: performTaskAction.editCommentOfTaskOutput,
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(TaskOutputsTab));

export { connectedTaskOutputs as TaskOutputsTab };

