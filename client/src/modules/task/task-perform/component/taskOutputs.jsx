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
import { ModalVersionsTaskOutput } from './modalVersionsTaskOutput';
import "./taskOutput.css"
import FilePreview from './FilePreview';

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
    check = accountableEmployee ? accountableEmployee : null;
    return accountableEmployee;
}

const getActionAccountable = (userId, accountable) => {
    const accountableEmployee = accountable?.find(taskOutput => taskOutput.accountableEmployee._id == userId);
    return accountableEmployee?.action;
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

function TaskOutputsTab(props) {
    const { performtasks, auth, role } = props;
    const idUser = getStorage("userId");
    const [showPanels, setShowPanels] = useState([]);
    const [showAccountables, setShowAccountables] = useState([]);
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
                files: [],
                descriptionDefault: ""
            },
            newCommentEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            showFile: [],
            showComment: [],
            CommentOfTaskOutputFilePaste: [],
            editAction: "",
            editComment: ""
        }
    })
    const { newAction, showFile, showComment, editAction, newActionEdited, newCommentOfTaskOutput, newCommentEdited, editComment } = state;
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
        await setState({
            ...state,
            editAction: taskOutput._id,
            newActionEdited: {
                ...state.newActionEdited,
                descriptionDefault: taskOutput.submissionResults.description
            }
        })
    }
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
            files: files
        }
        setState(state => {
            return {
                ...state,
                newCommentOfTaskOutput,
            }
        })
    }

    const onEditCommentFilesChange = (files) => {
        setState({
            ...state,
            newCommentEdited: {
                ...state.newCommentEdited,
                files: files,
            }
        })
    }

    const handleEditComment = (actionComent) => {
        setState({
            ...state,
            editComment: actionComent._id,
            newCommentEdited: {
                ...state.newCommentEdited,
                descriptionDefault: actionComent.description
            }
        })
    }

    const handleSaveEditComment = async (e, taskId, taskOutputId, commentId, description) => {
        e.preventDefault();
        let { newCommentEdited } = state;
        let data = new FormData();
        newCommentEdited.files.forEach(x => {
            data.append("files", x)
        })
        if (newCommentEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newCommentEdited.description)
        }
        data.append("creator", newCommentEdited.creator)
        if (newCommentEdited.description || newCommentEdited.files) {
            await props.editCommentOfTaskOutput(taskId, taskOutputId, commentId, data);
        }
        setState({
            ...state,
            newCommentEdited: {
                ...state.newCommentEdited,
                description: "",
                files: [],
                descriptionDefault: null
            },
            editComment: ""
        })
    }

    const handleCreateCommentOfTaskOutput = (value, taskOutput) => {
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

    const submitComment = async (taskOutputId, taskId) => {
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
            newCommentOfTaskOutput[`${taskOutputId}`] = {
                description: "",
                files: [],
                descriptionDefault: ""
            }
            CommentOfTaskOutputFilePaste = []
            await setState(state => {
                return {
                    ...state,
                    newCommentOfTaskOutput,
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
                cancelButtonText: `Hủy bỏ`,
                confirmButtonText: `Xác nhận`,
            }).then((res) => {
                if (res.value) {
                    props.approveTaskOutputs(performtasks.task._id, taskOutputId, { action: "approve", creator: idUser })
                }
            });
        }
        if (status === "reject") {
            Swal.fire({
                html: "<h3>Từ chối kết quả giao nộp này</h3>",
                icon: "error",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: `Hủy bỏ`,
                confirmButtonText: `Xác nhận`,
            }).then((res) => {
                if (res.value) {
                    props.approveTaskOutputs(
                        performtasks.task._id,
                        taskOutputId,
                        {
                            action: "reject",
                            creator: idUser,
                        }
                    )
                }
            });
        }
    }

    const handleDeleteFile = (taskId, taskOutputId, file) => {
        Swal.fire({
            html: `<div style="max-width: 100%; max-height: 100%" >Xác nhận xóa ${file.name} ? <div>`,
            showCancelButton: true,
            cancelButtonText: `Hủy bỏ`,
            confirmButtonText: `Xác nhận`,
        }).then((result) => {
            if (result.isConfirmed) {
                props.deleteFileOfTaskOutput(taskId, taskOutputId, file._id);
            }
        })
        setState({
            ...state,
            deleteFile: {
                fileId: file._id,
                fileName: file.name,
            }
        });
    }

    if (!performtasks?.task?.taskOutputs) {
        return <div>Chưa có thông tin</div>
    }


    return (
        <div>
            <ModalVersionsTaskOutput taskOutput={taskOutput} />
            {
                state.currentFilepri &&
                <FilePreview
                    file={state.currentFilepri}
                />
            }
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
                                    <div style={{ display: 'flex' }}>{taskOutput.status === "approved" && <i className='fa fa-check text-success' style={{ display: 'flex', marginRight: "2px", placeItems: "center" }}></i>}
                                        <h4 className="title" style={{ fontSize: "16px", marginLeft: taskOutput.status !== "approved" ? "15px" : 0 }}>{taskOutput.title}</h4>
                                    </div>
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
                                        <div><strong>Kiểu dữ liệu:</strong> {formatTypeInfo(taskOutput.type)}</div>
                                        <div>
                                            <strong>Yêu cầu:</strong>
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
                                        {/* <div><strong>Người đã phê duyệt: </strong>{getAcoutableEmployees(taskOutput.accountableEmployees)}</div> */}
                                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px" }}>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>{taskOutput.submissionResults?.description ? `Kết quả giao nộp lần ${taskOutput.status === "approved" ? taskOutput.versions.length : taskOutput.versions.length + 1}` : "Chưa giao nộp kết quả"}</span>
                                                {role === "responsible" && taskOutput.status === "rejected" && <span className='text-sm' style={{ marginLeft: "3px" }}>(Bị từ chối)</span>}
                                                {role === "accountable" && getActionAccountable(idUser, taskOutput.accountableEmployees) == "approve" && <span className='text-sm' style={{ marginLeft: "3px" }}>(Đã phê duyệt)</span>}
                                                {role === "accountable" && getActionAccountable(idUser, taskOutput.accountableEmployees) == "reject" && <span className='text-sm' style={{ marginLeft: "3px" }}>(Đã từ chối)</span>}
                                                {
                                                    taskOutput.status === "inprogess" && role === "responsible" &&
                                                    <a style={{ cursor: "pointer", marginLeft: "10px" }} onClick={() => { handleApprove("waiting_for_approval", taskOutput._id) }}>Yêu cầu phê duyệt</a>
                                                }
                                            </div>
                                            <div style={{ display: "flex" }}>

                                                {
                                                    role === "accountable" && checkRoleAccountable(idUser, taskOutput.accountableEmployees) && (taskOutput.status === "waiting_for_approval" || taskOutput.status === "rejected" || taskOutput.status === "approved") &&
                                                    <div style={{ display: "flex" }}>
                                                        {getActionAccountable(idUser, taskOutput.accountableEmployees) !== "approve" && <a style={{ cursor: "pointer" }} onClick={() => { handleApprove("approve", taskOutput._id) }} ><i className="fa fa-check" aria-hidden="true"></i> Phê duyệt</a>}
                                                        {getActionAccountable(idUser, taskOutput.accountableEmployees) !== "reject" && <a style={{ cursor: "pointer", paddingLeft: "15px" }} onClick={() => { handleApprove("reject", taskOutput._id) }} ><i className="fa fa-times" aria-hidden="true"></i> Từ chối</a>}
                                                    </div>
                                                }
                                                {taskOutput.versions?.length > 0 && <a style={{ cursor: "pointer", marginRight: "3px", paddingLeft: "15px" }}
                                                    onClick={async () => {
                                                        await setTaskOutput(taskOutput);
                                                        showVersionsTaskOutput(taskOutput);
                                                    }} ><i className="fa fa-history" aria-hidden="true"></i> Lịch sử giao nộp</a>
                                                }
                                                {
                                                    role === "responsible" && (taskOutput.status == "inprogess" || taskOutput.status == "waiting_for_approval" || taskOutput.status == "rejected") &&
                                                    <>
                                                        <a className="edit text-yellow" style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => handleEditAction(taskOutput)}><i className="material-icons">edit</i></a>
                                                        <a className="delete text-red" style={{ display: "flex", alignItems: "center" }} onClick={() => { props.deleteSubmissionResults(performtasks.task._id, taskOutput._id) }}><i className="material-icons" id="delete-event"></i></a>
                                                    </>
                                                }
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
                                                                            <div key={idx} className="content-task-output-1">
                                                                                {parse(elem)}
                                                                            </div>
                                                                        ))
                                                                        }

                                                                    </div>
                                                                </div>
                                                                {/* Các action lựa chọn của người phê duyệt */}

                                                                <ul className="list-inline" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
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
                                                                    <li><a style={{ cursor: "pointer" }} className="text-sm" onClick={() => handleShowComment(taskOutput._id)} ><i className="fa fa-comments-o margin-r-2" aria-hidden="true"></i> Trao đổi ({taskOutput.comments && taskOutput.comments.length})</a></li>
                                                                </ul>
                                                                {showFile.some(obj => obj === taskOutput.submissionResults._id) &&
                                                                    <div style={{ cursor: "pointer", margintop: "-10px" }}>
                                                                        <ul className='list-inline tool-level1'>
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
                                                                {showAccountables.includes(taskOutput._id) && taskOutput.accountableEmployees.map((item, idx) => {
                                                                    return (
                                                                        <div key={idx} style={{ marginLeft: "55px", marginBottom: "10px", marginRight: "20px" }}>
                                                                            <b> {item.accountableEmployee?.name} </b>
                                                                            <span style={{ fontSize: 10, marginRight: 10 }} className="text-green">[ Người phê duyệt ]</span>
                                                                            {formatActionAccountable(item.action)}
                                                                            &ensp;
                                                                            {(item.action === "approve" || item.action === "reject") && <span className='text-sm'><DateTimeConverter dateTime={item.updatedAt} /></span>}
                                                                        </div >
                                                                    )
                                                                })}

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
                                                                                        handleDeleteFile(task._id, taskOutput._id, file)
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
                                            {showComment.some(x => x === taskOutput._id) &&
                                                <div>
                                                    <div>
                                                        <img className="user-img-level1"
                                                            src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar"
                                                        />
                                                        <ContentMaker
                                                            idQuill={`add-comment-action-${taskOutput._id}`}
                                                            imageDropAndPasteQuill={false}
                                                            inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                                            onFilesChange={(files) => onCommentFilesChange(files, taskOutput._id)}
                                                            onFilesError={onFilesError}
                                                            files={newCommentOfTaskOutput[`${taskOutput._id}`]?.files}
                                                            text={newCommentOfTaskOutput[`${taskOutput._id}`]?.descriptionDefault}
                                                            placeholder={"Nhập bình luận trao đổi"}
                                                            submitButtonText={"Thêm"}
                                                            onTextChange={(value, imgs) => handleCreateCommentOfTaskOutput(value, taskOutput)}
                                                            onSubmit={(e) => submitComment(taskOutput._id, task._id)}
                                                        />
                                                    </div>

                                                    <div className="comment-content-child">
                                                        {reverseArr(taskOutput.comments).map(child => {
                                                            let listImage = child.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                                            return <div key={child._id}>
                                                                <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + child.creator?.avatar)} alt="User Image" />
                                                                {editComment !== child._id &&
                                                                    <div>
                                                                        <div className="content-level1">
                                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                                <a style={{ cursor: "pointer", fontWeight: "bold" }}>{child.creator?.name} </a>
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
                                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => { handleEditComment(child) }} >Sửa bình luận</a></li>
                                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => { }} >Xóa bình luận</a></li>
                                                                                    </ul>
                                                                                </div>}
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
                                                                }
                                                                {editComment === child._id &&
                                                                    <React.Fragment>
                                                                        <div>
                                                                            <ContentMaker
                                                                                idQuill={`edit-comment-${child._id}`}
                                                                                inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                                                                onFilesChange={onEditCommentFilesChange}
                                                                                onFilesError={onFilesError}
                                                                                files={newCommentEdited.files}
                                                                                text={newCommentEdited.descriptionDefault}
                                                                                submitButtonText={"Lưu"}
                                                                                cancelButtonText={"Hủy bỏ"}
                                                                                handleEdit={(e) => handleEditComment(e)}
                                                                                onTextChange={(value, imgs) => {
                                                                                    setState({
                                                                                        ...state,
                                                                                        newCommentEdited: {
                                                                                            ...state.newCommentEdited,
                                                                                            description: value
                                                                                        }
                                                                                    })
                                                                                }}
                                                                                onSubmit={(e) => { handleSaveEditComment(e, task._id, taskOutput._id, child._id, child.description) }}
                                                                            />
                                                                            {/* Hiện file đã tải lên */}
                                                                            {child.files.length > 0 &&
                                                                                <div className="tool-level2" style={{ marginTop: -8, fontSize: '12px' }}>
                                                                                    {child.files.map((file, index) => {
                                                                                        return <div key={index}>
                                                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { }}><i className="fa fa-times"></i></a>
                                                                                        </div>
                                                                                    })}
                                                                                </div>}
                                                                        </div>
                                                                    </React.Fragment>
                                                                }
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>

                                            }
                                        </ShowMoreShowLess>
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
    deleteFileOfTaskOutput: performTaskAction.deleteFileOfTaskOutput,
    createCommentOfTaskOutput: performTaskAction.createCommentOfTaskOutput,
    editCommentOfTaskOutput: performTaskAction.editCommentOfTaskOutput,
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(TaskOutputsTab));

export { connectedTaskOutputs as TaskOutputsTab };

