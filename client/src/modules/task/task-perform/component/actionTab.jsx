import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import Rating from 'react-rating'
import moment from 'moment'

import { ContentMaker, DialogModal } from '../../../../common-components'

import { getStorage } from '../../../../config';
import { LOCAL_SERVER_API } from '../../../../env';

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from "../../task-management/redux/actions";
import { SubTaskTab } from './subTaskTab';
import { AuthActions } from '../../../auth/redux/actions'

import Files from 'react-files'

import './actionTab.css';


class ActionTab extends Component {
    constructor(props) {
        let idUser = getStorage("userId");
        super(props);
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
            value: '',
            rows: 3,
            minRows: 3,
            maxRows: 25,
            showFile: [],
            descriptionFile: "",
            showModalDelete: '',
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

        return true;
    }
    showEdit(event) {
        event.preventDefault();
        this.setState({ showEdit: true }, () => {
            document.addEventListener('click', this.closeEdit);
        });
    }
    closeEdit(event) {
        if (!this.dropdownEdit.contains(event.target)) {
            this.setState({ showEdit: false }, () => {
                document.removeEventListener('click', this.closeEdit);
            });

        }
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
    setValueRating = async (actionId,taskId, newValue, firstTime) => {
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
        this.props.evaluationAction(actionId,taskId, evaluations)
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
        if (taskFiles.files) {
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
        console.log(description)
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

        await this.setState(state => {
            return {
                ...state,
                showModalDelete: actionId,
                deleteFile: {
                    fileId: fileId,
                    actionId: actionId,
                    fileName: fileName,
                    type: type
                }
            }
        });
        window.$(`#modal-confirm-deletefile`).modal('show');
    }
    save = (taskId) => {
        const { deleteFile } = this.state
        if (deleteFile.type === "action") {
            this.props.deleteFileAction(deleteFile.fileId, deleteFile.actionId, taskId, 2);
        } else if (deleteFile.type === "commentofaction") {
            this.props.deleteFileCommentOfAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "taskcomment") {
            this.props.deleteFileTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "commentoftaskcomment") {
            this.props.deleteFileChildTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
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
    render() {
        const { role } = this.props;
        let type = ["actions", "commentofactions", "taskcomments", "commentoftaskcomments"];
        let task, informations;
        let statusTask, files;
        let actionComments, taskActions, taskComments, actions, logTimer, logs;
        const { tasks, performtasks, user, auth, translate } = this.props;
        const subtasks = tasks.subtasks;
        const {
            showEvaluations, selected, comment, editComment, showChildComment, editAction, action,
            editTaskComment, showChildTaskComment,
            editCommentOfTaskComment, valueRating, currentUser, hover, showModalDelete,
            showFile, deleteFile, taskFiles, newActionEdited, newCommentOfActionEdited, newAction,
            newCommentOfAction, newTaskCommentEdited, newCommentOfTaskComment, newTaskComment, newCommentOfTaskCommentEdited
        } = this.state;
        const checkUserId = obj => obj.creator._id === currentUser;

        if (typeof performtasks.task !== 'undefined' && performtasks.task !== null) {
            task = performtasks.task;
            taskComments = task.taskComments;
            taskActions = task.taskActions;
            files = task.files
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
                        <li><a href="#documentTask" onClick={() => this.handleChangeContent("documentTask")} data-toggle="tab">{translate("task.task_perform.documents")} ({files && files.length})</a></li>
                        <li><a href="#logTimer" onClick={() => this.handleChangeContent("logTimer")} data-toggle="tab">{translate("task.task_perform.timesheetlogs")} ({logTimer && logTimer.length})</a></li>
                        <li><a href="#subTask" onClick={() => this.handleChangeContent("subTask")} data-toggle="tab">{translate("task.task_perform.subtasks")} ({subtasks && subtasks.length})</a></li>
                        <li><a href="#historyLog" onClick={() => this.handleChangeContent("historyLog")} data-toggle="tab">{translate("task.task_perform.change_history")} ({logs && logs.length})</a></li>
                    </ul>
                    <div className="tab-content">
                        <div className={selected === "taskAction" ? "active tab-pane" : "tab-pane"} id="taskAction">
                            {typeof taskActions !== 'undefined' && taskActions.length !== 0 ?
                                // Hiển thị hoạt động của công việc
                                taskActions.map(item => {
                                    // if (item.parent === null)
                                    return (
                                        <div className="clearfix" key={item._id}>
                                            {item.creator ?
                                                <img className="user-img-level1" src={(LOCAL_SERVER_API + item.creator.avatar)} alt="User Image" /> :
                                                <div className="user-img-level1" />
                                            }
                                            {editAction !== item._id && // khi chỉnh sửa thì ẩn action hiện tại đi
                                                <React.Fragment>
                                                    <div className="content-level1" data-width="100%">
                                                        {item.creator ?
                                                            <a style={{ cursor: "pointer" }}>{item.creator.name} </a> :
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
                                                        <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>
                                                        <li>{item.mandatory && !item.creator && <b className="text-sm">{translate("task.task_perform.mandatory_action")}</b>}</li>
                                                        {((item.creator === undefined || item.creator === null) && role === "responsible") &&
                                                            <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={(e) => this.handleConfirmAction(e, item._id, currentUser, task._id)}><i className="fa fa-check-circle" aria-hidden="true"></i> {translate("task.task_perform.confirm_action")}</a></li>}

                                                        {/* Các chức năng tương tác với action */}
                                                        {item.creator &&
                                                            <React.Fragment>
                                                                <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => { this.handleShowEvaluations(item._id) }}><i className="fa fa-thumbs-o-up margin-r-5"></i>{translate("task.task_perform.evaluation")} ({item.evaluations && item.evaluations.length})</a></li>
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
                                                                                        this.setValueRating(item._id,task._id, value, 1);
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
                                                            <React.Fragment>
                                                                <div style={{ marginBottom: 10 }}>
                                                                    <ul className="list-inline">
                                                                        <li style={{ marginLeft: '0px' }}>
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
                                                                                            this.setValueRating(item._id,task._id, value, 0);
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
                                                            </React.Fragment>
                                                        }
                                                        {/* Các file đính kèm của action */}
                                                        {showFile.some(obj => obj === item._id) &&
                                                            <div>
                                                                {item.files.map(elem => {
                                                                    return <div><a style={{ cursor: "pointer" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a></div>
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
                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2"
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
                                                            <ul style={{ marginTop: '-40px', marginLeft: '50px', listStyle: 'none' }}>
                                                                {item.files.map(file => {
                                                                    return <li>
                                                                        <a style={{ cursor: "pointer" }} className="link-black text-sm">{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "action") }}><i className="fa fa-times"></i></a>
                                                                    </li>
                                                                })}
                                                            </ul>}
                                                        {showModalDelete === item._id &&
                                                            <DialogModal
                                                                marginTop = {"20vh"}
                                                                size={50}
                                                                maxWidth={100}
                                                                modalID={`modal-confirm-deletefile`}
                                                                formID={`from-confirm-deletefile`}
                                                                isLoading={false}
                                                                func={() => this.save(task._id)}
                                                            >
                                                                {translate("task.task_perform.question_delete_file")} {deleteFile.fileName} ?
                                                            </DialogModal>
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            }

                                            {/* Hiển thị bình luận cho hoạt động */}
                                            {showChildComment === item._id &&
                                                <div>
                                                    {item.comments.map(child => {
                                                        return <div key={child._id}>
                                                            <img className="user-img-level2" src={(LOCAL_SERVER_API + child.creator.avatar)} alt="User Image" />

                                                            {editComment !== child._id && // Khi đang edit thì nội dung cũ đi
                                                                <div>
                                                                    <div className="content-level2">
                                                                        <a style={{ cursor: "pointer" }}>{child.creator.name} </a>
                                                                        {child.description.split('\n').map((item, idx) => {
                                                                            return (
                                                                                <span key={idx}>
                                                                                    {item}
                                                                                    <br />
                                                                                </span>
                                                                            );
                                                                        })}

                                                                        {child.creator._id === currentUser &&
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
                                                                        <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                                        <li style={{ display: "inline-table" }}>
                                                                            <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({child.files && child.files.length})</i></b></a></div></li>
                                                                        {showFile.some(obj => obj === child._id) &&
                                                                            <li style={{ display: "inline-table" }}>
                                                                                {child.files.map(elem => {
                                                                                    return <div><a style={{ cursor: "pointer" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a></div>
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
                                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2"
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
                                                                            <ul style={{ marginTop: '-40px', marginLeft: '50px', listStyle: 'none' }}>
                                                                                {child.files.map(file => {
                                                                                    return <li>
                                                                                        <a style={{ cursor: "pointer" }} className="link-black text-sm">{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "commentofaction") }}><i className="fa fa-times"></i></a>
                                                                                    </li>
                                                                                })}
                                                                            </ul>}
                                                                        {/* modal confirm delete file */}
                                                                        {showModalDelete === item._id &&
                                                                            <DialogModal
                                                                                marginTop = {"20vh"}
                                                                                size={50}
                                                                                maxWidth={100}
                                                                                modalID={`modal-confirm-deletefile`}
                                                                                formID={`from-confirm-deletefile`}
                                                                                isLoading={false}
                                                                                func={() => this.save(task._id)}
                                                                            >
                                                                                {translate("task.task_perform.question_delete_file")} {deleteFile.fileName}?
                                                                    </DialogModal>
                                                                        }
                                                                    </div>
                                                                </React.Fragment>
                                                            }
                                                        </div>;
                                                        return true;
                                                    })
                                                    }
                                                    {/*Thêm bình luận cho hoạt động */}
                                                    <div>
                                                        <img className="user-img-level2"
                                                            src={(LOCAL_SERVER_API + auth.user.avatar)} alt="user avatar"
                                                        />
                                                        <ContentMaker
                                                            inputCssClass="text-input-level2" controlCssClass="tool-level2"
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
                                    <img className="user-img-level1" src={(LOCAL_SERVER_API + auth.user.avatar)} alt="user avatar" />
                                    <ContentMaker
                                        inputCssClass="text-input-level1" controlCssClass="tool-level1"
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
                                        <div className="clearfix" key={key}>
                                            <img className="user-img-level1" src={(LOCAL_SERVER_API + item.creator.avatar)} alt="User Image" />

                                            {editTaskComment !== item._id && // Khi đang edit thì ẩn đi
                                                <React.Fragment>
                                                    <div className="content-level1">
                                                        <a style={{ cursor: "pointer" }}>{item.creator.name} </a>
                                                        {item.description.split('\n').map((item, idx) => {
                                                            return (
                                                                <span key={idx}>
                                                                    {item}
                                                                    <br />
                                                                </span>
                                                            );
                                                        })}
                                                        {item.creator._id === currentUser &&
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
                                                        <li><span className="text-sm">{moment(item.createdAt).fromNow()}</span></li>

                                                        <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowChildTaskComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate("task.task_perform.comment")} ({item.comments.length}) &nbsp;</a></li>
                                                        {item.files.length > 0 &&
                                                            <React.Fragment>
                                                                <li style={{ display: "inline-table" }}>
                                                                    <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(item._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({item.files && item.files.length})</i></b></a> </div></li>
                                                                {showFile.some(obj => obj === item._id) &&
                                                                    <li style={{ display: "inline-table" }}>{item.files.map(elem => {
                                                                        return <div><a style={{ cursor: "pointer" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a></div>
                                                                    })}</li>
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
                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2"
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
                                                            <ul style={{ marginTop: '-40px', marginLeft: '50px', listStyle: 'none' }}>
                                                                {item.files.map(file => {
                                                                    return <li>
                                                                        <a style={{ cursor: "pointer" }} className="link-black text-sm">{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "taskcomment") }}><i className="fa fa-times"></i></a>
                                                                    </li>
                                                                })}
                                                            </ul>}
                                                        {/* modal confirm delete file */}
                                                        {showModalDelete === item._id &&
                                                            <DialogModal
                                                                marginTop = {"20vh"}
                                                                size={50}
                                                                maxWidth={100}
                                                                modalID={`modal-confirm-deletefile`}
                                                                formID={`from-confirm-deletefile`}
                                                                isLoading={false}
                                                                func={() => this.save(task._id)}
                                                            >
                                                                {translate("task.task_perform.question_delete_file")} {deleteFile.fileName}?
                                                    </DialogModal>
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            }

                                            {/* Hiển thị bình luận cho bình luận */}
                                            {showChildTaskComment === item._id &&
                                                <div className="comment-content-child">
                                                    {item.comments.map(child => {
                                                        return <div key={child._id}>
                                                            <img className="user-img-level2" src={(LOCAL_SERVER_API + item.creator.avatar)} alt="User Image" />

                                                            {editCommentOfTaskComment !== child._id && // Đang edit thì ẩn đi
                                                                <div>
                                                                    <div className="content-level2">
                                                                        <a style={{ cursor: "pointer" }}>{child.creator.name} </a>
                                                                        {child.description.split('\n').map((item, idx) => {
                                                                            return (
                                                                                <span key={idx}>
                                                                                    {item}
                                                                                    <br />
                                                                                </span>
                                                                            );
                                                                        })}

                                                                        {child.creator._id === currentUser &&
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
                                                                        <li><span className="text-sm">{moment(child.createdAt).fromNow()}</span></li>
                                                                        {child.files.length > 0 &&
                                                                            <React.Fragment>
                                                                                <li style={{ display: "inline-table" }}>
                                                                                    <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({child.files && child.files.length})</i></b></a></div></li>
                                                                                {showFile.some(obj => obj === child._id) &&
                                                                                    <li style={{ display: "inline-table" }}>
                                                                                        {child.files.map(elem => {
                                                                                            return <div><a style={{ cursor: "pointer" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a></div>
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
                                                                            inputCssClass="text-input-level1" controlCssClass="tool-level2"
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
                                                                            onSubmit={(e) => { this.handleSaveEditCommentOfTaskComment(e, child._id, task._id,child.description)}}
                                                                        />
                                                                        {/* Hiện file đã tải lên */}
                                                                        {child.files.length > 0 &&
                                                                            <ul style={{ marginTop: '-40px', marginLeft: '50px', listStyle: 'none' }}>
                                                                                {child.files.map(file => {
                                                                                    return <li>
                                                                                        <a style={{ cursor: "pointer" }} className="link-black text-sm">{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { this.handleDeleteFile(file._id, file.name, item._id, "commentoftaskcomment") }}><i className="fa fa-times"></i></a>
                                                                                    </li>
                                                                                })}
                                                                            </ul>}
                                                                        {/* modal confirm delete file */}
                                                                        {showModalDelete === item._id &&
                                                                            <DialogModal
                                                                                marginTop = {"20vh"}
                                                                                size={50}
                                                                                maxWidth={100}
                                                                                modalID={`modal-confirm-deletefile`}
                                                                                formID={`from-confirm-deletefile`}
                                                                                isLoading={false}
                                                                                func={() => this.save(task._id)}
                                                                            >
                                                                                {translate("task.task_perform.question_delete_file")} {deleteFile.fileName}?
                                                                    </DialogModal>
                                                                        }
                                                                    </div>
                                                                </React.Fragment>
                                                            }
                                                        </div>;
                                                        return true;
                                                    })
                                                    }
                                                    {/*Thêm bình luận cho bình luận */}
                                                    <div>
                                                        <img className="user-img-level2" src={(LOCAL_SERVER_API + auth.user.avatar)} alt="user avatar" />
                                                        <ContentMaker
                                                            inputCssClass="text-input-level2" controlCssClass="tool-level2"
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
                            <img className="user-img-level1" src={(LOCAL_SERVER_API + auth.user.avatar)} alt="User Image" />
                            <ContentMaker
                                inputCssClass="text-input-level1" controlCssClass="tool-level1"
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
                                {files &&
                                    files.map((item, index) => {
                                        return (
                                            <div style={{ marginBottom: 20 }} key={index}>
                                                <div><strong>{item.creator.name} - </strong>{item.description}</div>
                                                <a style={{ cursor: "pointer" }} onClick={(e) => this.requestDownloadFile(e, item.url, item.name)} >{item.name}</a>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <React.Fragment>
                                <img className="user-img-level1" src={(LOCAL_SERVER_API + auth.user.avatar)} alt="user avatar" />
                                <ContentMaker
                                    inputCssClass="text-input-level1" controlCssClass="tool-level1"
                                    onFilesChange={this.onTaskFilesChange}
                                    onFilesError={this.onFilesError}
                                    files={taskFiles.files}
                                    text={taskFiles.description}
                                    placeholder={translate("task.task_perform.enter_description")}
                                    submitButtonText={translate("task.task_perform.create_description")}
                                    onTextChange={(e) => {
                                        let value = e.target.value;
                                        this.setState(state => {
                                            return { ...state, taskFiles: { ...state.taskFiles, description: value } }

                                        })
                                    }}
                                    onSubmit={(e) => { this.handleUploadFile(task._id, currentUser) }}
                                />
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
                                <div key={item._id} style={{ marginBottom: 20 }}>
                                    <a style={{ fontWeight: 700 }} style={{ cursor: "pointer" }}>{item.creator.name} - </a>
                                    {translate("task.task_perform.total_time")} {moment.utc(item.duration, "x").format('HH:mm:ss')} - &nbsp;
                                    {item.description ? item.description : translate("task.task_perform.none_description")}
                                    <div>{moment(item.startedAt, "x").format("HH:mm:ss DD/MM/YYYY")} - {moment(item.stoppedAt).format("HH:mm:ss DD/MM/YYYY")} </div>
                                </div>
                            )}
                        </div>

                        {/* Chuyển qua tab Nhật ký lịch sử */}
                        <div className={selected === "historyLog" ? "active tab-pane" : "tab-pane"} id="historyLog">
                            {logs && logs.map(item =>
                                <div key={item._id} style={{ marginBottom: 20 }}>
                                    <a style={{ fontWeight: 700 }} style={{ cursor: "pointer" }}>{item.creator.name} - </a>
                                    {translate("task.task_perform.time")} {moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY")} - {item.title ? item.title : translate("task.task_perform.none_description")}
                                    <div>
                                        {item.description ? item.description : translate("task.task_perform.none_description")}
                                    </div>
                                </div>
                            )}
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
    getTaskById: taskManagementActions.getTaskById,
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
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }

