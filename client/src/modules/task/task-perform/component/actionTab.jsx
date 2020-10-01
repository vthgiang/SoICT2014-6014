import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2'
import Rating from 'react-rating';
import moment from 'moment';
import 'moment/locale/vi';
import Files from 'react-files';
import './actionTab.css';

import { ContentMaker, DateTimeConverter, ApiImage } from '../../../../common-components';
import { getStorage } from '../../../../config';

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from "../../task-management/redux/actions";
import { AuthActions } from '../../../auth/redux/actions';

import { SubTaskTab } from './subTaskTab';
import { ViewProcess } from '../../task-process/component/task-process-management/viewProcess';
import { IncomingDataTab } from './incomingDataTab';
import { OutgoingDataTab } from './outgoingDataTab';

class ActionTab extends Component {
    constructor(props) {
        let idUser = getStorage("userId");
        super(props);
        let lang = getStorage("lang")
        moment.locale(lang)
        this.state = {
            currentUser: idUser,
            selected: "taskAction",
            comment: false,
            action: false,
            editComment: "",
            valueRating: 2.5,
            files: [],
            hover: {},
            taskFiles: {
                creator: idUser,
                description: '',
                files: []
            },
            editAction: "",
            editTaskComment: "",
            editCommentOfTaskComment: "",
            pauseTimer: false,
            showChildComment: "",
            showChildTaskComment: "",
            showEvaluations: [],
            newAction: {
                creator: idUser,
                description: "",
                files: []
            },
            newActionEdited: {
                creator: idUser,
                description: "",
                files: []
            },
            newCommentOfAction: {
                creator: idUser,
                description: "",
                files: [],
                taskActionId: null
            },
            newCommentOfActionEdited: {
                creator: idUser,
                description: "",
                files: []
            },
            newTaskComment: {
                creator: idUser,
                description: "",
                files: []
            },
            newTaskCommentEdited: {
                creator: idUser,
                description: "",
                files: []
            },
            newCommentOfTaskComment: {
                creator: idUser,
                description: "",
                files: []
            },
            newCommentOfTaskCommentEdited: {
                creator: idUser,
                description: "",
                files: []
            },

            showEdit: false,
            timer: {
                startTimer: "",
                stopTimer: null,
                user: idUser,
                time: 0,
            },
            evaluations: {
                creator: idUser,
            },
            fileTaskEdited: {
                files: [],
                creator: idUser,
                description: ''
            },
            value: '',
            rows: 3,
            minRows: 3,
            maxRows: 25,
            showFile: [],
            descriptionFile: "",
            deleteFile: ''
        };
        this.hover = [];
        this.contentTaskComment = [];
        this.contentCommentOfAction = [];
        this.newContentCommentOfAction = [];
        this.contentAction = [];
        this.newContentAction = [];
        this.newContentTaskComment = [];
        this.contentCommentOfTaskComment = [];
        this.newContentCommentOfTaskComment = [];
        this.descriptionFile = []

    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id
                }
            })
            this.props.getTimesheetLogs(nextProps.id);
            this.props.getStatusTimer(nextProps.id);
            this.props.getSubTask(nextProps.id);
            this.props.getTaskLog(nextProps.id);
            return true;
        }
        if (nextProps.auth.user.avatar !== this.props.auth.user.avatar) {
            this.props.getTaskById(nextProps.id)
            return true;
        }
        return true;
    }
    setHover = async (id, value) => {
        if (isNaN(value)) {
            this.hover[id] = 0;
        } else {
            this.hover[id] = value * 2;
        }
        await this.setState(state => {
            return {
                ...state,
                hover: {
                    ...state.hover,
                    id: value
                }
            }
        })
    }
    setValueRating = async (actionId, taskId, newValue, firstTime) => {
        await this.setState(state => {
            return {
                ...state,
                valueRating: newValue,
                evaluations: {
                    ...state.evaluations,
                    rating: newValue * 2,
                    firstTime: firstTime,
                    type: "evaluation"
                }
            }
        })
        let { evaluations } = this.state;
        this.props.evaluationAction(actionId, taskId, evaluations)
        await this.setState(state => {
            return {
                ...state,
                showEvaluations: [...this.state.showEvaluations, actionId]
            }
        })
    }
    handleChangeContent = async (content) => {
        await this.setState(state => {
            return {
                ...state,
                selected: content
            }
        })
    }
    handleComment = async (event) => {
        event.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                comment: !state.comment
            }
        })
    }
    handleAction = async (event) => {
        event.preventDefault();
        await this.setState(state => {
            return {
                ...state,
                action: !state.action
            }
        })
    }
    handleShowChildComment = async (id) => {
        let { showChildComment } = this.state;
        if (showChildComment === id) {
            await this.setState(state => {
                return {
                    ...state,
                    showChildComment: ""
                }
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    showChildComment: id
                }
            })
        }
    }
    handleShowChildTaskComment = async (id) => {
        let { showChildTaskComment } = this.state;
        if (showChildTaskComment === id) {
            await this.setState(state => {
                return {
                    ...state,
                    showChildTaskComment: ""
                }
            })
        } else {
            await this.setState(state => {
                return {
                    ...state,
                    showChildTaskComment: id
                }
            })
        }

    }
    handleEditCommentOfTaskComment = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                editCommentOfTaskComment: id
            }
        })
    }
    handleCloseModal = (id) => {
        let element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        let modal = document.getElementById(`modelPerformTask${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    submitComment = async (actionId, taskId) => {
        let { newCommentOfAction } = this.state;
        const data = new FormData();
        data.append("creator", newCommentOfAction.creator);
        data.append("description", newCommentOfAction.description);
        newCommentOfAction && newCommentOfAction.files.forEach(x => {
            data.append("files", x);
        })
        if (newCommentOfAction.description && newCommentOfAction.creator) {
            this.props.createActionComment(taskId, actionId, data);
        }
        await this.setState(state => {
            return {
                ...state,
                newCommentOfAction: {
                    ...state.newCommentOfAction,
                    description: "",
                    files: [],
                },
            }
        })
    }

    //Thêm mới hoạt động
    submitAction = async (taskId) => {
        let { newAction } = this.state;
        const data = new FormData();
        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        newAction.files && newAction.files.forEach(x => {
            data.append("files", x);
        })

        if (newAction.creator && newAction.description) {
            this.props.createTaskAction(taskId, data);
        }
        // Reset state cho việc thêm mới action
        await this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    description: "",
                    files: [],
                },
            }
        })
    }

    //Thêm mới bình luận của công việc
    submitTaskComment = async (taskId) => {
        let { newTaskComment } = this.state;

        const data = new FormData();
        data.append("creator", newTaskComment.creator);
        data.append("description", newTaskComment.description);
        newTaskComment.files.forEach(x => {
            data.append("files", x);
        })
        if (newTaskComment.description && newTaskComment.creator) {
            this.props.createTaskComment(taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        await this.setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    description: "",
                    files: [],
                },
            }
        })
    }
    submitCommentOfTaskComment = async (commentId, taskId) => {
        let { newCommentOfTaskComment } = this.state;
        const data = new FormData();

        data.append("creator", newCommentOfTaskComment.creator);
        data.append("description", newCommentOfTaskComment.description);
        newCommentOfTaskComment.files.forEach(x => {
            data.append("files", x);
        })
        if (newCommentOfTaskComment.description && newCommentOfTaskComment.creator) {
            this.props.createCommentOfTaskComment(commentId, taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        await this.setState(state => {
            return {
                ...state,
                newCommentOfTaskComment: {
                    ...state.newCommentOfTaskComment,
                    description: "",
                    files: [],
                },
            }
        })
    }
    handleUploadFile = async (taskId, creator) => {
        const data = new FormData();
        let { taskFiles } = this.state;
        taskFiles.files.forEach(x => {
            data.append("files", x)
        })
        data.append("description", taskFiles.description)
        data.append("creator", creator);
        if (taskFiles.files.length > 0) {
            console.log(taskFiles.files)
            this.props.uploadFile(taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        await this.setState(state => {
            return {
                ...state,
                taskFiles: {
                    ...state.taskFiles,
                    description: "",
                    files: [],
                },
            }
        })


    }
    handleEditFileTask = (fileId) => {
        this.setState(state => {
            return {
                ...state,
                showEditTaskFile: fileId
            }
        });
    }
    handleEditActionComment = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                editComment: id
            }
        })
    }
    handleEditAction = async (id) => {

        await this.setState(state => {
            return {
                ...state,
                editAction: id
            }
        })
    }
    handleEditTaskComment = async (id) => {
        await this.setState(state => {
            return {
                ...state,
                editTaskComment: id
            }
        })
    }

    handleSaveEditAction = async (e, id, description, taskId) => {
        e.preventDefault();
        let { newActionEdited } = this.state;
        let data = new FormData();
        newActionEdited.files.forEach(x => {
            data.append("files", x)
        })
        data.append("type", "edit")
        if (newActionEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newActionEdited.description)
        }
        data.append("creator", newActionEdited.creator)
        if (newActionEdited.description || newActionEdited.files) {
            this.props.editTaskAction(id, data, taskId);
        }
        await this.setState(state => {
            return {
                ...state,
                editAction: "",
                newActionEdited: {
                    ...state.newActionEdited,
                    files: [],
                    description: ""
                }
            }
        })
    }
    handleSaveEditTaskComment = async (e, taskId, commentId, description) => {
        e.preventDefault();
        let { newTaskCommentEdited } = this.state;
        let data = new FormData();
        newTaskCommentEdited.files.forEach(x => {
            data.append("files", x)
        })
        if (newTaskCommentEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newTaskCommentEdited.description)
        }
        data.append("creator", newTaskCommentEdited.creator)
        if (newTaskCommentEdited.description || newTaskCommentEdited.files) {
            this.props.editTaskComment(taskId, commentId, data);
        }
        await this.setState(state => {
            return {
                ...state,
                newTaskCommentEdited: {
                    ...state.newTaskComment,
                    description: "",
                    files: []
                },
                editTaskComment: ""
            }
        })
    }
    //Lưu hoạt động
    handleSaveEditActionComment = async (e, taskId, actionId, commentId, description) => {
        e.preventDefault();
        let { newCommentOfActionEdited } = this.state;
        let data = new FormData();
        newCommentOfActionEdited.files.forEach(x => {
            data.append("files", x)
        })
        if (newCommentOfActionEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newCommentOfActionEdited.description)
        }
        data.append("creator", newCommentOfActionEdited.creator)
        if (newCommentOfActionEdited.description || newCommentOfActionEdited.files) {
            this.props.editActionComment(taskId, actionId, commentId, data);
        }
        await this.setState(state => {
            return {
                ...state,
                newCommentOfActionEdited: {
                    ...state.newCommentOfActionEdited,
                    description: "",
                    files: []
                },
                editComment: ""
            }
        })
    }
    handleSaveEditCommentOfTaskComment = async (e, commentId, taskId, description) => {
        e.preventDefault();
        let { newCommentOfTaskCommentEdited } = this.state;
        let data = new FormData();
        newCommentOfTaskCommentEdited.files.forEach(x => {
            data.append("files", x)
        })
        if (newCommentOfTaskCommentEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", newCommentOfTaskCommentEdited.description)
        }
        data.append("creator", newCommentOfTaskCommentEdited.creator)
        if (newCommentOfTaskCommentEdited.description || newCommentOfTaskCommentEdited.files) {
            this.props.editCommentOfTaskComment(commentId, taskId, data);
        }

        await this.setState(state => {
            return {
                ...state,
                newCommentOfTaskCommentEdited: {
                    ...state.newCommentOfTaskCommentEdited,
                    description: "",
                    files: []
                },
                editCommentOfTaskComment: ""
            }
        })
    }
    handleSaveEditTaskFile = async (e, description, documentId, taskId) => {
        e.preventDefault();
        let { fileTaskEdited } = this.state;
        let data = new FormData();
        fileTaskEdited.files.forEach(x => {
            data.append("files", x)
        })
        if (fileTaskEdited.description === "") {
            data.append("description", description)
        } else {
            data.append("description", fileTaskEdited.description)
        }
        data.append("creator", fileTaskEdited.creator)
        if (fileTaskEdited.description || fileTaskEdited.files) {
            this.props.editDocument(documentId, taskId, data);
        }

        await this.setState(state => {
            return {
                ...state,
                fileTaskEdited: {
                    ...state.fileTaskEdited,
                    description: "",
                    files: []
                },
                showEditTaskFile: ""
            }
        })
    }
    onEditCommentOfTaskCommentFilesChange = async (files) => {

    }
    handleConfirmAction = async (e, actionId, userId, taskId) => {
        e.preventDefault();
        this.props.confirmAction(userId, actionId, taskId)
    }
    handleChange = (event) => {

        const textareaLineHeight = 13;
        const { minRows, maxRows } = this.state;
        const previousRows = event.target.rows;//3
        event.target.rows = minRows; // reset number of rows in textarea 
        const currentRows = ~~(event.target.scrollHeight / textareaLineHeight);
        if (currentRows === previousRows) {
            event.target.rows = currentRows;
        }
        if (currentRows >= maxRows) {
            event.target.rows = maxRows;
            event.target.scrollTop = event.target.scrollHeight;
        }

        this.setState({
            value: event.target.value,
            rows: currentRows < maxRows ? currentRows : maxRows,
        });
    };
    onActionFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    files: files,
                }
            }
        })
    }
    onEditActionFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newActionEdited: {
                    ...state.newActionEdited,
                    files: files,
                }
            }
        })
    }
    onEditCommentOfActionFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newCommentOfActionEdited: {
                    ...state.newCommentOfActionEdited,
                    files: files,
                }
            }
        })
    }
    onEditCommentOfTaskCommentFilesChange = async (files) => {
        this.setState(state => {
            return {
                ...state,
                newCommentOfTaskCommentEdited: {
                    ...state.newCommentOfTaskCommentEdited,
                    files: files
                }
            }
        });
    }
    onEditTaskCommentFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newTaskCommentEdited: {
                    ...state.newTaskCommentEdited,
                    files: files
                }
            }
        });
    }
    onTaskCommentFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    files: files,
                }
            }
        })
    }
    onCommentFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newCommentOfAction: {
                    ...state.newCommentOfAction,
                    files: files,
                }
            }
        })
    }
    onCommentOfTaskCommentFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                newCommentOfTaskComment: {
                    ...state.newCommentOfTaskComment,
                    files: files,
                }
            }
        })
    }

    onTaskFilesChange = (files) => {
        this.setState(state => {
            return {
                ...state,
                taskFiles: {
                    ...state.taskFiles,
                    files: files,
                }
            }
        })
    }
    onFilesError = (error, file) => {
    }
    filesRemoveOne = (file) => {
        this.refs.filesAddAction.removeFile(file)
    }
    filesRemoveAll = () => {
        this.refs.filesAddAction.removeFiles()
    }
    requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        this.props.downloadFile(path, fileName);
    }
    handleShowFile = (id) => {
        let a;
        if (this.state.showFile.some(obj => obj === id)) {
            a = this.state.showFile.filter(x => x !== id);
            this.setState(state => {
                return {
                    ...state,
                    showFile: a
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    showFile: [...this.state.showFile, id]
                }
            })
        }
    }
    handleShowEvaluations = (id) => {
        let a;
        let { showEvaluations } = this.state;
        if (showEvaluations.some(obj => obj === id)) {
            a = showEvaluations.filter(x => x !== id);
            this.setState(state => {
                return {
                    ...state,
                    showEvaluations: a
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    showEvaluations: [...this.state.showEvaluations, id]
                }
            })
        }
    }
    handleDeleteFile = async (fileId, fileName, actionId, type) => {
        let { performtasks, translate } = this.props
        Swal.fire({
            html: `<div style="max-width: 100%; max-height: 100%" >${translate("task.task_perform.question_delete_file")} ${fileName} ? <div>`,
            showCancelButton: true,
            cancelButtonText: `Hủy bỏ`,
            confirmButtonText: `Đồng ý`,
        }).then((result) => {
            if (result.isConfirmed) {
                this.save(performtasks?.task?._id)
            }
        })
        await this.setState(state => {
            return {
                ...state,
                deleteFile: {
                    fileId: fileId,
                    actionId: actionId,
                    fileName: fileName,
                    type: type
                }
            }
        });
        // window.$(`#modal-confirm-deletefile`).modal('show');
    }
    save = (taskId) => {
        let { deleteFile } = this.state
        if (deleteFile.type === "action") {
            this.props.deleteFileAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "commentofaction") {
            this.props.deleteFileCommentOfAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "taskcomment") {
            this.props.deleteFileTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "commentoftaskcomment") {
            this.props.deleteFileChildTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "task") {
            this.props.deleteFileTask(deleteFile.fileId, deleteFile.actionId, taskId)
        }
    }
    pressEnter = (event, taskId) => {
        let code = event.keyCode || event.which;
        if (code === 13 && !event.shiftKey) {
            this.submitAction(taskId)
        }
        if (code == 13 && !event.shiftKey) {
            event.preventDefault();
        }
    }

    onEditFileTask = (files) => {
        this.setState(state => {
            return {
                ...state,
                fileTaskEdited: {
                    ...state.fileTaskEdited,
                    files: files
                }
            }
        });
    }
    isImage = (src) => {
        let string = src.split(".")
        let image = ['jpg', 'jpeg', 'png', 'psd', 'pdf', 'tiff', 'gif']
        if (image.indexOf(string[string.length - 1]) !== -1) {
            return true;
        } else {
            return false;
        }
    }


    setSrc = (src) => {
        this.setState({ src: src });
    }
    render() {
        let task, informations, statusTask, documents, actionComments, taskActions, taskComments, logTimer, logs;
        const { tasks, performtasks, user, auth, translate, role } = this.props;
        const subtasks = tasks.subtasks;
        const {
            showEvaluations, selected, comment, editComment, showChildComment, editAction, action,
            editTaskComment, showChildTaskComment, showEditTaskFile,
            editCommentOfTaskComment, valueRating, currentUser, hover, fileTaskEdited,
            showFile, deleteFile, taskFiles, newActionEdited, newCommentOfActionEdited, newAction,
            newCommentOfAction, newTaskCommentEdited, newCommentOfTaskComment, newTaskComment, newCommentOfTaskCommentEdited
        } = this.state;
        const checkUserId = obj => obj.creator._id === currentUser;

        if (typeof performtasks.task !== 'undefined' && performtasks.task !== null) {
            task = performtasks.task;
            taskComments = task.taskComments;
            taskActions = task.taskActions;
            documents = task.documents
        }
        if (performtasks.logtimer) {
            logTimer = performtasks.logtimer;
        }
        if (performtasks.logs) {
            logs = performtasks.logs;
        };
        return (
            <div>
                <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a href="#taskAction" onClick={() => this.handleChangeContent("taskAction")} data-toggle="tab">{translate("task.task_perform.actions")} ({taskActions && taskActions.length})</a></li>
                        <li><a href="#taskComment" onClick={() => this.handleChangeContent("actionComment")} data-toggle="tab">{translate("task.task_perform.communication")} ({taskComments && taskComments.length})</a></li>
                        <li><a href="#documentTask" onClick={() => this.handleChangeContent("documentTask")} data-toggle="tab">{translate("task.task_perform.documents")} ({documents && documents.length})</a></li>
                        <li><a href="#logTimer" onClick={() => this.handleChangeContent("logTimer")} data-toggle="tab">{translate("task.task_perform.timesheetlogs")} ({logTimer && logTimer.length})</a></li>
                        <li><a href="#subTask" onClick={() => this.handleChangeContent("subTask")} data-toggle="tab">{translate("task.task_perform.subtasks")} ({subtasks && subtasks.length})</a></li>
                        <li><a href="#historyLog" onClick={() => this.handleChangeContent("historyLog")} data-toggle="tab">{translate("task.task_perform.change_history")} ({logs && logs.length})</a></li>
                        {/* Tab quy trình cho công việc theo quy trình */}
                        {(task && task.process) && <li><a href="#process" onClick={() => this.handleChangeContent("process")} data-toggle="tab">{translate("task.task_perform.change_process")} </a></li>}

                        {/** Điều kiện hiển thị tab dữ liệu vào */
                            task && task.preceedingTasks && task.preceedingTasks.length !== 0 &&
                            <li><a href="#incoming-data" onClick={() => this.handleChangeContent("incoming-data")} data-toggle="tab">{translate("task.task_perform.change_incoming")}</a></li>
                        }

                        {/** Điều kiện hiển thị tab dữ liệu ra */
                            task && task.followingTasks && task.followingTasks.length !== 0 &&
                            <li><a href="#outgoing-data" onClick={() => this.handleChangeContent("outgoing-data")} data-toggle="tab">{translate("task.task_perform.change_outgoing")}</a></li>
                        }
                    </ul>
                    <div className="tab-content">
                        <div className={selected === "taskAction" ? "active tab-pane" : "tab-pane"} id="taskAction">
                            {typeof taskActions !== 'undefined' && taskActions.length !== 0 ?
                                // Hiển thị hoạt động của công việc
                                taskActions.map(item => {
                                    return (
                                        <div key={item._id}>
                                            {item.creator ?
                                                <ApiImage className="user-img-level1" src={'.' + item.creator.avatar} alt="User Image" /> :
                                                <div className="user-img-level1" />
                                            }
                                            {editAction !== item._id && // khi chỉnh sửa thì ẩn action hiện tại đi
                                                <React.Fragment>
                                                    <div className="content-level1" data-width="100%">
                                                        {item.creator ?
                                                            <a style={{ cursor: "pointer" }}>{item.creator?.name} </a> :
                                                            item.name && <b>{item.name} </b>}
                                                        {item.description.split('\n').map((item, idx) => {
                                                            return (
                                                                <span key={idx}>
                                                                    {item}
                                                                    <br />
                                                                </span>
                                                            );
                                                        })
                                                        }
                                                        {(role === 'responsible' && item.creator) &&
                                                            <div className="btn-group pull-right">
                                                                <span data-toggle="dropdown">
                                                                    <i className="fa fa-ellipsis-h"></i>
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditAction(item._id)} >{translate("task.task_perform.edit_action")}</a></li>
                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteTaskAction(item._id, task._id)} >{translate("task.task_perform.delete_action")}</a></li>
                                                                </ul>
                                                            </div>}
                                                    </div>

                                                    {/* Các file đính kèm */}
                                                    <ul className="list-inline tool-level1">
                                                        <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                        <li>{item.mandatory && !item.creator && <b className="text-sm">{translate("task.task_perform.mandatory_action")}</b>}</li>
                                                        {((item.creator === undefined || item.creator === null) && role === "responsible") &&
                                                            <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={(e) => this.handleConfirmAction(e, item._id, currentUser, task._id)}><i className="fa fa-check-circle" aria-hidden="true"></i> {translate("task.task_perform.confirm_action")}</a></li>}

                                                        {/* Các chức năng tương tác với action */}
                                                        {item.creator &&
                                                            <React.Fragment>
                                                                {item.evaluations && item.evaluations.length > 0 && <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => { this.handleShowEvaluations(item._id) }}><i className="fa fa-thumbs-o-up margin-r-5"></i>{translate("task.task_perform.evaluation")} ({item.evaluations && item.evaluations.length})</a></li>}
                                                                {(role === "accountable" || role === "consulted" || role === "creator" || role === "informed") &&
                                                                    <li style={{ display: "inline-table" }} className="list-inline">
                                                                        {(
                                                                            (item.evaluations && item.evaluations.length !== 0 && !item.evaluations.some(checkUserId)) ||
                                                                            (!item.evaluations || item.evaluations.length === 0)
                                                                        ) &&
                                                                            <React.Fragment>
                                                                                <Rating
                                                                                    fractions={2}
                                                                                    emptySymbol="fa fa-star-o fa-2x high"
                                                                                    fullSymbol="fa fa-star fa-2x high"
                                                                                    initialRating={0}
                                                                                    onClick={(value) => {
                                                                                        this.setValueRating(item._id, task._id, value, 1);
                                                                                    }}
                                                                                    onHover={(value) => {
                                                                                        this.setHover(item._id, value)
                                                                                    }}
                                                                                />
                                                                                <div style={{ display: "inline", marginLeft: "5px" }}>{this.hover[item._id]}</div>
                                                                            </React.Fragment>
                                                                        }
                                                                    </li>
                                                                }

                                                                {item.files && item.files.length > 0 && // Chỉ hiện show file khi có file đính kèm
                                                                    <li style={{ display: "inline-table" }}>
                                                                        <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><i className="fa fa-paperclip" aria-hidden="true"></i> {translate("task.task_perform.file_attach")} ({item.files && item.files.length})</a>
                                                                    </li>
                                                                }
                                                                <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate("task.task_perform.comment")} ({item.comments.length}) &nbsp;</a></li>
                                                            </React.Fragment>
                                                        }
                                                    </ul>
                                                    <div className="tool-level1" style={{ paddingLeft: 5 }}>
                                                        {/* Các kết quả đánh giá của action */}

                                                        {showEvaluations.some(obj => obj === item._id) &&
                                                            <div style={{ marginBottom: "10px" }}>
                                                                <ul className="list-inline">
                                                                    <li>
                                                                        {typeof item.evaluations !== 'undefined' && item.evaluations.length !== 0 &&
                                                                            item.evaluations.map(element => {
                                                                                if (task) {
                                                                                    if (task.accountableEmployees.some(obj => obj._id === element.creator._id)) {
                                                                                        return <div>
                                                                                            <ul className="list-inline">
                                                                                                <li><b>{element.creator.name} - {element.rating}/10 </b></li>
                                                                                                <li></li>
                                                                                            </ul>

                                                                                        </div>
                                                                                    }
                                                                                    if (task.accountableEmployees.some(obj => obj._id !== element.creator._id)) {
                                                                                        return <div> {element.creator.name} - {element.rating}/10 </div>
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    </li>
                                                                    {item.evaluations.some(checkUserId) &&
                                                                        <React.Fragment>
                                                                            <li>{translate("task.task_perform.re_evaluation")}</li>
                                                                            <li>
                                                                                <Rating
                                                                                    fractions={2}
                                                                                    emptySymbol="fa fa-star-o fa-2x high"
                                                                                    fullSymbol="fa fa-star fa-2x high"
                                                                                    initialRating={0}
                                                                                    onClick={(value) => {
                                                                                        this.setValueRating(item._id, task._id, value, 0);
                                                                                    }}
                                                                                    onHover={(value) => {
                                                                                        this.setHover(item._id, value)
                                                                                    }}
                                                                                />
                                                                                <div style={{ display: "inline", marginLeft: "5px" }}>{this.hover[item._id]}</div> </li>
                                                                        </React.Fragment>
                                                                    }
                                                                </ul>
                                                            </div>
                                                        }
                                                        {/* Các file đính kèm của action */}
                                                        {showFile.some(obj => obj === item._id) &&
                                                            <div>
                                                                {item.files.map((elem, index) => {
                                                                    return <div key={index} className="show-files-task">
                                                                        {this.isImage(elem.name) ?
                                                                            <ApiImage
                                                                                className="attachment-img files-attach"
                                                                                style={{ marginTop: "5px" }}
                                                                                src={elem.url}
                                                                                file={elem}
                                                                                requestDownloadFile={this.requestDownloadFile}
                                                                            />
                                                                            :
                                                                            <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
                                                                        }
                                                                    </div>
                                                                })}
                                                            </div>
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            }
                                            {/*Chỉnh sửa nội dung hoạt động của công việc */}
                                            {editAction === item._id &&
                                                <React.Fragment>
                                                    <div>
                                                        <ContentMaker
                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                            onFilesChange={this.onEditActionFilesChange}
                                                            onFilesError={this.onFilesError}
                                                            files={newActionEdited.files}
                                                            defaultValue={item.description}
                                                            submitButtonText={translate("task.task_perform.save_edit")}
                                                            cancelButtonText={translate("task.task_perform.cancel")}
                                                            handleEdit={(e) => this.handleEditAction(e)}
                                                            onTextChange={(e) => {
                                                                let value = e.target.value;
                                                                this.setState(state => {
                                                                    return { ...state, newActionEdited: { ...state.newActionEdited, description: value } }
                                                                })
                                                            }}
                                                            onSubmit={(e) => { this.handleSaveEditAction(e, item._id, item.description, task._id) }}
                                                        />
                                                        {item.files.length > 0 &&
                                                            <div className="tool-level1" style={{ marginTop: -15 }}>
                                                                {item.files.map(file => {
                                                                    return <div>
                                                                        <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "action") }}><i className="fa fa-times"></i></a>
                                                                    </div>
                                                                })}
                                                            </div>}
                                                    </div>
                                                </React.Fragment>
                                            }

                                            {/* Hiển thị bình luận cho hoạt động */}
                                            {showChildComment === item._id &&
                                                <div>
                                                    {item.comments.map(child => {
                                                        return <div key={child._id}>
                                                            <ApiImage className="user-img-level2" src={'.' + child.creator?.avatar} alt="User Image" />

                                                            {editComment !== child._id && // Khi đang edit thì nội dung cũ đi
                                                                <div>
                                                                    <div className="content-level2">
                                                                        <a style={{ cursor: "pointer" }}>{child.creator?.name} </a>
                                                                        {child.description.split('\n').map((item, idx) => {
                                                                            return (
                                                                                <span key={idx}>
                                                                                    {item}
                                                                                    <br />
                                                                                </span>
                                                                            );
                                                                        })}

                                                                        {child.creator?._id === currentUser &&
                                                                            <div className="btn-group pull-right">
                                                                                <span data-toggle="dropdown">
                                                                                    <i className="fa fa-ellipsis-h"></i>
                                                                                </span>
                                                                                <ul className="dropdown-menu">
                                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditActionComment(child._id)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteActionComment(task._id, item._id, child._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                                </ul>
                                                                            </div>}
                                                                    </div>
                                                                    <ul className="list-inline tool-level2">
                                                                        <li><span className="text-sm">{<DateTimeConverter dateTime={child.createdAt} />}</span></li>
                                                                        <li style={{ display: "inline-table" }}>
                                                                            <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({child.files && child.files.length})</i></b></a></div></li>
                                                                        {showFile.some(obj => obj === child._id) &&
                                                                            <li style={{ display: "inline-table" }}>
                                                                                {child.files.map((elem, index) => {
                                                                                    return <div key={index} className="show-files-task">
                                                                                        {this.isImage(elem.name) ?
                                                                                            <ApiImage
                                                                                                className="attachment-img files-attach"
                                                                                                style={{ marginTop: "5px" }}
                                                                                                src={elem.url}
                                                                                                file={elem}
                                                                                                requestDownloadFile={this.requestDownloadFile}
                                                                                            />
                                                                                            :
                                                                                            <a style={{ cursor: "pointer" }} style={{ marginTop: "5px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
                                                                                        }
                                                                                    </div>
                                                                                })}
                                                                            </li>
                                                                        }

                                                                    </ul>
                                                                </div>
                                                            }
                                                            {/*Chỉnh sửa nội dung bình luận của hoạt động */}
                                                            {editComment === child._id &&
                                                                <React.Fragment>
                                                                    <div>
                                                                        <ContentMaker
                                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                                            onFilesChange={this.onEditCommentOfActionFilesChange}
                                                                            onFilesError={this.onFilesError}
                                                                            files={newCommentOfActionEdited.files}
                                                                            defaultValue={child.description}
                                                                            styletext={{ marginLeft: "40px", width: "94%" }}
                                                                            submitButtonText={translate("task.task_perform.save_edit")}
                                                                            cancelButtonText={translate("task.task_perform.cancel")}
                                                                            handleEdit={(e) => this.handleEditActionComment(e)}
                                                                            onTextChange={(e) => {
                                                                                let value = e.target.value;
                                                                                this.setState(state => {
                                                                                    return { ...state, newCommentOfActionEdited: { ...state.newCommentOfActionEdited, description: value } }
                                                                                })
                                                                            }}
                                                                            onSubmit={(e) => { this.handleSaveEditActionComment(e, task._id, item._id, child._id, child.description) }}
                                                                        />
                                                                        {/* Hiện file đã tải lên */}
                                                                        {child.files.length > 0 &&
                                                                            <div className="tool-level2" style={{ marginTop: -15 }}>
                                                                                {child.files.map((file, index) => {
                                                                                    return <div key={index}>
                                                                                        <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "commentofaction") }}><i className="fa fa-times"></i></a>
                                                                                    </div>
                                                                                })}
                                                                            </div>}
                                                                    </div>
                                                                </React.Fragment>
                                                            }
                                                        </div>;
                                                        return true;
                                                    })
                                                    }
                                                    {/*Thêm bình luận cho hoạt động */}
                                                    <div>
                                                        <ApiImage className="user-img-level2"
                                                            src={'.' + auth.user.avatar} alt="user avatar"
                                                        />
                                                        <ContentMaker
                                                            inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                            onFilesChange={this.onCommentFilesChange}
                                                            onFilesError={this.onFilesError}
                                                            files={newCommentOfAction.files}
                                                            text={newCommentOfAction.description}
                                                            placeholder={translate("task.task_perform.enter_comment_action")}
                                                            submitButtonText={translate("task.task_perform.create_comment_action")}
                                                            onTextChange={(e) => {
                                                                let value = e.target.value;
                                                                this.setState(state => {
                                                                    return { ...state, newCommentOfAction: { ...state.newCommentOfAction, description: `${value}` } }
                                                                })
                                                            }}
                                                            onSubmit={(e) => { this.submitComment(item._id, task._id) }}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        </div>)
                                }) : null
                            }
                            {/* Thêm hoạt động cho công việc*/}
                            {role === "responsible" && task &&
                                <React.Fragment>
                                    <ApiImage className="user-img-level1" src={'.' + auth.user.avatar} alt="user avatar" />
                                    <ContentMaker
                                        inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                        onFilesChange={this.onActionFilesChange}
                                        onFilesError={this.onFilesError}
                                        files={newAction.files}
                                        text={newAction.description}
                                        placeholder={translate("task.task_perform.enter_action")}
                                        submitButtonText={translate("task.task_perform.create_action")}
                                        //onKeyPress = {this.pressEnter}
                                        onTextChange={(e) => {
                                            let value = e.target.value;
                                            this.setState(state => {
                                                return { ...state, newAction: { ...state.newAction, description: value } }
                                            })
                                        }}
                                        onSubmit={(e) => { this.submitAction(task._id) }}
                                    />
                                </React.Fragment>}
                        </div>
                        {/* Chuyển qua tab trao đổi */}
                        <div className={selected === "taskComment" ? "active tab-pane" : "tab-pane"} id="taskComment">
                            {typeof taskComments !== 'undefined' && taskComments.length !== 0 ?
                                taskComments.map((item, key) => {
                                    return (
                                        <div key={key}>
                                            <ApiImage className="user-img-level1" src='data:image/jpeg;base64,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' alt="User Image" />
                                            {editTaskComment !== item._id && // Khi đang edit thì ẩn đi
                                                <React.Fragment>
                                                    <div className="content-level1">
                                                        <a style={{ cursor: "pointer" }}>{item.creator?.name} </a>
                                                        {item.description.split('\n').map((item, idx) => {
                                                            return (
                                                                <span key={idx}>
                                                                    {item}
                                                                    <br />
                                                                </span>
                                                            );
                                                        })}
                                                        {item.creator?._id === currentUser &&
                                                            <div className="btn-group pull-right">
                                                                <span data-toggle="dropdown">
                                                                    <i className="fa fa-ellipsis-h"></i>
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditTaskComment(item._id)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteTaskComment(item._id, task._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                </ul>
                                                            </div>}
                                                    </div>


                                                    <ul className="list-inline tool-level1">
                                                        <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                        <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowChildTaskComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate("task.task_perform.comment")} ({item.comments.length}) &nbsp;</a></li>
                                                        {item.files.length > 0 &&
                                                            <React.Fragment>
                                                                <li style={{ display: "inline-table" }}>
                                                                    <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({item.files && item.files.length})</i></b></a> </div></li>
                                                                {showFile.some(obj => obj === item._id) &&
                                                                    <li style={{ display: "inline-table" }}>{item.files.map((elem, index) => {
                                                                        return <div key={index} className="show-files-task">
                                                                            {this.isImage(elem.name) ?
                                                                                <ApiImage
                                                                                    className="attachment-img files-attach"
                                                                                    style={{ marginTop: "5px" }}
                                                                                    src={elem.url}
                                                                                    file={elem}
                                                                                    requestDownloadFile={this.requestDownloadFile}
                                                                                />
                                                                                : <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
                                                                            }
                                                                        </div>
                                                                    })}
                                                                    </li>
                                                                }
                                                            </React.Fragment>
                                                        }
                                                    </ul>
                                                </React.Fragment>
                                            }

                                            {/*Chỉnh sửa nội dung trao đổi của công việc */}
                                            {editTaskComment === item._id &&
                                                <React.Fragment>
                                                    <div>
                                                        <ContentMaker
                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                            onFilesChange={this.onEditTaskCommentFilesChange}
                                                            onFilesError={this.onFilesError}
                                                            files={newTaskCommentEdited.files}
                                                            defaultValue={item.description}
                                                            submitButtonText={translate("task.task_perform.save_edit")}
                                                            cancelButtonText={translate("task.task_perform.cancel")}
                                                            handleEdit={(e) => this.handleEditTaskComment(e)}
                                                            onTextChange={(e) => {
                                                                let value = e.target.value;
                                                                this.setState(state => {
                                                                    return { ...state, newTaskCommentEdited: { ...state.newTaskCommentEdited, description: value } }
                                                                })
                                                            }}
                                                            onSubmit={(e) => { this.handleSaveEditTaskComment(e, task._id, item._id, item.description) }}
                                                        />
                                                        {/* Hiện file đã tải lên */}
                                                        {item.files.length > 0 &&
                                                            <div className="tool-level1" style={{ marginTop: -15 }}>
                                                                {item.files.map((file, index) => {
                                                                    return <div key={index} >
                                                                        <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "taskcomment") }}><i className="fa fa-times"></i></a>
                                                                    </div>
                                                                })}
                                                            </div>}
                                                    </div>
                                                </React.Fragment>
                                            }

                                            {/* Hiển thị bình luận cho bình luận */}
                                            {showChildTaskComment === item._id &&
                                                <div className="comment-content-child">
                                                    {item.comments.map(child => {
                                                        return <div key={child._id}>
                                                            <ApiImage className="user-img-level2" src={'.' + item.creator?.avatar} alt="User Image" />

                                                            {editCommentOfTaskComment !== child._id && // Đang edit thì ẩn đi
                                                                <div>
                                                                    <div className="content-level2">
                                                                        <a style={{ cursor: "pointer" }}>{child.creator?.name} </a>
                                                                        {child.description.split('\n').map((item, idx) => {
                                                                            return (
                                                                                <span key={idx}>
                                                                                    {item}
                                                                                    <br />
                                                                                </span>
                                                                            );
                                                                        })}

                                                                        {child.creator?._id === currentUser &&
                                                                            <div className="btn-group pull-right">
                                                                                <span data-toggle="dropdown">
                                                                                    <i className="fa fa-ellipsis-h"></i>
                                                                                </span>
                                                                                <ul className="dropdown-menu">
                                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditCommentOfTaskComment(child._id)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteCommentOfTaskComment(child._id, task._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                                </ul>
                                                                            </div>}
                                                                    </div>
                                                                    <ul className="list-inline tool-level2">
                                                                        <li><span className="text-sm">{<DateTimeConverter dateTime={child.createdAt} />}</span></li>
                                                                        {child.files.length > 0 &&
                                                                            <React.Fragment>
                                                                                <li style={{ display: "inline-table" }}>
                                                                                    <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({child.files && child.files.length})</i></b></a></div></li>
                                                                                {showFile.some(obj => obj === child._id) &&
                                                                                    <li style={{ display: "inline-table" }}>
                                                                                        {child.files.map((elem, index) => {
                                                                                            return <div key={index} className="show-files-task">
                                                                                                {this.isImage(elem.name) ?
                                                                                                    <ApiImage
                                                                                                        className="attachment-img files-attach"
                                                                                                        style={{ marginTop: "5px" }}
                                                                                                        src={elem.url}
                                                                                                        file={elem}
                                                                                                        requestDownloadFile={this.requestDownloadFile}
                                                                                                    />
                                                                                                    :
                                                                                                    <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
                                                                                                }
                                                                                            </div>
                                                                                        })}
                                                                                    </li>
                                                                                }
                                                                            </React.Fragment>}
                                                                    </ul>
                                                                </div>
                                                            }

                                                            {/* Sửa bình luận của bình luận */}
                                                            {editCommentOfTaskComment === child._id &&
                                                                <React.Fragment>
                                                                    <div>
                                                                        <ContentMaker
                                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                                            onFilesChange={this.onEditCommentOfTaskCommentFilesChange}
                                                                            onFilesError={this.onFilesError}
                                                                            styletext={{ marginLeft: "40px", width: "94%" }}
                                                                            files={newCommentOfTaskCommentEdited.files}
                                                                            defaultValue={child.description}
                                                                            submitButtonText={translate("task.task_perform.save_edit")}
                                                                            cancelButtonText={translate("task.task_perform.cancel")}
                                                                            handleEdit={(e) => this.handleEditCommentOfTaskComment(e)}
                                                                            onTextChange={(e) => {
                                                                                let value = e.target.value;
                                                                                this.setState(state => {
                                                                                    return { ...state, newCommentOfTaskCommentEdited: { ...state.newCommentOfTaskCommentEdited, description: value } }
                                                                                })
                                                                            }}
                                                                            onSubmit={(e) => { this.handleSaveEditCommentOfTaskComment(e, child._id, task._id, child.description) }}
                                                                        />
                                                                        {/* Hiện file đã tải lên */}
                                                                        {child.files.length > 0 &&
                                                                            <div className="tool-level2" style={{ marginTop: -15 }}>
                                                                                {child.files.map(file => {
                                                                                    return <div>
                                                                                        <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "commentoftaskcomment") }}><i className="fa fa-times"></i></a>
                                                                                    </div>
                                                                                })}
                                                                            </div>}
                                                                    </div>
                                                                </React.Fragment>
                                                            }
                                                        </div>;
                                                        return true;
                                                    })
                                                    }
                                                    {/*Thêm bình luận cho bình luận */}
                                                    <div>
                                                        <ApiImage className="user-img-level2" src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExMWFhUXGRoYGRgXGB0aGhkaGBsYGhsYGhsYHSggGB0lGxcbITEhJikrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0mHyUtLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAOEA4QMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgABB//EAEQQAAECBAMFBQUFBgQGAwAAAAECEQADITEEEkEFUWFxgRMikaGxBjLB0fAUI0JS4RUzU2KS8XKCorIHFjRzwtJDVOL/xAAZAQADAQEBAAAAAAAAAAAAAAAAAQIDBAX/xAAmEQACAgICAgIBBQEAAAAAAAAAAQIRAyESMUFRE2EiMlKBofAE/9oADAMBAAIRAxEAPwDEYraqiWypAILpA37+P9orwuLzKlhQchSQCBYOlw2tvOGMzZaVKJNH4vAwwISoZVEkX7otYs/PURCarRgMNoSSFJUN7dDaKVJzylAUOWgDB1A/J/AQ2QkLQNQoBj6K+MAJwtHKSz7rNXyIHhGKl7BLZ5sDYuUqXNYJDEF6G9X0A5axDbGAAWhWHchVFpCiB3W1en6Qv/a81U0Ss2XvMaM7E2ANXLNaw6XbbxZlqEuWyZakghW8WNeBBtuhqM+Vt/wbycUqQRKAlmrMsEbnNcod+6WLPaBQkJymYJpVnYJSo0tSvz3iO2liUqKJeZLBTKNLnK7hnT3n+gYYYPBBIWjVJJFHowY1FXZnbezRTdK2YgGG2eozlA5qe8bJYl6gXDi2pEHFaKmwqgMw7qTWlgC1T0giVIOaeJZC1lYfRgAe653X6wJOweIBdMp3CS7gM5fKxN6Mdz63hc1e2Vxk+kUYHBylTlVUQmpej6lVGJD0cDQxdtRcpREoLyKGUksaUClCg4k8xzgzGSSuVnVLAWAMoUGKSWBSDQj9BCLF4laypQloce8oAEnNqa0pT6EOP5OyeuyzFSZYJCJilAPVgS5rckeLRGTNmAuEEEfiGnJrRTImgypiaAkpJUWZIGt3c7gHixOH+7zpJUEnvULtYEVs40rF9dgN04qYpGaYKZWCiWzNUtVyW1gQ4h1hlAEVzVAAA4gAW3boOOLlyyUEZgSCB72UEO5c6kvyY6iOQO3+8lTMqQ6Sw1G8Uu4jO68AwH7YvMXLgu7sO87ENy3cgLR6lbHMyRvIDBk0flxjlyV5sqgAwcquk6gEUqbX14RCZh8jVUFd7K9rMC2rCvUxdodg+K2gAogklmDb7O24tY8IoVjszZQaAkhQowrWvPXWKlbLKlnK2VKczpOYqAIdfioO4pF+Jw601SuUrMpiEOTvdmFKN132rQyEvHZnZIdg766PlJOgF4vRiAkDulSi6WdmZjc8zZ4tl4OXMVJ+9BStKSASRlJIBSkB2c/hO4x5ihkmqlkuEF3IAszMGoLCC0JkQlwFEqqWyhyQzXbR6dDBSsItVVE76u9d71fnA2FUoFTmYkhwEpBOUXzB+v8AVxj2TilgBvdqz65b0AfX6aGpAXqwk1ICm7poKAihr1gWapY7xFE3oPlf5QfhdqzShaDJzA1DP3Sw5u4qBe9xEJ6FZRnluC+UD3gNSpqB3TroYLQC5OICx3UupeYFg7sHzWd6Kfl0ElIKgApnCanu01qTVyX8rxaAcrBKkKaqmoARUC2UG/Fm5xzAIIUAtqFRLgOHDh3IdvdgAq7L/t/1Jjoj20z+EPCZHQwHczDlV1FtQKeeseIwAKirMSbg6ghmIN9IWYv7Ur92srFiEgJbjXTi8D4HtJCyuYkklJSQpYqaWPwrGSTrsQZOxH2dSkd91HMSTqS7jfz4QVszbeWZdSkLZwbpOpDXFzCcibiZgSV0AepsHDsPCGmJ2bKRLWUulk0OY3ceZFOsKai9McZOLtBm004dX38spMwEFksCUuAXpS9SYBkkgLUeyJLkArBLu7d2l9x0ED4zEIUAUFIGUAlZJmE8TV7CsUIys5UOQLmHCFKhzlyd0SXjl58ywFbgBlAO/eesaLBY9MyWF6vlI3EMfiIzez8VJUohZUAzh6DkSHbTx8WKccsKShMsZGLqemZgaXIAs1XfhBON9EEdo7RUhakpYWVmFCXFXoz6vEJO2sQClcxgGDghlGorex/MfO8Rw+zlYl1BSQtNSCKKHHjpbc946RsxapqkC6GvQFLgAUtQiE4wemaRnKPQ7VtFU6WRlylQFQxDHc97HzheMKhJVR8wZRLWvQCgru3RfNKykqlgDKmuYVLClBcsGc7oSK2jPmUQACE5yaOzAuxsCGNHJEKEK66FKTm7Y3wsyRLouWGUwCcoq9HJ3PT+0GyeyCEkJYIGW7kgMKt7x/Rozmx5PaLU4qMzrFQVZTlIJsQ1qGvSDUT1HKE4eYZSCH94lhf/ABFhw+MEoW+x8tUXSZqEqVQHNXMAxofdINiDoYHwcpJJCO0qrMVO1Tdjr4E0jyQZCApM1lgqKwa5nZ0lSRViNOJi5XtJLAypkjyFrQ6l4QlD2wvEy1SkZ82cZkpy2u5NRb6vHsrGy3B94AkntCpRRocqSSDQ6EFibiFqNuqy5ezcca1gheOTMfPLIfi12DueWr3hvG62ONxD9iY8KfJLCZeZXeCcr6lYerVTRqNpaKdtrlIZYQkhQU5DUUBw3uPA8QQyoS0qyqUWQ2ndSShIAZjR1brE3DRThsCZ6VGUwAIcEv3gDqLirwlFJ2TJ2Q2ZPksXB7Ql3O/hW+r0NYsxM9KlOvvVAzA1Ae7DR36wLhNlTSsd1hmAKnDdDqWt/eH0nZIBEyXlUkFyDrvtvPprDk0mIGn9r2aEJGcJJLvViXvbh08QtrrBKCE5WSnd72rAEndzrB+MQpaDLWsBTukEBLX1TQirWMDyNmqyhK0/eKVRQrTvBibMQTroBpBGuwbsCkYYqfJMLklZDWICmIY1egfffR7Zipykg9oSTUJzNxJU1nf9YNw+EAQU5VFZdByAqLpJUod2yfcH+Ywv7KaVMUqKkXGRQI3PdtGh3YE8eJhyFJd0JKwCygsgXfj1pyMDyJTMPeDbrAs/D6FYJK1BecyxRgoJFOSucOjhpYCJqP3ZIq9UHcb20NfmOVDWzP8A3f5v9MeQ5+yT90r+j9Y6J+T/AFl8Yfu/opw63lpMtRSFEhwGVQgUeg8PCF+O2cyqTAT/ADXLUuLxqsLi5KE5UDMzksKP6RnMZgFk5glShvOv9ILeIpE45Nv0TKHHplOxZChMJoQAxILirM3VvOHOIw0ooUZpZKQ9CxoD7oNyRQc4zmIkTZtEUSLN3UDlqqutYa4XCuAZhzrymXmqO6oVHEi70iprdkmaznWLZBe5a8OsTs+WhKmAoDmUe8RT8INCX5RnJJzKAJCQ9y7DiWBMap2HZepbAprlJBUBR2tVuMX7NnNmSWIy0JajEHXg4rDjC7KyOpakqQpJSGq4Vetknd8ITp2TNUppaSob6J6d4isLkmA0w+2UJnky9V5QAGStB1qQxe3OtIdzdqSjVBCiUsO8E61BzsAQ1jXhGL2lsyZKyFSSMw8CLinSGezpyVSZi2GcqQFFTNmcd8OQxIoeJO9ozlCLplDbZ2PS+VQIYkcLOFFnvWvCFW2Nlqwy5c2WVHMVGpFGbKBqoMfKC17PzfekgOpNqim8JpXnrDbF4TPLShSc7ag5VB9ak/HlE8kpKgXRl0YmeZayBlSHJZmGYim/Qt1gNWOWB76nN2Led+kRx89IJSgkpG/XjSBkEmwjoSBIkCdxgjC4YKLO0W4PDrUfdJjQzFploCWFncCvp84dlqLJbM2V2YJWoAcQPHnC7a21K5UWGu/jAWOxpUb0H11gNNTWBL2DYQMWVJKDUFvIv6wdgtrKkIZADEgne4dhoB/bdC5MtosXKsTY/C8DSZNBhxCytSEkqzG2qnqHb8Vb6Eb4b7OxEyUUpmnICCXUQGzWB/MoqINTY2cGDtmokypfdGZRahIJP5QCW+d4rmbQQSELTV6O1MuWp3MVNXcY5JZG+o6NFij05bI7RlBaCgsVhQKWqe8SW4Cih/lijBSMoDzWBIDOxANyxdjw4R5tuXkHby1spTAp/OQDlKXerH6eFH22aSJisO6/zEkJCmHeyagUPPWGm5RuI/jhFtTNPPmBCwgDvEAuBvNFEgVJa0CInplTFrmKSAopup1E5QASLga+MKsViVZwpeXtEsQakAu9AaECjOIVYhapilKWp1Ekkm2lmHS0XGOtnO2r0bfaM+WpLkJLggFgWDXfc1bwjCpgzyiXBFAmykq/EGvpbfCvCYdBIHa5GDqLFjUOAxJJyk7vd4xfgZU1KEtMQ2dyAoElJKQBlahoS3GrQcUgGX7Ixf8AFHj+sdEu2X+cx0Z8/om0VIJKAZIBKphANgkkKKioEFxct6wZhgtFSsqVSmhJFGB+uUR2NgjLSpKylaSQpKhY/IwVNQXdIdgSOJOnq3OG2m6LdgczEFQDgEhyWoe6z/NuEQE0p7qfezXuE0y+LRXOQtNMqg4Iz5XAcN+j0p5BTlpkOpRNbAEkk7q+v0bSXgk92wrLIUm5UQkXqT+jwjmbPKQAVJJ3CrHcYYYvaUqcAFoUlSS4II9WtbwgcoH4S8aRuh9Fmy9pTZR7JSSpKrasTuGoJ0jSScClSXWcq9clvN6wmky1rAISwFyXD136mGUgzEA5gSm4JOmuvk+lN0Zz+hbLsZMmIlKCss1KRVyxbQsQXI3vugSbsvtZWeUEhRZRSlwlWrgGjtrYsQzxLaUqbOlLQlh7tQpwoEg7nZvMNEfZkmWDLJJAzE1dNiSBpp4xK1G0UvsrxQXJWFpJIQB2iQbuMxfgEkDgUvrENs7dCpaclFF3IcMOHMeHSLtuT5Sp75pktaO4FAApISTpe5I3cDGYxaitZAa7DKGHQaCNIRTptDPcJhysxo8Bs5IuIo2RMlsEsyhoYcpTFSZ0Y4rsPwWESmwgHacnMTT6+hDbBOYoxktiocHH11MZJ7OmS0YbFySDEMlHENNqpYkgRRh5Q6Kp1akdCZxSVMuwGFKg46dIsxOEIB4H0/RXlDLYskAEHw509SYOxEhKiSN1ejiCxUIMDOCMwqoqAGRnzMQUMWJBFfJrxbi5KVzJawFpJJBC1AMQABlu9XuGtDFeDShQUSU0ulndqe9ap8o6Tgu0lDKcrOylA1PaKIAYi4at6U3xjN07JaKcac2XDTFMrK4ALPQtmYZSH9PFDisUTLFSEqJypYe6Ck3FfeCdPwC9gw2rs+fIHapWFhxmUE5Vh6OxJcPq+sLcfLmlZQqycrhOqiAbnWttCSWrBjSrQSduxlgzJVISVJdQUoKNa6ixZmIHQx5KRJIqgGtsxcDrxHnCqYlSKJLoevPiOkVYkrSEqKCkKFCQGO9qDePGLoihttDBYcVStSOBBIfc3vDnXlC5OeWoEKSfED/WBEJcxQQkg17wYgEUY1B/xR7isjgJLhACbFnatTclTnkQIK8AEftD/H5R0DdkrcfCOg4RFSC9h4uYgKuUAKUxNGTVTbjy1MavZs4TUBaKpYvoXGhgWZgksJaQPxIs1FpKW8SIC2ZiuwVldkJZJIZszspR1FSRuYRhkXLa7LTG+2JiZcsqUCQWDDe7j0jB7RmKmKKjZmCdwd2/WNdt9lgSga0U72JBbyPmIQyMAlRbtAa/hZyOpoehisCSjbE3sTyAMwzOxpTeaQcZcqWl1KUZhdktQMaFQJDj6q0NJmwpSvzjkR8RCPa2HWmYcyWT7qWdsqaJAO9hGqkmC2PNj4gzZOXOkLlmhIaijR9CO8oeHVrjtomUkS8vfPer7o062jAypikl0ljwh1K9olZBLmIStI1sR9cGiJY92OhjhcevtGQkDNdP4Xq5A0Fy0MMVgCpCSkkFJKlAUzvoWpe3WEGHxyO0BlBQU/dBL1cdy1yKB6VvrGl2XOUsnMCkCwNGG8vWIyJx2hIRbXlDLnKlZykEneTZNS+/xhNs5KjMGVuto0HthOcS5YupRPQUr1PlFOz9lkDjGsJfjZpCLYKiemZVmULt6iNDLUyQTA2G2U62ABUdw9Yfbb2Z2UlJHI+EDZ0Qg6sF2LtyUDlWW3PDnaWFSpHaJLhLOx0P0IwKpiLqdhcgUHWNXsbBZpZMia4UlmJp+nWIkq2aQk2qEW10UP1aAtjsoqQfxJzJ5pct9fmgzHrKncMdRCTtCggj8JB+B+Eax6OafZsMOe4VDVJI5ivwMCyMX94U8D9cmizB4kHDk/kUX3saHzJhRLUyx4fXgIaJY+xqVLl90VOXzb4xZKxqUK7N0lnSEh/dSwrxN4E+0kSxlPeCUkc6H64wnwMuclTgDoXcPXxZvGM5RszkHjaMw5gpSEy1P3UVUE7nL3tbe2kD7Xmy1pKkku4uPE8bu/CB8fh5hWVJSWvbLcvYnjYRM7MUpKfvEpJDmtBcVo1vjBxS2Kwj2flFSsxQ4oz1cuCS2oFK6Q2O1UGWfu0q7pLL1JTmGYMcrvR4WbHwapUwgmhSrMxoQ3vAggimvHhFxTLVmJUkJp3lln0ShILk7g53xDipSKjJxVIRYfZy2MycsS0HqS9WATy/SPJs0ZkplpYKIAdlLNQxJs5swYV5kiYjBzgkqLkILHvOUk7wah97QLKKie6KuGYVffTWkbCoO7dX5fSOh59tm/8A1j/pjoi0Ph9DueMqXFQCFcQQQWPQRmcQClUyWwI7RT8gotFuI9pAqaEpQTLPdZykqLs9DbgYntTEISpUwzgQrKQgJzKsxq4AqFXtEQTXZLRGWoB3pRyToBfyGkZ+TjHW5olyaCqdzNuiczFqmnKaI/KNW3nWNHIwOBCErAU92KwTyLs4jRviCjXYr/aFGWo5TvBQTuZSb9YpnnD5XHatR0/Nx5vGjxGJlhIqCk2IDgDcQLEeEUT8PLmMBUAAOk3GgpduMSpfQjNbPwyFqVnDOCUglg+594GmsS/ZaiopSFEi4ao5x6vCfe5Ks92LkcAReNzgsMEgEu/HcLCDJk4FGCxeFmAJzSsoACRQh2dyXuTUn4ANDTYu21BYC3U7Djz5797b76TbU6UEMti9gedw3rGWxWGlZ0qlE0cl9WqCHtr5Qoy+SO0BdjDnxzaIp8fVUPhMYMIy2z5ubEKV+YqPnGjCc9AHO4XjSqN8b0a/2V2WGzqqTrwhjtiSmYCj65xnNg7TxCAkIlFaAWUXr0EOdqYx1JIDaGMWzqS2ZXFez5qhQdJu1+f94nL2CrDp7TDrVQd5Ctd5B05NpvjSAvBUohmMLky+CW62fO8WgsXv84zmKWyiPqt/rjG09pAAaav6kfXKMHi1usxvB2cudUx1sXE92Yg2WkgcxVuogeZNY8nijZ8yhAuO8npceBJ/yiJKVXzp9fTRZzjvZc8gZksSlIZw+oiKdqVzFAU1WJLtqxFH6Ax2xywUNA36+sKsTNyZiEBQ90qIfLrTQEsa8DCaTJZsMPiAMomKDLTe6S+ld4+MVYrCpCZstSncpmJUbgFSUK5swffm4wt9msYieDh5gehZzdNHAaxBr0hftmRNkzTLzKmJlkKSVVoQki/QNwtGKjuhBac0qViUijqCWFiTRR/pSaQKJjSaqLAENQiptZ91IjicTMKEKVl+8WtZ5hhXQDvFhBcrY01Se6pOU1aurX7vCK67ExTJIqCpYBTl7pBo7t3tHEFJ2gJacklKq8XJO876tHs7Zq0kgtT+anR4L2esS2K0p7rkHPlqd51pyimk0VGTTE/7anfnH9KflHRrewT/AA0/0o/9o6JuPofN+zCzlAEFD5hUbgXpzgva0tBaYFirnL+IOXA3a74CtFyj3A9foxoIpSsCoHjBJmOAQNK8w/10iMuVLKSSvKpqJylvERXhyH7zsBv3wCD8DjMqgbgEON4+t9IMmYjspi+yAKFl0lrC7VsztwhQZqdII2UoTJqZSlEBThJuApu64exNOsJpdhQ9wOHmqmI7ROUO/BmJzGpGl4abSCyCqWtW/LSvJg78IxUraE6SpaUzCKlKhdJYt7qg3Vnif7exADZxzyp16cYyljbdleKD5kzOXVU7yXPnAuKonnBuxZ4mqUJoBWBmFspB4ClHH93ijb8wBWUBvTjTSu6NU90QlsWYSZlmIPFvGnxhrOQtEwLlkpNxXWEi3DbxWNphJSJyUl2cX3QpnVgf5Bewfadcs5Z8vuk/vEigJ/M2nGNEnFy5yXQoGuheF+D2MRchQ4pESODEpWZCQl7gUB4sI5rO6VeBnhqRbMVAiMSIU7Y9opcsEA5lflG/+Y6CDb6E5KO2KPbHFAKYGwbrGMmNBGPxapiytRcn6pA+Sgbl1+vSOqEaR5+WfOVhWBU1XYj3eb/r5QRLSnNm/DoOJ0H1pAOZi2gi3DTNOL+MUQPcIk5VNdvMFLeYgDFYWaQciFlyDQGhDjTmR1hnIlkJJa49AmC8LjmSokMdANTR/H5xMhMz2ygtEx+zIWWKCUEMoEHdQKAKeu54K2ttNc5YXlCSlORSdCxVW9TXo0W7R24sksMuXQ35cKwk+1EkFqgJSavmLM/laEle2T2ezTYPaLUY+YhGVK1AEuQDyqRpz4RyZfedqF/T68I97KU1czvoQxHUODxrFCKUYtRBDqejNzDuNQzx4JywtKykZklxTUWJHOLZUsFaAfcJDhD06XJ8Xi3C7NE1XZ+4tROS5QTfLWo4FyYBi/NM/iH+v9Y9g7/lrFfkH9afnHQWiiWD2IuYnO4AIdOr82sIHGCmZVukjIMxfc/nr4GNjgpLS0BNglPoKxRtHCLWlYQQCoZTmsRz0vxjBZdkKRiUh6QRjZqcqZaLCpU1VKNzyFgOZ1jydJVKJCwUqsAd2pB13PA5Mb9lHSUpJ76yndlTmJ8w0WdkU65VBiLg9Nx16QMTWC8Xic7asAlLgZmFS7XJJuXLBoYyvETColZNVVVxJqfE1iuUgrISASSWAFyeETXImUSUrDkMkghyaBgdTvjeezuxk4ZOZTKmkVP5R+VPxOrQ0rAWYH2b+zo7ecshQrkQbPRirWh084RzVhayrTnVha8OvajaCpq0yU2fxJoIYYf2bkkg5lZSiwZ8ybqc2FqbyYjJkjDsuMHLoxcwVi/DYyZJ900uxt+kbXH+zsmZLliWyMtyzlQO/eXAYneYQbf2CqTLCisKdRAYEFmUrrQRnHNCeinCUdhOC9t5qRlKAf8AN+kXTvanETLBKRwDnxMZGQmGuGMU4R9DWST8hGIxExXvLUeDsPAUhfPAF3aC506AlgqOnyf0EUkTJgy1bhSLJKDbfFmElBS2Icbt5eHGFwaQFLUWLsOZuelT0iiBFOlsaVj2VL9YZzcDTON/ziODw+bKovvPIPXy9IYDnDl0gHRPLfu6R7LzBDpZyBcb+XOCEJKUFZD0enMb+o6wDjsblQlKaHnZgN3GIYMB2zPUUstMpRNARmzAXuFQnw6d+9/AGLSoqLm8WABOZw5IIFbGzn63RVUQQk4pnGhJ6W/SPZjAh7fT/KJysNnASmWol37tdA4bgdXo8XqwLIBmOgFTJcVDA6Fn0haFQb7OTUCeCGBqwfeD8vOGm0NjKXNSZYASogFjbeQNzDxjJYebkUlQJ0J4b42mL2uZckTEh1E5X0CiLnw9IylaloKE37Jl/wAQR0KX4nxjo0p+wtDXZW1CkAEEgaPVuHyh9JnpmVSfmDuIjKdiUykzXLKbRhY6vvDR5IxJoUnKoaj6tGcsaltCaNLj8ImYGWkKbfcPdjcW0jL7V2ApKnlHMkkU/Ekn1HGGw26chzJddnsDxPHlC9WPmO5Ud1KUhY4ziCbRZgfZkXmlz+VNuWbXo0OpeHRKByoCW3CpbzMEyZ6FIBQS3dcm7k1B4wPjMaQoy01Iq+g+ZtTjEXKTBuwfYGEUuaVEGnecj8RtfqfCNJicG6C5IP8AKYr2RhGSFlTk1s3TpB82YEgk2EZZM8rqLOvFj1tGeTLypSm4Hrd4tkYjKCnmB1Y/A+MK9q7XdRCKbzpCMz1EvmeKWKU1cjZ5Ix0b7Z6gUl9LxHa0oTJZ+7KlBygOxez3D+cJtgYtRGhI3/WkPVS1ZXYqV6+Mc7ThM1lFSjZ8+xUrspqk5WF23OHboS3SJGencYcqQJi1dvLUDo9FACgGnyqY47DkGypg8P8A1j0knRxqUTPTJoieHlnKVEXsfrhGhTsiSn3UlTaqr5UEB7UmBThOnpFJEya8CzCJZZrvr0cn63Q1xblIqKf/AK+ZhQhDK03XFYdzFZgL2VQ73p/u9d8Mg8XM7v8AmHxHp6RdhMMClJq+X1H94XLUcoPEeICh8/GHeCmBgBZw3R9/OAaNJsFI76W/CEEGtFsPrmYh7R+zaZRStCQUK7tQDkLuAXuDWptaCvZZQVMWobwRyy69SPoRspmGEyWpCrEeG7zhSVoZ8m2jsCWoHIAhehFn3EWA4iMnJ2fOWpSUS1KUksrgdxJpH0P2hlLw8wpWaEZkqAuNev1rAmyJpmFSwGTd8pGbiN/OOT5ZwTs0jg5bbMhIXPwq0qmJKSQQATdIuKGlfOLPaMzVzWKScqQ2V1CoBcFuPlG4xUsKoUPQ1OmvSEy5z0c3620+Zi4ZeW6MskFF0jEFBFwRzHzhvsnaD9xZpZzYgWflDn7SpOpq9NO6Wqekd2spVVy0GtTlH+4VrzjSUr8GQP8As0flHir5x0HfZsN/DHir5x7GfMKMr2hKE5ScgqEvQdLPFEwQLIxoSWCTl3EueYpBa8TKYFzyavlTzjooKZWCRrHsyZRgKRBE1JLORzjyYoCla74AoN2Zjly3ym4rryPMGJpxatAC5rvPOA0Sy4Ao5r+m/WD5M9CCGAffc890Swo3GyJcwITmYUHdIqPlFHtBMOQsDR23U1i/YuJTMRmSelup319IJxEntA1hvap/SPNk2p2zvg0uj53NUki5c/XzimSgA74eYrYbq+7NP5vg0FbP2CEspdTcBqU9Y7HngkT8Lcgr2fw4CDMysNL6a1hyZ7M5pSPJaAKCjwDtHEqlKAYEEOL6XDRxO5yN5SUVsrxuJMw5VIy5Sau53UO4s/hFKTYCseTcU9iAo7zB0qUG0Cr01/WO/FNJKNHnt2xZtGcUhhc+Q1aMwmY5caEeFQ/1whl7Q4pnA5fOFGDUK7uWh+RaOgCCR3hTX5Q0wk0soag9WOVv9phfMonNq/wgvDrZSmo/n3c6fQjqIAJgOlQ3W8RUeJ8YY4Fb5edfGAkg51OzEP0JDeggjAKYt1hAjf8AsOQUrpUBL+KvgB4RtpGhjBewR708fyA+CiPjG6wyqNAUZ32+fs0ZfeKihnZ0qSXD8wIwqMbMYhBS6UmwcEgUDvQUbm0fS/avBCZIUfxSyFjpfyePnWJnIQiatQGZI7r7z7rDe9zeOfJFcugc5LViKRtIy85UtX3jDUsA5Ngw0to8ESpuZq3qCBu4mEisRSoJIDB+QGY7y31up+1qAGU5WAtS2pjXiZWzUIkJVWuoL9HcdfOBcVOlSe6pbHcKqbcw+LCCPZqSubJWpajU9zhlBBLC4c2/ljL7T2eqSvIsVZ30ULZhzbxeIUbbTYaG/wC3pH8Nf+n5x0Z7PHsX8aAZzNjSv5h1f1geZsZg6FA/4gR6PDfBY2QpOVS8puCpwORekSMsN3VoUP5VA+loXIWzPzZGRkkXqS48jZosNEuQVDQgepFILxqWFW3jmI8R7o0DaWrpFWFgZnJa1G6vBOFnBRCUpDnRnckswiOMWhKMoSHPCo484DwU7LMQXbvAnxhlLZsp0rsQAk2S9N5vyDjzhxs3FmZLsAyUh7isIdrKaUtROjfXjDzYuzEYeXlBKlFsy1fiazByEpGg9Y5/+mMezSMqVEcGWcqbfyDQSmcFq4M4O8QNj+6GA94+F/7dIXbHQpIqSEuaaNSvr4Ry/Has2eemaGdMypBIc04Rj/aDahmqQqXQJcKBYu5oeVPMRXjNoqmHs0EhNfOp5DhFWHSC6dMvk4NeNI6MOHi7ZhLI5FcqfnGZmuTXQXqYJk4pQqh6X18YIlYF0NYs3jT5xRtecUpJJGZTB20H9j4x08CaQJtHALm95Fx+A+oJ46FusJ0EpYEEMaghiDryp6RYJ8yWxClJJqz/AAtpF07HGaGmB1j3VgMT/KoC4q4Nwd7w1YEZinDcYvRMACCGv5ghvKBQY9krGYPY05Pr0eKAYYdTkgb6cq/pBkk95J4F+Vvj6wBhKKZrEfTwWtXeHGn11HnAM33sGD2k3/tMeig0bLBzO6s7iwjL+xKQmVOnfmQnwZ/UxosGMsgfzGEUHziHD2UGPWPjvt1s9UmaUEd0FweBAy/GPrePmNKSReg+vCMt7e4Eq7ObTLkUlQIuQxHqYmWtkyVnyFRiM4hRFAGAFNW1PFqdI02G2RhiFKWVhg7A0bgweAtq7Pw4S8mYolj3Twrdunhxg+RN0RRofZ3KMOjIXAzX35lEinGPdr4JM+XkUWIPdVuU3pvEZ72X2oEKMs2VUcDT4DyjVMBU+6l1E73+mjFpxkxGJ/5ZxG5H9f6R0bL7Sd3lHsVzkFnzPs4twq8qnHmAR4GOVWJJlteNhk0ANBUiUvL3UO9tB5wPgUJfOsgJFK6nc2sabBzJE0ZUzO9usfBQqOUZznxChF+z3U6y3Aa9dBF9Ehkhhy+ngnGYRaDUU36QKkmFyvYhphdmKnSFJUtkqcAM7MbguGqLeMaiQ+UPdgC2/hCnYqkiWlIIJqSHrfdEcftgykTKEqJaWkByaVNNBR+ccsuU5UWtFn7ZRNUUoAISWJOpG4buOvqPtTEq7HMlOQ+4Q+hc0OprGJwSpiFDKVJLgH9QY1m35gcILhKJRmlte9latHYU5xt8aUkAokJypKvD68/CGWEkAAsKqAT4MT5gPzhbhcWFpUSMolhwHd70fmIZ7EkKUDMJqaABwNKA6CNlF2JIPSlSWF76aAcOfn0jNY+f2kyvug+QufL0jQY+ctAI1Yh+bd5+AbwMJZEgdxRH4VLPk3wjQpizaBdX1SKkCLAHKifrhETYb6+FG+MAj0xBN4sUqnMxGXeABlhiM3Fq8gzH64QYEZigcn61+MA4Mfe1tQ9D+hhthkNM5AekBSN17PqP2XsxcqSkcklXy8I021Jglyk7wwA3mM97A4c9n2qhcnL11hhtmbnnJRoip5mvo0AxgATh0ElyDXxMVbXldphl6lHfHS/k8GyU/cDiH+MVbKU7g2NITVqgPlONkKQvNLG5Tc+Gov5wBPwSsxKUnKSWtZ6Q1xeHKZ86SEqzSiUDVLfhO8P4VgZOODVUAoXBsd7Fu6Yw2tGLRmcRgJyD+7WG1AJHAuIfbH2opaWJcpPeSbc20f1eDhiZZYpWnkFCmrgP4xEKJOigfxD4i8KUm10DL/ti9/kI9ivJwjyMebJ2Y4JaKZs1+6LwJMxSjSw4RdhEUJjuNKLEymv/AGjlpFG3iPZlo7DSis05l4Qg0banpoFun+YBXnfziaduzCf3Uo8kl33nvV8oJwGClu6qtyJ6A/CvOGqZYLtZmDcr+JHhGb4rwMz/APzBPQH7OUkanIsD/fHuF9pJuYOmWU1JDEPxckkGNLhlmj3Iqfq1zAG0thoUDMljItiWFlBi5I0NzTjejTyjdNDBlbP+0TUzJUx3KcyV+8m24MpLC+kFe1UphMVqpMqUOilzFPwbL4wgwZImS1hxVuTn5RqvaSWVqQgagqI1LhIBH9JhvU0UlZlcOlkqDXHxIjWbOlJEsBgC17HxFYTJwRdIBF7KvVjUCoLiG0uYsOXCgCxHdS1BYu5L6H1jWx8WTmoN3d7A6AetN/jCxaQTLAt2YT0BBUIZKxKSauOLONzOOcLZsuqSDoRzIA+Rh2S0KsPWWom9+VR87wITqfCGGER3CkH8BHUB/UeULlpaGB4pVG4xbITFDWg7DJpzgEEYcFydwPkC0OcOklKlAXoOZDAPzI8RCiTrW4HmRDHZ2JWAEOcgV2hHEUSfr8ohFI+j7DxaUzUyEn7uWln3lCaq5XinDzs61zPzGnWEmyp+SUpT99bpHBJbMTzsOsMcHMYoTo4eGM2kykpuDQNs0M/OLJy3QAI8kABoAPnP/EiUqXjVKSSBNloJbVu7/wCHnGLxM5iE77/AR9R/4q4HNKlTwPcJQrkqo80/6o+bbY2OUS0TkuQpIK9cqi1eRfpE6syktgSVEVitCW92nL5xSjEaHxi4KBsYoQf+1p35h4D5R0AR5E8UBHFYXKWUkDjyiCQlIo8He0SvvQHdkjRgL6a8xCoqtAnaGWgg/JifSLtmzgFtRlUd2Y6ejV3wLLUasrKTR3ahoXbSKZYY/XOAdGswspAJEx2NOA6wYjBLQCqWc4OhvzG8wr2ftdFUzWSzDNob+8L+HlDfBYtKcyUgqS/dKau+j2aMJ2gR7h8SlRb3VD8JoeUQxmPyJKQe+aDgLP8AIQP7QY0ISDMlpzH3a96nLTfWAM5V3jUsAXqaesEYXspdgMtWVaGLOoP4ileo6xsdqvnSXDBCRWwuXLc7xl5OBM6ahKWDHMToAOHNvGNVisGorE0KLhISQkflerX6VipSipK2NOmAZVC2ZiAk1cEc/Lf6xDFTWIBVUbsxyjqb+cV4zFgFkX1IcA8Ws/GACo1rFeQlkfgKXOAAUt1Gzh6cC5r9XtFS57EEe6D46OPr9OlkWI7poeHLiIjN2YTQKD7uO/8AWBMXNvsqkoKZzJuCW4j3vMFoV4pPeLWenJ6Qe65UxJmJZiK6KHAjh8IntbChIKxUKJCTyYm3AjhGiYCqUHYGDkpYsYFlJfKNH10dg/lBk4gLWl8wdQCt/ebN1AhgTSpk13Q4wQZKZf4lFy/j6CFEv3TzHxg6TiFKnIWqgQ7MODV6PCGkaSSGYbg0HSiRWA5JBAIqDBsqcCwUH4ihgsbVGrwOJStAs7eYgkhmI4RlsNMMti9H8Y0GBnCZUG+kMA3bGzxicNMkn8aSx3KFUnxAj53Ok5ZYQsAD3FA10s3SNdt7buHlJKFzsq9EoLq5ECw5tGUxs10BVKrBs7gg7+tYyyeCJGQx/svNz/ch5anIJLZeBep4M8MtkezKEOZv3itBUJHxPM+EPJuLypKiKBn60ePU4mgUxZvq8ZOc2iGwX9jYf+CnxPzjoJ+2c/AR0Rc/YWYn2g99HI+sJfnHR0dUeiiMu4jj73j6R5HRQz3F+94xoPYy0zmmOjozyfoYeBf7Sf8AUHkmDMLf+r0Mex0NdIY19lvemck/+UaFcdHRxZ/1gZPHe+qB0x0dHYuiCafdHX1EXyv3n+VP+xMdHRIIYY//AKVf1vhJtT/ppX+NX+2PY6Lx9FgOzffR/jT6pj2Zfx/3R0dFgE4a3j6QdhLx0dCZpE1uA/dR4I6OicZpmG6/3I5iBZP7uZy+EdHRoc586xFo1uJ/dyP8R9DHR0ZZDNEp3uzP+2YrwX/ydI8joz8AyyOjo6IA/9k=' alt="user avatar" />
                                                        <ContentMaker
                                                            inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                            onFilesChange={this.onCommentOfTaskCommentFilesChange}
                                                            onFilesError={this.onFilesError}
                                                            files={newCommentOfTaskComment.files}
                                                            text={newCommentOfTaskComment.description}
                                                            placeholder={translate("task.task_perform.enter_comment")}
                                                            submitButtonText={translate("task.task_perform.create_comment")}
                                                            onTextChange={(e) => {
                                                                let value = e.target.value;
                                                                this.setState(state => {
                                                                    return { ...state, newCommentOfTaskComment: { ...state.newCommentOfTaskComment, description: value } }
                                                                })
                                                            }}
                                                            onSubmit={(e) => { this.submitCommentOfTaskComment(item._id, task._id) }}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    )
                                }) : null
                            }
                            {/* Thêm bình luận cho công việc*/}
                            <ApiImage className="user-img-level1" src='data:image/jpeg;base64,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' alt="User Image" />
                            <ContentMaker
                                inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                onFilesChange={this.onTaskCommentFilesChange}
                                onFilesError={this.onFilesError}
                                files={newTaskComment.files}
                                text={newTaskComment.description}
                                placeholder={translate("task.task_perform.enter_comment")}
                                submitButtonText={translate("task.task_perform.create_comment")}
                                onTextChange={(e) => {
                                    let value = e.target.value;
                                    this.setState(state => {
                                        return { ...state, newTaskComment: { ...state.newTaskComment, description: value } }
                                    })

                                }}
                                onSubmit={(e) => { this.submitTaskComment(task._id) }}
                            />
                        </div>


                        {/* Chuyển qua tab tài liệu */}
                        <div className={selected === "documentTask" ? "active tab-pane" : "tab-pane"} id="documentTask">
                            <div>
                                {documents &&
                                    documents.map((item, index) => {
                                        return (
                                            <React.Fragment>
                                                {showEditTaskFile !== item._id &&
                                                    <div className="item-box" key={index}>
                                                        {(currentUser === item.creator?._id) &&
                                                            <div className="btn-group pull-right">
                                                                <span data-toggle="dropdown">
                                                                    <i className="fa fa-ellipsis-h"></i>
                                                                </span>
                                                                <ul className="dropdown-menu">
                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditFileTask(item._id)} >{translate("task.task_perform.edit")}</a></li>
                                                                    <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteDocument(item._id, task._id)} >{translate("task.task_perform.delete")}</a></li>
                                                                </ul>
                                                            </div>}
                                                        <div>
                                                            <ul className='list-inline list-name-document'>
                                                                <li><strong>{item.creator?.name} </strong></li>
                                                                <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                            </ul>
                                                            {item.description}
                                                        </div>
                                                        <div>
                                                            {showFile.some(obj => obj === item._id) ? 
                                                                <a style={{cursor: 'pointer'}} onClick={() => { this.handleShowFile(item._id) }}>Ẩn bớt<i className='fa fa-angle-double-up'></i></a> 
                                                                :
                                                                <a style={{cursor: 'pointer'}} onClick={() => { this.handleShowFile(item._id) }}>Hiển thị {item?.files?.length} tài liệu &nbsp; <i className='fa fa-angle-double-down'></i> </a>
                                                            }
                                                        </div>
                                                        {showFile.some(obj => obj === item._id) &&
                                                            <React.Fragment>
                                                                <div>
                                                                    {item.files.map((elem, index) => {
                                                                        return (
                                                                            <div key={index} className="show-files-task">
                                                                                {this.isImage(elem.name) ?
                                                                                    <ApiImage
                                                                                        className="attachment-img files-attach"
                                                                                        style={{ marginTop: "5px" }}
                                                                                        src={elem.url}
                                                                                        file={elem}
                                                                                        requestDownloadFile={this.requestDownloadFile}
                                                                                    />
                                                                                    :
                                                                                    <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
                                                                                }

                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </React.Fragment>
                                                        }
                                                    </div>
                                                }
                                                {showEditTaskFile === item._id &&
                                                    <React.Fragment>
                                                        <div style={{ marginTop: '15px' }}>
                                                            <ApiImage className="user-img-level1" src='https://i.pinimg.com/originals/c2/a2/b7/c2a2b72d1e852146b3d539115c85f0fe.jpg' alt="user avatar" />
                                                            <ContentMaker
                                                                inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                                // styletext={{ marginTop: "15px" }}
                                                                onFilesChange={this.onEditFileTask}
                                                                onFilesError={this.onFilesError}
                                                                files={fileTaskEdited.files}
                                                                defaultValue={item.description}
                                                                submitButtonText={translate("task.task_perform.save_edit")}
                                                                cancelButtonText={translate("task.task_perform.cancel")}
                                                                handleEdit={(e) => this.handleEditFileTask(e)}
                                                                onTextChange={(e) => {
                                                                    let value = e.target.value;
                                                                    this.setState(state => {
                                                                        return { ...state, fileTaskEdited: { ...state.fileTaskEdited, description: value } }
                                                                    })
                                                                }}
                                                                onSubmit={(e) => { this.handleSaveEditTaskFile(e, item.description, item._id, task._id) }}
                                                            />
                                                            {item.files.length > 0 &&
                                                                <div className="tool-level1" style={{ marginTop: -15 }}>
                                                                    {item.files.map(file => {
                                                                        return <div>
                                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "task") }}><i className="fa fa-times"></i></a>
                                                                        </div>
                                                                    })}
                                                                </div>}
                                                        </div>
                                                    </React.Fragment>
                                                }
                                            </React.Fragment>
                                        )
                                    })
                                }
                            </div>
                            <React.Fragment>
                                <div style={{ marginTop: '15px' }}>
                                    <ApiImage className="user-img-level1" src='https://i.pinimg.com/originals/c2/a2/b7/c2a2b72d1e852146b3d539115c85f0fe.jpg' alt="user avatar" />
                                    <ContentMaker
                                        inputCssClass="text-input-level1" controlCssClass="tool-level1"
                                        onFilesChange={this.onTaskFilesChange}
                                        onFilesError={this.onFilesError}
                                        files={taskFiles.files}
                                        text={taskFiles.description}
                                        placeholder={translate("task.task_perform.enter_description")}
                                        submitButtonText={translate("task.task_perform.create_document")}
                                        onTextChange={(e) => {
                                            let value = e.target.value;
                                            this.setState(state => {
                                                return { ...state, taskFiles: { ...state.taskFiles, description: value } }

                                            })
                                        }}
                                        disableSubmit={true}
                                        onSubmit={(e) => { this.handleUploadFile(task._id, currentUser) }}
                                    />
                                </div>
                            </React.Fragment>
                        </div>

                        {/* Chuyển qua tab công việc con */}
                        <div className={selected === "subTask" ? "active tab-pane" : "tab-pane"} id="subTask">
                            <SubTaskTab
                                id={this.state.id}
                            />
                        </div>

                        {/* Chuyển qua tab Bấm giờ */}
                        <div className={selected === "logTimer" ? "active tab-pane" : "tab-pane"} id="logTimer">
                            {logTimer && logTimer.map(item =>
                                <div key={item._id} className="item-box">
                                    <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.creator?.name} </a>
                                    {translate("task.task_perform.total_time")} {moment.utc(item.duration, "x").format('HH:mm:ss')}&nbsp;
                                    ({moment(item.startedAt, "x").format("HH:mm:ss DD/MM/YYYY")} - {moment(item.stoppedAt).format("HH:mm:ss DD/MM/YYYY")})
                                    <div>{item.description ? item.description : translate("task.task_perform.none_description")}</div>
                                </div>
                            )}
                        </div>

                        {/* Chuyển qua tab Nhật ký lịch sử */}
                        <div className={selected === "historyLog" ? "active tab-pane" : "tab-pane"} id="historyLog">
                            {logs && logs.map(item =>
                                <div key={item._id} className="item-box">
                                    <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.creator?.name} </a>
                                    {item.title ? item.title : translate("task.task_perform.none_description")}&nbsp;
                                    ({moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY")})
                                    <div>
                                        {item.description ? item.description : translate("task.task_perform.none_description")}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chuyển qua tab quy trình */}

                        <div className={selected === "process" ? "active tab-pane" : "tab-pane"} id="process">
                            {(task && task.process) &&
                                <div>
                                    {task &&
                                        <ViewProcess
                                            isTabPane={true}
                                            data={task && task.process}
                                            idProcess={task && task.process._id}
                                            xmlDiagram={task && task.process.xmlDiagram}
                                            processName={task && task.process.processName}
                                            processDescription={task && task.process.processDescription}
                                            infoTask={task && task.process.tasks}
                                            creator={task && task.process.creator}
                                        />
                                    }

                                </div>
                            }
                        </div>


                        {/* Dữ liệu vào */}
                        <div className={selected === "incoming-data" ? "active tab-pane" : "tab-pane"} id="incoming-data">
                            {
                                (task && task.process) &&
                                <React.Fragment>
                                    <IncomingDataTab
                                        preceedingTasks={task.preceedingTasks}
                                    />

                                </React.Fragment>
                            }
                        </div>

                        {/** Dữ liệu ra */}
                        <div className={selected === "outgoing-data" ? "active tab-pane" : "tab-pane"} id="outgoing-data">
                            {
                                (task && task.process) &&
                                <OutgoingDataTab
                                    isOutgoingData={task && task.followingTasks && task.followingTasks.length !== 0}
                                    taskId={task._id}
                                    task={task}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { tasks, performtasks, user, auth } = state;
    return { tasks, performtasks, user, auth };
}

const actionCreators = {
    getTaskById: performTaskAction.getTaskById,
    createActionComment: performTaskAction.createActionComment,
    editActionComment: performTaskAction.editActionComment,
    deleteActionComment: performTaskAction.deleteActionComment,
    createTaskAction: performTaskAction.createTaskAction,
    editTaskAction: performTaskAction.editTaskAction,
    deleteTaskAction: performTaskAction.deleteTaskAction,
    startTimer: performTaskAction.startTimerTask,
    stopTimer: performTaskAction.stopTimerTask,
    getTimesheetLogs: performTaskAction.getTimesheetLogs,
    getStatusTimer: performTaskAction.getTimerStatusTask,
    editTaskComment: performTaskAction.editTaskComment,
    deleteTaskComment: performTaskAction.deleteTaskComment,
    createTaskComment: performTaskAction.createTaskComment,
    createCommentOfTaskComment: performTaskAction.createCommentOfTaskComment,
    editCommentOfTaskComment: performTaskAction.editCommentOfTaskComment,
    deleteCommentOfTaskComment: performTaskAction.deleteCommentOfTaskComment,
    evaluationAction: performTaskAction.evaluationAction,
    confirmAction: performTaskAction.confirmAction,
    downloadFile: AuthActions.downloadFile,
    getSubTask: taskManagementActions.getSubTask,
    uploadFile: performTaskAction.uploadFile,
    deleteFileAction: performTaskAction.deleteFileAction,
    deleteFileCommentOfAction: performTaskAction.deleteFileCommentOfAction,
    deleteFileTaskComment: performTaskAction.deleteFileTaskComment,
    deleteFileChildTaskComment: performTaskAction.deleteFileChildTaskComment,
    getTaskLog: performTaskAction.getTaskLog,
    deleteFileTask: performTaskAction.deleteFileTask,
    deleteDocument: performTaskAction.deleteDocument,
    editDocument: performTaskAction.editDocument
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }

