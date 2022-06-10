import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import OutputDetail from './modalDetailOutput';
import parse from 'html-react-parser';
import { getStorage } from '../../../../config';
import { ApiImage, ContentMaker, DateTimeConverter, SelectBox, ShowMoreShowLess } from '../../../../common-components';
import { performTaskAction } from '../redux/actions';
import { AuthActions } from '../../../auth/redux/actions';
import Swal from 'sweetalert2';
import { xor } from 'lodash';

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
                <div style={{ color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "5px", borderRadius: "4px" }}>
                    Chưa hoàn thành
                </div>
            );
        case "waiting_approval":
            return (
                <div style={{ color: "rgba(146, 64, 14)", backgroundColor: "rgba(253, 230, 138)", padding: "5px", borderRadius: "4px" }}>
                    Đang chờ phê duyệt
                </div>
            );
        case "rejected":
            return (
                <div style={{ color: "rgba(239, 68, 68)", backgroundColor: "rgba(254, 202, 202)", padding: "5px", borderRadius: "4px" }}>
                    Bị từ chối
                </div>
            );
        case "approved":
            return (
                <div style={{ color: "rgba(16, 185, 129)", backgroundColor: "rgba(167, 243, 208)", padding: "5px", borderRadius: "4px" }}>
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

const checkRoleAccountable = (userId, accountable) => {
    let check;
    const accountableEmployee = accountable?.find(item => item.accountableEmployee._id == userId);
    check = accountableEmployee ? true : false;
    return check;
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

const valueType = (idUser, accountableEmployees) => {
    const accountableEmployee = accountableEmployees.find(item => item.accountableEmployee._id === idUser);
    if (!accountableEmployee) {
        return "waiting_for_approval";
    }
    return accountableEmployee.action;
}

const getAcoutableEmployees = (data) => {
    const accountableEmployees = data && data.filter(item => item.action === "approve");
    if (accountableEmployees) {
        let users = "";
        accountableEmployees.map(item => {
            users = users + `${item.accountableEmployee.name} `
            return item;
        })
        return users;
    }
    return "Chưa có ai phê duyệt";
}

function TaskOutputsTab(props) {
    const { performtasks, auth, role } = props;
    const idUser = getStorage("userId");
    const [showLogs, setShowLogs] = useState(false);
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
            showFile: [],
            editAction: ""
        }
    })
    const { newAction, showFile, editAction, newActionEdited } = state;
    const { task } = performtasks;

    useEffect(() => {
        props.getTaskOutputs(performtasks.task._id)
    }, [performtasks.task._id])

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(path, fileName);
    }

    const showFilePreview = (data) => {
        setState({
            ...state,
            currentFilepri: data,
        });
        window.$('#modal-file-preview').modal('show');
    }

    const handleEditAction = (item) => {
        setState({
            ...state,
            editAction: item._id,
            newActionEdited: {
                ...state.newActionEdited,
                descriptionDefault: item.description
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
        if (newActionEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newActionEdited.description)
        }
        data.append("creator", newActionEdited.creator)
        if (newActionEdited.description || newActionEdited.files) {
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

    const handleApprove = (status, taskOutputId) => {
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

    return (
        <div>
            <OutputDetail />
            <div>
                {/* Kết quả */}
                {performtasks.task.taskOutputs.map((item, index) => {
                    return (
                        <div className="faqs-page block ">
                            <div className="panel-group" id="accordion-notevaluation" role="tablist" aria-multiselectable="true" style={{ marginBottom: 0 }}>
                                <div className="panel panel-default" style={{ padding: "8px" }} key={index}>
                                    <span role="button" className="item-question collapsed" data-toggle="collapse" data-parent="#accordion-notevaluation" href={`#collapse-notevaluation${index}`} aria-expanded="true" aria-controls="collapse1a">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <i className="fa fa-angle-right angle-right-custom" aria-hidden="true" style={{ marginLeft: "5px", marginRight: "5px" }}></i>
                                            <a className="task-outputs-tilte" title="dự án">{item.title}</a>
                                            {/* <div aria-hidden="true" style={{ color: "rgba(16, 185, 129)", backgroundColor: "rgba(167, 243, 208)", padding: "2px 5px 2px 5px", marginLeft: "5px", borderRadius: "4px" }}>Chưa hoàn thành</div> */}
                                        </div>
                                    </span>
                                    <div id={`collapse-notevaluation${index}`} className="panel-collapse collapse" role="tabpanel">
                                        <div className="panel-body">
                                            {/* phê duyệt */}
                                            <div className='form-group' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    {formatStatusInfo(item.status)}
                                                </div>

                                                <div className="form-group">
                                                    {checkRoleAccountable(idUser, item.accountableEmployees) &&
                                                        <SelectBox
                                                            id={`status-${item._id}`}
                                                            className="form-control select2"
                                                            style={{ width: "100%", padding: '5px', marginRight: '5px' }}
                                                            value={valueType(idUser, item.accountableEmployees)}
                                                            items={[
                                                                { value: 'approve', text: 'Phê duyệt ' },
                                                                { value: 'waiting_for_approval', text: "Chờ phê duyệt " },
                                                                { value: 'reject', text: "Từ chối " },
                                                            ]}
                                                            onChange={(value) => { handleApprove(value[0], item._id) }}
                                                        />
                                                    }
                                                </div>
                                            </div>

                                            <div className="time-todo-range" style={{ marginBottom: "5px" }}>
                                                <div style={{ marginRight: '10px' }}><strong>Mô tả:</strong> {parse(item.description)}</div>
                                            </div>
                                            <div style={{ marginBottom: "5px" }}>
                                                <span style={{ marginRight: '10px' }}><strong>Kiểu dữ liệu:</strong> {formatTypeInfo(item.type)}</span>
                                            </div>
                                            <div style={{ marginBottom: "5px" }}>
                                                <span style={{ marginRight: '10px' }}><strong>Người đã phê duyệt: </strong>{getAcoutableEmployees(item.accountableEmployees)}</span>
                                            </div>
                                            <div style={{ marginBottom: "5px" }}>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <strong>Đã giao nộp:</strong>
                                                </div>
                                                {role === "responsible" && <React.Fragment>
                                                    <div>
                                                        <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                                        <ContentMaker
                                                            idQuill={`add-action-${item._id}`}
                                                            imageDropAndPasteQuill={false}
                                                            inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                                            onFilesChange={onActionFilesChange}
                                                            onFilesError={onFilesError}
                                                            files={newAction.files}
                                                            placeholder={"Báo cáo kết quả"}
                                                            text={newAction.descriptionDefault}
                                                            submitButtonText={'Thêm'}
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
                                                            onSubmit={(e) => { submitAction(item._id, performtasks.task._id, performtasks.task.taskActions.length, item.type) }}
                                                        />
                                                    </div>
                                                </React.Fragment>
                                                }
                                                <ShowMoreShowLess
                                                    id={`description${item._id}`}
                                                    classShowMoreLess='tool-level1'
                                                    styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                                                >
                                                    {
                                                        item?.submissionResults?.taskActions?.map((x) => {
                                                            if (!x?._id) {
                                                                return <></>
                                                            }

                                                            let listImage = x.files?.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                                            return (
                                                                <div key={x._id} className={index > 3 ? "hide-component" : ""}>
                                                                    {x.creator ?
                                                                        <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + x.creator.avatar)} alt="User Image" /> :
                                                                        <div className="user-img-level1" />
                                                                    }
                                                                    { // khi chỉnh sửa thì ẩn action hiện tại đi
                                                                        editAction !== x._id &&
                                                                        <React.Fragment>
                                                                            {/* { marginBottom: "35px" } */}
                                                                            <div className="content-level1" data-width="100%">
                                                                                {/* Tên người tạo hoạt động */}
                                                                                <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
                                                                                    {
                                                                                        x.creator && <a style={{ cursor: "pointer" }}>{x.creator?.name} </a>
                                                                                    }
                                                                                </div>
                                                                                <div>
                                                                                    {
                                                                                        x.name && <b style={{ display: 'flex', marginTop: '4px' }}>{x.name} </b>
                                                                                    }
                                                                                    {x?.description?.split('\n')?.map((elem, idx) => (
                                                                                        <div key={idx}>
                                                                                            {parse(elem)}
                                                                                        </div>
                                                                                    ))
                                                                                    }
                                                                                </div>
                                                                                <div className="btn-group pull-right">
                                                                                    {(role === 'responsible' && x.creator) &&
                                                                                        <React.Fragment>
                                                                                            <span data-toggle="dropdown">
                                                                                                <i className="fa fa-ellipsis-h"></i>
                                                                                            </span>
                                                                                            <ul className="dropdown-menu">
                                                                                                <li><a style={{ cursor: "pointer" }} onClick={() => handleEditAction(x)} >Chỉnh sửa báo cáo kết quả</a></li>
                                                                                                <li><a style={{ cursor: "pointer" }} onClick={() => props.deleteSubmissionResults(task._id, item._id, { actionId: x._id, description: x.description, creator: idUser })} >Xóa báo cáo</a></li>
                                                                                            </ul>
                                                                                        </React.Fragment>
                                                                                    }

                                                                                </div>
                                                                            </div>

                                                                            {<ul className="list-inline tool-level1">
                                                                                <li><span className="text-sm">{<DateTimeConverter dateTime={x.createdAt} />}</span></li>
                                                                                <li>{x.mandatory && !x.creator && <b className="text-sm">265</b>}</li>
                                                                                {((x.creator === undefined || x.creator === null)) &&
                                                                                    <li><a style={{ cursor: "pointer" }} className="text-green text-sm" onClick={(e) => { console.log(267) }}><i className="fa fa-check-circle" aria-hidden="true"></i> 267</a></li>}

                                                                                {/* Các chức năng tương tác với action */}
                                                                                {x.creator &&
                                                                                    <React.Fragment>
                                                                                        {x.files && x.files.length > 0 && // Chỉ hiện show file khi có file đính kèm
                                                                                            <li style={{ display: "inline-table" }}>
                                                                                                <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowFile(x._id)}><i className="fa fa-paperclip" aria-hidden="true"></i> Tập tin đính kèm ({x.files && x.files.length})</a>
                                                                                            </li>
                                                                                        }
                                                                                    </React.Fragment>
                                                                                }
                                                                            </ul>}
                                                                            {showFile.some(obj => obj === x._id) &&
                                                                                <div style={{ cursor: "pointer" }}>
                                                                                    {x.files.map((elem, index) => {
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
                                                                    {editAction === x._id &&
                                                                        <React.Fragment>
                                                                            <div>
                                                                                <ContentMaker
                                                                                    idQuill={`edit-action-${x._id}`}
                                                                                    inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
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
                                                                                        handleSaveEditAction(e, item._id, x.description, task._id, x._id)
                                                                                    }}
                                                                                />

                                                                                {x.files.length > 0 &&
                                                                                    <div className="tool-level1" style={{ marginTop: -10 }}>
                                                                                        {x.files.map((file, index) => {
                                                                                            return <div key={index}>
                                                                                                <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => {
                                                                                                    handleDeleteFile(file._id, file.name, x._id, "action")
                                                                                                }}><i className="fa fa-times"></i></a>
                                                                                            </div>
                                                                                        })}
                                                                                    </div>}
                                                                            </div>
                                                                        </React.Fragment>
                                                                    }


                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </ShowMoreShowLess>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <button className="btn btn-default btn-sm" style={{ width: "60%" }} onClick={() => setShowLogs(!showLogs)}>Xem lịch sử thay đổi</button>
                                            </div>
                                            {/* Hiển thị lịch sử chỉnh sửa */}
                                            {showLogs && <div style={{ marginTop: "10px", borderWidth: "2px" }}>
                                                {item?.submissionResults.logs.map(x => {
                                                    return (
                                                        <div key={x._id} className={index > 3 ? "hide-component" : ""}>
                                                            {x.creator ?
                                                                <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + x.creator.avatar)} alt="User Image" /> :
                                                                <div className="user-img-level1" />
                                                            }
                                                            <div className="content-level1" data-width="100%">
                                                                {/* Tên người tạo hoạt động */}
                                                                <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
                                                                    {
                                                                        x.creator && <a style={{ cursor: "pointer" }}>{x.creator?.name} </a>
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <i style={{ fontWeight: 'bold' }}>{x.action}</i>
                                                                    <div>{parse(x.description ? x.description : "")}</div>
                                                                </div>
                                                            </div>
                                                            <ul className="list-inline tool-level1">
                                                                <li><span className="text-sm">{<DateTimeConverter dateTime={x.createdAt} />}</span></li>
                                                            </ul>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
    deleteSubmissionResults: performTaskAction.deleteSubmissionResults
};

const connectedTaskOutputs = connect(mapState, actionCreators)(withTranslate(TaskOutputsTab));

export { connectedTaskOutputs as TaskOutputsTab };

