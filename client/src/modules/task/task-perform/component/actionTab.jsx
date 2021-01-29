import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2'
import Rating from 'react-rating';
import moment from 'moment';
import 'moment/locale/vi';
import './actionTab.css';

import { ContentMaker, DateTimeConverter, ApiImage, ShowMoreShowLess, SelectBox, DatePicker, TimePicker, ErrorLabel } from '../../../../common-components';

import { getStorage } from '../../../../config';

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from "../../task-management/redux/actions";
import { AuthActions } from '../../../auth/redux/actions';

import { SubTaskTab } from './subTaskTab';
import { ViewProcess } from '../../task-process/component/task-process-management/viewProcess';
import { IncomingDataTab } from './incomingDataTab';
import { OutgoingDataTab } from './outgoingDataTab';
import parse from 'html-react-parser';
import TextareaAutosize from 'react-textarea-autosize';
import ValidationHelper from '../../../../helpers/validationHelper';
import { formatDate } from '../../../../helpers/formatDate';

class ActionTab extends Component {
    constructor(props) {
        let idUser = getStorage("userId");
        super(props);
        let lang = getStorage("lang")
        moment.locale(lang)
        this.state = {
            filterLogAutoStopped: 'all',
            taskActions: [],
            currentUser: idUser,
            selected: "taskAction",
            comment: false,
            action: false,
            editComment: "",
            valueRating: 2.5,
            showSort: false,
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
            showChildComment: [],
            showEvaluations: [],
            newAction: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newActionEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newCommentOfAction: {
                // creator: idUser,
                // description: "",
                // files: [],
                // taskActionId: null,
                descriptionDefault: ""
            },
            newCommentOfActionEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newTaskComment: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newTaskCommentEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newCommentOfTaskComment: {
            },
            newCommentOfTaskCommentEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
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
            deleteFile: '',

            addLogTimeDate: this.formatDate(Date.now()),
            showBoxAddLogTimer: false,
            checkDateAddLog: false,
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
    componentDidMount = () => {
        const { id } = this.props;

        this.props.getAllPreceedingTasks(id);
    }

    static getDerivedStateFromProps(props, prevState) {
        const { performtasks, notifications } = props;
        let state = {};
        if (notifications && notifications.associatedData && performtasks && performtasks.task && notifications.associatedData.value && notifications.associatedData.value.length > 0) {
            let { taskComments } = performtasks.task;
            let { taskActions } = performtasks.task;
            // Trường hợp thêm mới bình luận (tab trao doi)
            if (notifications.associatedData.dataType === "createTaskComment") {
                const res = [...taskComments, notifications.associatedData.value[0]];
                props.refreshDataAfterComment(res);
            }
            // trường hợp thêm comment cho comment (tab trao doi)
            if (notifications.associatedData.dataType === "createTaskSubComment") {
                // add thêm sub comment mới 
                const res = taskComments.map(obj => notifications.associatedData.value.find(o => o._id === obj._id) || obj);
                props.refreshDataAfterComment(res);
            }
            // Trường hợp thêm mới hoạt động
            if (notifications.associatedData.dataType === "createTaskAction") {
                const res = [...taskActions, notifications.associatedData.value[0]];
                console.log("noti", notifications.associatedData.value[0])
                props.refreshDataAfterCreateAction(res)
            }

            // Thêm bình luạn cho hoạt động
            if (notifications.associatedData.dataType === "createCommentOfTaskactions") {
                const res = taskActions.map(obj => notifications.associatedData.value.find(o => o._id === obj._id) || obj)
                props.refreshDataAfterCreateAction(res);
            }
            notifications.associatedData = {}; // reset lại ... 
        }

        if (performtasks.task) {
            return {
                ...prevState,
                taskActions: performtasks.task.taskActions
            }
        }
        else {
            return null;
        }
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.id !== this.state.id) {
            this.setState(state => {
                return {
                    ...state,
                    id: nextProps.id,
                    showBoxAddLogTimer: false,
                    checkDateAddLog: false,
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
    setValueRating = async (actionId, taskId, role, newValue, firstTime) => {
        await this.setState(state => {
            return {
                ...state,
                valueRating: newValue,
                evaluations: {
                    ...state.evaluations,
                    rating: newValue * 2,
                    firstTime: firstTime,
                    type: "evaluation",
                    role: role,
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
        let a;
        if (this.state.showChildComment.some(obj => obj === id)) {
            a = this.state.showChildComment.filter(x => x !== id);
            this.setState(state => {
                return {
                    ...state,
                    showChildComment: a
                }
            })
        } else {
            this.setState(state => {
                return {
                    ...state,
                    showChildComment: [...this.state.showChildComment, id]
                }
            })
        }
    }
    handleEditCommentOfTaskComment = async (childComment) => {
        await this.setState(state => {
            return {
                ...state,
                editCommentOfTaskComment: childComment._id,
                newCommentOfTaskCommentEdited: {
                    ...state.newCommentOfTaskCommentEdited,
                    descriptionDefault: childComment.description
                }
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

        if (actionId) {
            data.append("creator", newCommentOfAction[`${actionId}`].creator);
            data.append("description", newCommentOfAction[`${actionId}`].description);
            newCommentOfAction[`${actionId}`].files && newCommentOfAction[`${actionId}`].files.forEach(x => {
                data.append("files", x);
            })
            if (newCommentOfAction[`${actionId}`].description && newCommentOfAction[`${actionId}`].creator) {
                this.props.createActionComment(taskId, actionId, data);
            }
            this.setState(state => {
                state.newCommentOfAction[`${actionId}`] = {
                    description: "",
                    files: [],
                    descriptionDefault: ''
                }
                return {
                    ...state,
                }
            })
        }
    }

    //Thêm mới hoạt động
    submitAction = async (taskId, index) => {
        let { newAction } = this.state;

        console.log(newAction.descriptionDefault, newAction.description)
        const data = new FormData();

        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        data.append("index", index)
        newAction.files && newAction.files.forEach(x => {
            data.append("files", x);
        })

        if (newAction.creator && newAction.description) {
            this.props.createTaskAction(taskId, data);
        }
        // Reset state cho việc thêm mới action
        this.setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    description: "",
                    files: [],
                    descriptionDefault: ''
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
                    descriptionDefault: ''
                },
            }
        })
    }
    submitCommentOfTaskComment = async (commentId, taskId) => {
        let { newCommentOfTaskComment } = this.state;
        const data = new FormData();

        data.append("creator", newCommentOfTaskComment[`${commentId}`].creator);
        data.append("description", newCommentOfTaskComment[`${commentId}`].description);
        newCommentOfTaskComment[`${commentId}`].files && newCommentOfTaskComment[`${commentId}`].files.forEach(x => {
            data.append("files", x);
        })
        if (newCommentOfTaskComment[`${commentId}`].description && newCommentOfTaskComment[`${commentId}`].creator) {
            this.props.createCommentOfTaskComment(commentId, taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        this.setState(state => {
            state.newCommentOfTaskComment[`${commentId}`] = {
                description: "",
                files: [],
                descriptionDefault: ''
            }
            return {
                ...state,
            }
        })
    }

    handleUploadFile = (taskId, creator) => {
        const data = new FormData();
        let { taskFiles } = this.state;
        taskFiles.files.forEach(x => {
            data.append("files", x)
        })
        data.append("description", taskFiles.description)
        data.append("creator", creator);
        if (taskFiles.files.length > 0) {
            this.props.uploadFile(taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        this.setState(state => {
            return {
                ...state,
                taskFiles: {
                    ...state.taskFiles,
                    description: "",
                    files: [],
                    descriptionDefault: ''
                },
            }
        })


    }

    handleEditFileTask = (file) => {
        this.setState(state => {
            return {
                ...state,
                showEditTaskFile: file._id,
                fileTaskEdited: {
                    descriptionDefault: file.description
                }
            }
        });
    }

    handleEditActionComment = (actionComent) => {
        this.setState(state => {
            return {
                ...state,
                editComment: actionComent._id,
                newCommentOfActionEdited: {
                    ...state.newCommentOfActionEdited,
                    descriptionDefault: actionComent.description
                }
            }
        })
    }

    handleEditAction = async (item) => {
        console.log(item)
        this.setState(state => {
            return {
                ...state,
                editAction: item._id,
                newActionEdited: {
                    ...state.newActionEdited,
                    descriptionDefault: item.description
                }
            }
        })
    }

    handleEditTaskComment = (taskComment) => {
        this.setState(state => {
            return {
                ...state,
                editTaskComment: taskComment._id,
                newTaskCommentEdited: {
                    ...state.newTaskCommentEdited,
                    descriptionDefault: taskComment.description
                }
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
        this.setState(state => {
            return {
                ...state,
                editAction: "",
                newActionEdited: {
                    ...state.newActionEdited,
                    files: [],
                    description: "",
                    descriptionDefault: null
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
                    files: [],
                    descriptionDefault: null
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
            await this.props.editActionComment(taskId, actionId, commentId, data);
        }
        this.setState(state => {
            return {
                ...state,
                newCommentOfActionEdited: {
                    ...state.newCommentOfActionEdited,
                    description: "",
                    files: [],
                    descriptionDefault: null
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
                    files: [],
                    descriptionDefault: null
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
                    files: [],
                    descriptionDefault: null
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
    }

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

    onCommentFilesChange = (files, actionId) => {
        this.setState(state => {
            state.newCommentOfAction[`${actionId}`] = {
                ...state.newCommentOfAction[`${actionId}`],
                files: files,
            }
            return {
                ...state
            }
        })
    }

    onCommentOfTaskCommentFilesChange = (commentId, files) => {
        this.setState(state => {
            state.newCommentOfTaskComment[`${commentId}`] = {
                ...state.newCommentOfTaskComment[`${commentId}`],
                files: files
            }
            return { ...state, }
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
        let { showFile } = this.state
        if (showFile.some(obj => obj === id)) {
            a = showFile.filter(x => x !== id);
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

    pressEnter = (event, taskId, index) => {
        let code = event.keyCode || event.which;
        if (code === 13 && !event.shiftKey) {
            this.submitAction(taskId, index)
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
        let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
        if (image.indexOf(string[string.length - 1]) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    showSort = async () => {
        let { taskActions, showSort } = this.state
        if (showSort) {
            this.setState({ showSort: false });
        } else {
            this.setState({ showSort: true });
        }

    }

    sort = (index, type) => {
        let a = []
        let { taskActions } = this.state
        let item = taskActions[index];
        taskActions.splice(index, 1);
        taskActions.splice(type === "up" ? index - 1 : index + 1, 0, item);
        this.setState(state => {
            return {
                ...state,
                taskActions: taskActions
            }
        });
    }

    cancelSort = () => {
        let { taskActions } = this.state
        taskActions.sort(function (a, b) {
            return a.sort - b.sort;
        });
        this.setState({ taskActions: taskActions, showSort: false });
    }

    saveSort = async (taskId) => {
        let { taskActions } = this.state
        let i
        let arrayActions = []
        for (i = 0; i < taskActions.length; i++) {
            arrayActions[i] = taskActions[i]
            delete arrayActions[i]._id
        }

        this.props.sortActions(taskId, arrayActions)
        this.setState({ showSort: false });
    }

    setSrc = (src) => {
        this.setState({ src: src });
    }

    convertTime = (ms) => {
        if (!ms) return '00:00:00';
        let hour = Math.floor(ms / (60 * 60 * 1000));
        let minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000));
        let second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000);

        return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;
    }

    getRoleNameInTask = (value) => {
        let { translate } = this.props;
        switch (value) {
            case 'responsible':
                return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.responsible')} ]</span>
            case 'accountable':
                return <span style={{ fontSize: 10 }} className="text-green">[ {translate('task.task_management.accountable')} ]</span>
            case 'consulted':
                return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.consulted')} ]</span>
            case 'informed':
                return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.informed')} ]</span>
            case 'creator':
                return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.creator')} ]</span>
            default:
                return '';
        }
    }

    filterLogAutoStopped = (e) => {
        this.setState({
            filterLogAutoStopped: e.target.value
        })
    }

    checkValidateDate = (start, end) => {
        let mStart = moment(start);
        let mEnd = moment(end);
        return mEnd.isAfter(mStart);
    }

    // Bấm giờ công việc 
    handleChangeDateAddLog = (value) => {
        const { translate } = this.props;
        const DateSplit = value.split("-");
        let addLogTimeDate = DateSplit[2] + '-' + DateSplit[1] + '-' + DateSplit[0];

        let { message } = ValidationHelper.validateEmpty(translate, value);
        const checkDateAddLog = this.checkValidateDate(this.formatDate(Date.now()), addLogTimeDate);
        if (checkDateAddLog)
            message = "Không được chọn ngày trong tương lai";

        this.setState({
            ...this.state,
            addLogTimeDate,
            errorDateAddLog: message,
            checkDateAddLog,
        })
    }

    handleChangeDateAddStartTime = (value) => {
        const { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({
            ...this.state,
            addLogStartTime: value,
            errorStartTimeAddLog: message,
        })
    }

    getDefaultValueStartTime = (value) => {
        this.setState({
            ...this.state,
            addLogStartTime: value,
        })
    }

    handleChangeDateAddEndTime = (value) => {
        const { translate } = this.props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        this.setState({
            ...this.state,
            addLogEndTime: value,
            errorEndTimeAddLog: message
        })
    }

    getDefaultValueEndTime = (value) => {
        this.setState({
            ...this.state,
            addLogEndTime: value,
        })
    }

    handleChangeAddLogDescription = (e) => {
        const { value } = e.target;
        this.setState({
            ...this.state,
            addLogDescription: value,
        })
    }

    saveAddLogTime = () => {
        const { performtasks } = this.props;
        let { addLogTimeDate, addLogStartTime, addLogEndTime, addLogDescription } = this.state;
        let startAt, stopAt;

        if (addLogTimeDate && addLogStartTime) {
            startAt = new Date(addLogTimeDate + " " + addLogStartTime);
        }

        if (addLogTimeDate && addLogEndTime) {
            stopAt = new Date(addLogTimeDate + " " + addLogEndTime);
        }

        const timer = {
            employee: localStorage.getItem("userId"),
            addlogStartedAt: startAt,
            addlogDescription: addLogDescription,
            addlogStoppedAt: stopAt,
            taskId: performtasks.task._id,
            autoStopped: 3, // 3: add log timer
        };
        // Check kho cho phép add log timer trong tương lại (thời gian lớn hơn thời điểm hiện tại)
        if (this.checkValidateDate(new Date(), stopAt)) {
            Swal.fire({
                title: 'Không được chỉ định thời gian kết thúc bấm giờ trong tương lai ',
                type: 'warning',
                confirmButtonColor: '#dd4b39',
                confirmButtonText: "Đóng",
            })
        } else {
            // Check thời gian kết thúc phải sau thời gian bắt đầu
            if (!this.checkValidateDate(startAt, stopAt)) {
                Swal.fire({
                    title: 'Thời gian kết thúc phải sau thời gian bắt đầu',
                    type: 'warning',
                    confirmButtonColor: '#dd4b39',
                    confirmButtonText: "Đóng",
                })
            } else {
                this.props.stopTimer(performtasks.task._id, timer);
                this.setState({
                    ...this.state,
                    showBoxAddLogTimer: false,
                    addLogDescription: "",
                })
            }
        }
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        return [year, month, day].join('-');
    }

    isFormValidated = () => {
        const { addLogTimeDate, addLogStartTime, addLogEndTime, checkDateAddLog } = this.state;
        const { translate } = this.props;

        if (!ValidationHelper.validateEmpty(translate, addLogTimeDate).status
            || !ValidationHelper.validateEmpty(translate, addLogStartTime).status
            || !ValidationHelper.validateEmpty(translate, addLogEndTime).status || checkDateAddLog)
            return false;
        return true;
    }

    render() {
        let task, informations, statusTask, documents, actionComments, taskComments, logTimer, logs;
        let idUser = getStorage("userId");
        const { tasks, performtasks, user, auth, translate, role, id } = this.props;
        const subtasks = tasks.subtasks;
        const {
            showEvaluations, selected, comment, editComment, showChildComment, editAction, action, taskActions,
            editTaskComment, showEditTaskFile,
            editCommentOfTaskComment, valueRating, currentUser, hover, fileTaskEdited, showSort,
            showFile, deleteFile, taskFiles, newActionEdited, newCommentOfActionEdited, newAction,
            newCommentOfAction, newTaskCommentEdited, newCommentOfTaskComment, newTaskComment, newCommentOfTaskCommentEdited, showBoxAddLogTimer, addLogStartTime, addLogEndTime
        } = this.state;

        // error message
        const { errorDateAddLog, errorStartTimeAddLog, errorEndTimeAddLog } = this.state;
        const checkUserId = obj => obj.creator._id === currentUser;

        if (typeof performtasks.task !== 'undefined' && performtasks.task !== null) {
            task = performtasks.task;
            taskComments = task.taskComments;
            documents = task.documents
        }
        if (performtasks.logtimer) {
            logTimer = performtasks.logtimer;
        }
        if (performtasks.logs) {
            logs = performtasks.logs;
        };

        switch (this.state.filterLogAutoStopped) {
            case 'auto':
                logTimer = logTimer.filter(item => item.autoStopped === 2)
                break;
            case 'hand':
                logTimer = logTimer.filter(item => item.autoStopped === 1)
                break;
            case 'addlog':
                logTimer = logTimer.filter(item => item.autoStopped === 3)
                break;
            default:
                break;
        }

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
                                <ShowMoreShowLess
                                    id={`description${id}`}
                                    classShowMoreLess='tool-level1'
                                    styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                                >
                                    {
                                        // Hiển thị hoạt động của công việc
                                        (taskActions).map((item, index) => {
                                            return (
                                                <div key={item._id} className={index > 3 ? "hide-component" : ""}>
                                                    {item.creator ?
                                                        <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + item.creator.avatar)} alt="User Image" /> :
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
                                                                        <div key={idx}>
                                                                            {parse(item)}
                                                                        </div>
                                                                    );
                                                                })
                                                                }

                                                                <div className="btn-group pull-right">
                                                                    {(role === 'responsible' && item.creator && showSort === false) &&
                                                                        <React.Fragment>
                                                                            <span data-toggle="dropdown">
                                                                                <i className="fa fa-ellipsis-h"></i>
                                                                            </span>
                                                                            <ul className="dropdown-menu">
                                                                                <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditAction(item)} >{translate("task.task_perform.edit_action")}</a></li>
                                                                                <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteTaskAction(item._id, task._id)} >{translate("task.task_perform.delete_action")}</a></li>
                                                                            </ul>
                                                                        </React.Fragment>
                                                                    }
                                                                    {showSort === true && (role === 'responsible' || role === 'accountable') &&
                                                                        <div className="sort-action">
                                                                            {index !== 0 && <a style={{ marginTop: index === taskActions.length - 1 ? "10px" : "0px" }} onClick={() => this.sort(index, "up")}><i className="glyphicon glyphicon-arrow-up"></i> </a>}
                                                                            {index !== taskActions.length - 1 && <a style={{ marginTop: index === 0 ? "13px" : "0px" }} onClick={() => this.sort(index, "down")}><i className="glyphicon glyphicon-arrow-down"></i> </a>}
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </div>

                                                            {/* Các file đính kèm */}
                                                            {!showSort && <ul className="list-inline tool-level1">
                                                                <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                                <li>{item.mandatory && !item.creator && <b className="text-sm">{translate("task.task_perform.mandatory_action")}</b>}</li>
                                                                {((item.creator === undefined || item.creator === null) && role === "responsible") &&
                                                                    <li><a style={{ cursor: "pointer" }} className="text-green text-sm" onClick={(e) => this.handleConfirmAction(e, item._id, currentUser, task._id)}><i className="fa fa-check-circle" aria-hidden="true"></i> {translate("task.task_perform.confirm_action")}</a></li>}

                                                                {/* Các chức năng tương tác với action */}
                                                                {item.creator &&
                                                                    <React.Fragment>
                                                                        {item.evaluations && <li><a style={{ cursor: "pointer", pointerEvents: item.evaluations.length > 0 ? "" : "none" }} className="link-black text-sm" onClick={() => { this.handleShowEvaluations(item._id) }}><i className="fa fa-thumbs-o-up margin-r-5"></i>{translate("task.task_perform.evaluation")} ({item.evaluations && item.evaluations.length})</a></li>}
                                                                        {(role === "accountable" || role === "consulted" || role === "creator" || role === "informed") &&
                                                                            <li style={{ display: "inline-table" }} className="list-inline">
                                                                                <React.Fragment>
                                                                                    <Rating
                                                                                        fractions={2}
                                                                                        emptySymbol="fa fa-star-o fa-2x high"
                                                                                        fullSymbol="fa fa-star fa-2x high"
                                                                                        initialRating={0}
                                                                                        onClick={(value) => {
                                                                                            this.setValueRating(item._id, task._id, role, value, 1);
                                                                                        }}
                                                                                        onHover={(value) => {
                                                                                            this.setHover(item._id, value)
                                                                                        }}
                                                                                    />
                                                                                    <div style={{ display: "inline", marginLeft: "5px" }}>{this.hover[item._id]}</div>
                                                                                </React.Fragment>
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
                                                            </ul>}
                                                            <div className="tool-level1" style={{ paddingLeft: 5 }}>
                                                                {/* Các kết quả đánh giá của action */}
                                                                {showEvaluations.some(obj => obj === item._id) &&
                                                                    <div style={{ marginBottom: "10px" }}>
                                                                        <ul className="list-inline">
                                                                            <li>
                                                                                {
                                                                                    Array.isArray(item.evaluations) &&
                                                                                    item.evaluations.map((element, index) => {
                                                                                        return (
                                                                                            <p key={index}>
                                                                                                <b> {element.creator.name} </b>
                                                                                                {this.getRoleNameInTask(element.role)}
                                                                                                <span className="text-red"> {element.rating}/10 </span>
                                                                                            </p>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </li>
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
                                                                    idQuill={`edit-action-${item._id}`}
                                                                    inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                                    onFilesChange={this.onEditActionFilesChange}
                                                                    onFilesError={this.onFilesError}
                                                                    files={newActionEdited.files}
                                                                    text={newActionEdited.descriptionDefault}
                                                                    submitButtonText={translate("task.task_perform.save_edit")}
                                                                    cancelButtonText={translate("task.task_perform.cancel")}
                                                                    handleEdit={(item) => this.handleEditAction(item)}
                                                                    onTextChange={(value, imgs) => {
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
                                                    {!showSort && showChildComment.some(obj => obj === item._id) &&
                                                        <div>
                                                            {item.comments.map(child => {
                                                                return <div key={child._id}>
                                                                    <img className="user-img-level2" src={(process.env.REACT_APP_SERVER + child.creator?.avatar)} alt="User Image" />
                                                                    {editComment !== child._id && // Khi đang edit thì nội dung cũ đi
                                                                        <div>
                                                                            <div className="content-level2">
                                                                                <a style={{ cursor: "pointer" }}>{child.creator?.name} </a>
                                                                                {child.description.split('\n').map((item, idx) => {
                                                                                    return (
                                                                                        <span key={idx}>
                                                                                            {parse(item)}
                                                                                        </span>
                                                                                    );
                                                                                })}

                                                                                {child.creator?._id === currentUser &&
                                                                                    <div className="btn-group pull-right">
                                                                                        <span data-toggle="dropdown">
                                                                                            <i className="fa fa-ellipsis-h"></i>
                                                                                        </span>
                                                                                        <ul className="dropdown-menu">
                                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditActionComment(child)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteActionComment(task._id, item._id, child._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                                        </ul>
                                                                                    </div>}
                                                                            </div>
                                                                            <ul className="list-inline tool-level2">
                                                                                <li><span className="text-sm">{<DateTimeConverter dateTime={child.createdAt} />}</span></li>
                                                                                {child.files && child.files.length > 0 &&
                                                                                    <li style={{ display: "inline-table" }}>
                                                                                        <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({child.files && child.files.length})</i></b></a></div>
                                                                                    </li>
                                                                                }
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
                                                                                    idQuill={`edit-comment-${child._id}`}
                                                                                    inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                                                    onFilesChange={this.onEditCommentOfActionFilesChange}
                                                                                    onFilesError={this.onFilesError}
                                                                                    files={newCommentOfActionEdited.files}
                                                                                    text={newCommentOfActionEdited.descriptionDefault}
                                                                                    submitButtonText={translate("task.task_perform.save_edit")}
                                                                                    cancelButtonText={translate("task.task_perform.cancel")}
                                                                                    handleEdit={(e) => this.handleEditActionComment(e)}
                                                                                    onTextChange={(value, imgs) => {
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
                                                                <img className="user-img-level2"
                                                                    src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar"
                                                                />
                                                                <ContentMaker
                                                                    idQuill={`add-comment-action-${item._id}`}
                                                                    imageDropAndPasteQuill={false}
                                                                    inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                                    onFilesChange={(files) => this.onCommentFilesChange(files, item._id)}
                                                                    onFilesError={this.onFilesError}
                                                                    files={newCommentOfAction[`${item._id}`]?.files}
                                                                    text={newCommentOfAction[`${item._id}`]?.descriptionDefault}
                                                                    placeholder={translate("task.task_perform.enter_comment_action")}
                                                                    submitButtonText={translate("task.task_perform.create_comment_action")}
                                                                    onTextChange={(value, imgs) => {
                                                                        this.setState(state => {
                                                                            state.newCommentOfAction[`${item._id}`] = {
                                                                                ...state.newCommentOfAction[`${item._id}`],
                                                                                creator: idUser,
                                                                                description: value,
                                                                                descriptionDefault: null
                                                                            }
                                                                            return {
                                                                                ...state,
                                                                            }
                                                                        })
                                                                    }}
                                                                    onSubmit={(e) => { this.submitComment(item._id, task._id) }}
                                                                />
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </ShowMoreShowLess>
                                : null
                            }
                            {/* Thêm hoạt động cho công việc*/}
                            {showSort ?
                                <div className="row" style={{ marginTop: 20 }}>
                                    <div className="col-xs-6">
                                        <button type="button" className={`btn btn-block`} onClick={() => this.cancelSort()}>Hủy</button>
                                    </div>
                                    <div className="col-xs-6">
                                        <button type="button" className={`btn btn-block`} onClick={() => this.saveSort(task._id)}>Lưu</button>
                                    </div>
                                </div>
                                // <div className="" style={{ display: "flex", justifyContent: "center" }}>
                                //     <button className="link-black text-sm btn btn-primary" onClick={() => this.saveSort(task._id)}>Lưu</button>
                                //     <button className="link-black text-sm btn btn-warning" onClick={() => this.cancelSort()}>Hủy</button>
                                // </div>
                                :
                                <React.Fragment>
                                    {role === "responsible" && task &&
                                        <React.Fragment>
                                            <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                            <ContentMaker
                                                idQuill="add-action"
                                                inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                                onFilesChange={this.onActionFilesChange}
                                                onFilesError={this.onFilesError}
                                                files={newAction.files}
                                                text={newAction.descriptionDefault}
                                                placeholder={role === "responsible" ? translate("task.task_perform.result") : translate("task.task_perform.enter_action")}
                                                submitButtonText={role === "responsible" ? translate("general.add") : translate("task.task_perform.create_action")}
                                                onTextChange={(value, imgs) => {
                                                    this.setState(state => {
                                                        return { ...state, newAction: { ...state.newAction, description: value, descriptionDefault: null } }
                                                    })
                                                }}
                                                onSubmit={(e) => { this.submitAction(task._id, taskActions.length) }}
                                            />
                                        </React.Fragment>}
                                    {(role === "responsible" || role === "accountable") && taskActions.length > 1 && <button className="btn btn-block btn-default btn-sm" onClick={this.showSort}>Sắp xếp hoạt động</button>}
                                </React.Fragment>
                            }
                        </div>

                        {/* Chuyển qua tab trao đổi */}
                        <div className={selected === "taskComment" ? "active tab-pane" : "tab-pane"} id="taskComment">
                            {typeof taskComments !== 'undefined' && taskComments.length !== 0 ?
                                <ShowMoreShowLess
                                    id={`taskComment${id}`}
                                    classShowMoreLess='tool-level1'
                                    styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                                >
                                    {
                                        taskComments.map((item, index) => {
                                            return (
                                                <div key={item._id} className={index > 3 ? "hide-component" : ""}>
                                                    <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + item.creator?.avatar)} alt="User Image" />
                                                    {editTaskComment !== item._id && // Khi đang edit thì ẩn đi
                                                        <React.Fragment>
                                                            <div className="content-level1">
                                                                <a style={{ cursor: "pointer" }}>{item.creator?.name} </a>
                                                                {item.description.split('\n').map((item, idx) => {
                                                                    return (
                                                                        <span key={idx}>
                                                                            {parse(item)}
                                                                        </span>
                                                                    );
                                                                })}
                                                                {item.creator?._id === currentUser &&
                                                                    <div className="btn-group pull-right">
                                                                        <span data-toggle="dropdown">
                                                                            <i className="fa fa-ellipsis-h"></i>
                                                                        </span>
                                                                        <ul className="dropdown-menu">
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditTaskComment(item)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteTaskComment(item._id, task._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                        </ul>
                                                                    </div>}
                                                            </div>


                                                            <ul className="list-inline tool-level1">
                                                                <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                                <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => this.handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate("task.task_perform.comment")} ({item.comments.length}) &nbsp;</a></li>
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
                                                                    idQuill={`edit-content-${item._id}`}
                                                                    inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                                    onFilesChange={this.onEditTaskCommentFilesChange}
                                                                    onFilesError={this.onFilesError}
                                                                    files={newTaskCommentEdited.files}
                                                                    text={newTaskCommentEdited.descriptionDefault}
                                                                    submitButtonText={translate("task.task_perform.save_edit")}
                                                                    cancelButtonText={translate("task.task_perform.cancel")}
                                                                    handleEdit={(e) => this.handleEditTaskComment(e)}
                                                                    onTextChange={(value, imgs) => {
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
                                                    {showChildComment.some(x => x === item._id) &&
                                                        <div className="comment-content-child">
                                                            {item.comments.map(child => {
                                                                return <div key={child._id}>
                                                                    <img className="user-img-level2" src={(process.env.REACT_APP_SERVER + child.creator?.avatar)} alt="User Image" />
                                                                    {editCommentOfTaskComment !== child._id && // Đang edit thì ẩn đi
                                                                        <div>
                                                                            <div className="content-level2">
                                                                                <a style={{ cursor: "pointer" }}>{child.creator?.name} </a>
                                                                                {child.description.split('\n').map((item, idx) => {
                                                                                    return (
                                                                                        <span key={idx}>
                                                                                            {parse(item)}
                                                                                        </span>
                                                                                    );
                                                                                })}

                                                                                {child.creator?._id === currentUser &&
                                                                                    <div className="btn-group pull-right">
                                                                                        <span data-toggle="dropdown">
                                                                                            <i className="fa fa-ellipsis-h"></i>
                                                                                        </span>
                                                                                        <ul className="dropdown-menu">
                                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditCommentOfTaskComment(child)} >{translate("task.task_perform.edit_comment")}</a></li>
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
                                                                                    idQuill={`edit-child-comment-${child._id}`}
                                                                                    inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                                                    onFilesChange={this.onEditCommentOfTaskCommentFilesChange}
                                                                                    onFilesError={this.onFilesError}
                                                                                    files={newCommentOfTaskCommentEdited.files}
                                                                                    text={newCommentOfTaskCommentEdited.descriptionDefault}
                                                                                    submitButtonText={translate("task.task_perform.save_edit")}
                                                                                    cancelButtonText={translate("task.task_perform.cancel")}
                                                                                    handleEdit={(e) => this.handleEditCommentOfTaskComment(e)}
                                                                                    onTextChange={(value, imgs) => {
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
                                                                <img className="user-img-level2" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                                                <ContentMaker
                                                                    idQuill={`add-child-comment-${item._id}`}
                                                                    inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                                    onFilesChange={(files) => this.onCommentOfTaskCommentFilesChange(item._id, files)}
                                                                    onFilesError={this.onFilesError}
                                                                    files={newCommentOfTaskComment[`${item._id}`]?.files}
                                                                    text={newCommentOfTaskComment[`${item._id}`]?.descriptionDefault}
                                                                    placeholder={translate("task.task_perform.enter_comment")}
                                                                    submitButtonText={translate("task.task_perform.create_comment")}
                                                                    onTextChange={(value, imgs) => {
                                                                        this.setState(state => {
                                                                            state.newCommentOfTaskComment[`${item._id}`] = {
                                                                                ...state.newCommentOfTaskComment[`${item._id}`],
                                                                                description: value,
                                                                                creator: currentUser,
                                                                                descriptionDefault: null
                                                                            }
                                                                            return { ...state }
                                                                        })
                                                                    }}
                                                                    onSubmit={(e) => { this.submitCommentOfTaskComment(item._id, task._id) }}
                                                                />
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </ShowMoreShowLess> : null
                            }
                            {/* Thêm bình luận cho công việc*/}
                            <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="User Image" />
                            <ContentMaker
                                idQuill="add-comment-task"
                                inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                onFilesChange={this.onTaskCommentFilesChange}
                                onFilesError={this.onFilesError}
                                files={newTaskComment.files}
                                text={newTaskComment.descriptionDefault}
                                placeholder={translate("task.task_perform.enter_comment")}
                                submitButtonText={translate("task.task_perform.create_comment")}
                                onTextChange={(value, imgs) => {
                                    this.setState(state => {
                                        return {
                                            ...state,
                                            newTaskComment: {
                                                ...state.newTaskComment,
                                                description: value,
                                                descriptionDefault: null
                                            }
                                        }
                                    })

                                }}
                                onSubmit={(e) => { this.submitTaskComment(task._id) }}
                            />
                        </div>


                        {/* Chuyển qua tab tài liệu */}
                        <div className={selected === "documentTask" ? "active tab-pane" : "tab-pane"} id="documentTask">
                            <div>
                                {documents &&
                                    <ShowMoreShowLess
                                        id={`documentTask${id}`}
                                        styleShowMoreLess={{ display: "inline-block", marginBotton: 15, marginTop: 15 }}
                                    >
                                        {
                                            documents.map((item, index) => {
                                                return (
                                                    <React.Fragment key={`documents-${item._id}`}>
                                                        {showEditTaskFile !== item._id &&
                                                            <div key={item._id} className={`item-box ${index > 3 ? "hide-component" : ""}`}>
                                                                {(currentUser === item.creator?._id) &&
                                                                    <div className="btn-group pull-right">
                                                                        <span data-toggle="dropdown">
                                                                            <i className="fa fa-ellipsis-h"></i>
                                                                        </span>
                                                                        <ul className="dropdown-menu">
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => this.handleEditFileTask(item)} >{translate("task.task_perform.edit")}</a></li>
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => this.props.deleteDocument(item._id, task._id)} >{translate("task.task_perform.delete")}</a></li>
                                                                        </ul>
                                                                    </div>}
                                                                <div>
                                                                    <ul className='list-inline list-name-document'>
                                                                        <li><strong>{item.creator?.name} </strong></li>
                                                                        <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                                    </ul>
                                                                    {parse(item.description)}
                                                                </div>
                                                                <div>
                                                                    {showFile.some(obj => obj === item._id) ?
                                                                        <a style={{ cursor: 'pointer' }} onClick={() => { this.handleShowFile(item._id) }}>Ẩn bớt<i className='fa fa-angle-double-up'></i></a>
                                                                        :
                                                                        <a style={{ cursor: 'pointer' }} onClick={() => { this.handleShowFile(item._id) }}>Hiển thị {item?.files?.length} tài liệu &nbsp; <i className='fa fa-angle-double-down'></i> </a>
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
                                                                                            <a style={{ cursor: "pointer", marginTop: "2px" }} onClick={(e) => this.requestDownloadFile(e, elem.url, elem.name)}> {elem.name} </a>
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
                                                                    <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                                                    <ContentMaker
                                                                        idQuill={`edit-file-${item._id}`}
                                                                        inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                                        onFilesChange={this.onEditFileTask}
                                                                        onFilesError={this.onFilesError}
                                                                        files={fileTaskEdited.files}
                                                                        text={fileTaskEdited.descriptionDefault}
                                                                        submitButtonText={translate("task.task_perform.save_edit")}
                                                                        cancelButtonText={translate("task.task_perform.cancel")}
                                                                        handleEdit={(e) => this.handleEditFileTask(e)}
                                                                        onTextChange={(value, imgs) => {
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
                                    </ShowMoreShowLess>
                                }
                            </div>
                            <React.Fragment>
                                <div style={{ marginTop: '15px' }}>
                                    <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                    <ContentMaker
                                        idQuill="upload-file"
                                        inputCssClass="text-input-level1" controlCssClass="tool-level1"
                                        onFilesChange={this.onTaskFilesChange}
                                        onFilesError={this.onFilesError}
                                        files={taskFiles.files}
                                        text={taskFiles.descriptionDefault}
                                        placeholder={translate("task.task_perform.enter_description")}
                                        submitButtonText={translate("task.task_perform.create_document")}
                                        onTextChange={(value, imgs) => {
                                            this.setState(state => {
                                                return { ...state, taskFiles: { ...state.taskFiles, description: value, descriptionDefault: null } }

                                            })
                                        }}
                                        disableSubmit={true}
                                        onSubmit={(e) => { this.handleUploadFile(task._id, currentUser) }}
                                    />
                                </div>
                            </React.Fragment>
                        </div>

                        {/* Chuyển qua tab công việc liên quan */}
                        <div className={selected === "subTask" ? "active tab-pane" : "tab-pane"} id="subTask">
                            <SubTaskTab
                                id={this.state.id}
                            />
                        </div>

                        {/* Chuyển qua tab Bấm giờ */}
                        <div className={selected === "logTimer" ? "active tab-pane" : "tab-pane"} id="logTimer">
                            <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Hình thức bấm giờ</label>
                                        <select className="form-control" value={this.state.filterLogAutoStopped} onChange={this.filterLogAutoStopped}>
                                            <option value="all">Tất cả</option>
                                            <option value="auto">Tắt tự động</option>
                                            <option value="hand">Tắt bằng tay</option>
                                            <option value="addlog">Giờ được thêm</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <button className="btn btn-success" style={{ float: 'right' }}
                                        disabled={showBoxAddLogTimer}
                                        onClick={() => {
                                            this.setState({
                                                ...this.state,
                                                showBoxAddLogTimer: true,
                                            })
                                        }}>
                                        Add log hours
                                    </button>
                                </div>

                                {
                                    showBoxAddLogTimer &&
                                    <div className="addlog-box">
                                        <h4 className="addlog-title">New Time Log</h4>
                                        <p style={{ color: "#f96767" }}>(*) Ghi nhật ký thời gian không được phép cho các ngày trong tương lai</p>
                                        <div>
                                            <div className={`form-group ${!errorDateAddLog ? "" : "has-error"}`}>
                                                <label>Ngày <span className="text-red">*</span></label>
                                                <DatePicker
                                                    id={`addlog-date`}
                                                    onChange={this.handleChangeDateAddLog}
                                                    defaultValue={formatDate(Date.now())}
                                                />
                                                <ErrorLabel content={errorDateAddLog} />
                                            </div>
                                            <div className="row">
                                                <div className="col-sm-6 col-md-6">
                                                    <div className={`form-group ${!errorStartTimeAddLog ? "" : "has-error"}`}>
                                                        <label>Từ <span className="text-red">*</span></label>
                                                        <TimePicker
                                                            id={`addlog-startTime`}
                                                            value={addLogStartTime}
                                                            onChange={this.handleChangeDateAddStartTime}
                                                            getDefaultValue={this.getDefaultValueStartTime}
                                                        />
                                                        <ErrorLabel content={errorStartTimeAddLog} />
                                                    </div>
                                                </div>
                                                <div className="col-sm-6 col-md-6">
                                                    <div className={`form-group ${!errorEndTimeAddLog ? "" : "has-error"}`}>
                                                        <label>Đến <span className="text-red">*</span></label>
                                                        <TimePicker
                                                            id={`addlog-endtime`}
                                                            value={addLogEndTime}
                                                            onChange={this.handleChangeDateAddEndTime}
                                                            getDefaultValue={this.getDefaultValueEndTime}
                                                        />
                                                        <ErrorLabel content={errorEndTimeAddLog} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Mô tả</label>
                                                <TextareaAutosize
                                                    style={{ width: '100%', border: '1px solid rgba(70, 68, 68, 0.15)', padding: '5px' }}
                                                    minRows={3}
                                                    maxRows={20}
                                                    onChange={this.handleChangeAddLogDescription}
                                                />
                                            </div>
                                            <div>
                                                <button className="btn btn-success" style={{ marginRight: '10px' }} onClick={this.saveAddLogTime} disabled={!this.isFormValidated()} >Lưu</button>
                                                <button className="btn btn-danger" onClick={() => {
                                                    this.setState({
                                                        ...this.state,
                                                        showBoxAddLogTimer: false,
                                                        addLogDescription: "",
                                                    })
                                                }}>Hủy</button>
                                            </div>
                                        </div>
                                    </div>
                                }

                            </div>
                            {logTimer && logTimer.map((item, index) =>
                                <React.Fragment key={index}>
                                    {item.stoppedAt &&
                                        <div key={item._id} className="item-box">
                                            <h3 className={`pull-right ${item.acceptLog ? 'text-green' : 'text-red'}`}>{this.convertTime(item.duration)}</h3>
                                            <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.creator?.name} </a>
                                            <div>
                                                <i className="fa fa-clock-o"> </i> {moment(item.startedAt).format("DD/MM/YYYY HH:mm:ss")}{" - "}
                                                <i className="fa fa-clock-o"> </i> {moment(item.stoppedAt).format("DD/MM/YYYY HH:mm:ss")})
                                            </div>
                                            <div>
                                                <i style={{ marginRight: '5px' }} className={`${item.autoStopped === 1 ? 'text-green fa fa-hand-pointer-o' : (item.autoStopped === 2 ? 'text-red fa fa-clock-o' : 'text-red fa fa-plus')}`}>{item.autoStopped === 1 ? 'Tắt bằng tay' : (item.autoStopped === 2 ? 'Tự động' : 'Add log timer')}</i>
                                                {
                                                    role === "accountable" ?
                                                        (
                                                            <React.Fragment>
                                                                <i className={`${item.acceptLog ? 'text-green fa fa-check' : 'text-red fa fa-close'}`}> {item.acceptLog ? 'Được chấp nhận' : 'Không được chấp nhận'}</i>
                                                                <a
                                                                    style={{ cursor: 'pointer', marginLeft: 10, fontWeight: 'bold' }}
                                                                    className={item.acceptLog ? 'text-red' : 'text-green'}
                                                                    onClick={
                                                                        item.acceptLog ?
                                                                            () => {
                                                                                console.log("Hủy duyệt bấm giờ");
                                                                                this.props.editTimeSheetLog(this.state.id, item._id, {
                                                                                    acceptLog: false
                                                                                })
                                                                            } :
                                                                            () => {
                                                                                console.log("Chấp nhận bấm giờ")
                                                                                this.props.editTimeSheetLog(this.state.id, item._id, {
                                                                                    acceptLog: true
                                                                                })
                                                                            }
                                                                    }
                                                                >
                                                                    [ {item.acceptLog ? 'Hủy' : 'Chấp nhận'} ]
                                                                </a>
                                                            </React.Fragment>
                                                        ) : (
                                                            <i className={`${item.acceptLog ? 'text-green fa fa-check' : 'text-red fa fa-close'}`}> {item.acceptLog ? 'Được chấp nhận' : 'Không được chấp nhận'}</i>
                                                        )
                                                }
                                            </div>
                                            <div>
                                                <i className="fa fa-edit"></i>
                                                {item.description ? item.description : translate("task.task_perform.none_description")}
                                            </div>
                                        </div>
                                    }
                                </React.Fragment>
                            )}
                        </div>

                        {/* Chuyển qua tab Nhật ký lịch sử */}
                        <div className={selected === "historyLog" ? "active tab-pane" : "tab-pane"} id="historyLog">
                            {logs &&
                                <ShowMoreShowLess
                                    id={`historyLog${id}`}
                                    styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                                >
                                    {
                                        logs.map((item, index) =>
                                            <div key={item._id} className={`item-box ${index > 3 ? "hide-component" : ""}`}>
                                                <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.creator?.name} </a>
                                                {item.title ? item.title : translate("task.task_perform.none_description")}&nbsp;
                                            ({moment(item.createdAt).format("HH:mm:ss DD/MM/YYYY")})
                                            <div>
                                                    {item.description ? parse(item.description) : translate("task.task_perform.none_description")}
                                                </div>
                                            </div>
                                        )
                                    }
                                </ShowMoreShowLess>
                            }
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
                                        taskId={task._id}
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
    const { tasks, performtasks, user, auth, notifications } = state;
    return { tasks, performtasks, user, auth, notifications };
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
    editTimeSheetLog: performTaskAction.editTimeSheetLog,
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
    editDocument: performTaskAction.editDocument,
    getAllPreceedingTasks: performTaskAction.getAllPreceedingTasks,
    sortActions: performTaskAction.sortActions,

    refreshDataAfterComment: performTaskAction.refreshDataAfterComment,
    refreshDataAfterCreateAction: performTaskAction.refreshDataAfterCreateAction,
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }

