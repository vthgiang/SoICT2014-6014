import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2'
import Rating from 'react-rating';
import moment from 'moment';
import 'moment/locale/vi';
import parse from 'html-react-parser';
import './actionTab.css';
import FilePreview from './FilePreview';
import { ContentMaker, DateTimeConverter, ApiImage, ShowMoreShowLess, SelectBox, DatePicker, TimePicker, ErrorLabel, DialogModal } from '../../../../common-components';

import { getStorage } from '../../../../config';

import { performTaskAction } from '../redux/actions';
import { taskManagementActions } from "../../task-management/redux/actions";
import { AuthActions } from '../../../auth/redux/actions';
import { ModalEditDateCreatedAction } from './modalEditDateCreatedAction';
import { SubTaskTab } from './subTaskTab';
import { ViewProcess } from '../../task-process/component/task-process-management/viewProcess';
import { IncomingDataTab } from './incomingDataTab';
import { OutgoingDataTab } from './outgoingDataTab';
import TextareaAutosize from 'react-textarea-autosize';
import ValidationHelper from '../../../../helpers/validationHelper';
import { formatDate } from '../../../../helpers/formatDate';
import { convertTime } from '../../../../helpers/stringMethod';
import { htmlToText } from 'html-to-text';
import { formatTime } from '../../../project/projects/components/functionHelper';
function ActionTab(props) {
    let idUser = getStorage("userId");
    const { tasks, performtasks, notifications, user, auth, translate, role, id } = props;

    const [state, setState] = useState(() => initState())
    const [hover1, setHover1] = useState({})
    function initState() {
        let idUser = getStorage("userId");
        let lang = getStorage("lang")
        moment.locale(lang)
        return {
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
                descriptionDefault: "",
            },
            newActionEdited: {
                creator: idUser,
                description: "",
                files: [],
                descriptionDefault: ""
            },
            newCommentOfAction: {
                creator: idUser,
                description: "",
                files: [],
                taskActionId: null,
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
            evaluations: {},
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

            addLogTimeDate: formatDate(Date.now()),
            showBoxAddLogTimer: false,
            checkDateAddLog: false,
            showPopupApproveAllAction: false,
        };
    }
    const subtasks = tasks.subtasks;
    const {
        showEvaluations, selected, comment, editComment, showChildComment, editAction, action, taskActions,
        editTaskComment, showEditTaskFile, evaluations, actionImportanceLevelAll, ratingAll,
        editCommentOfTaskComment, valueRating, currentUser, hover, fileTaskEdited, showSort,
        showFile, deleteFile, taskFiles, newActionEdited, newCommentOfActionEdited, newAction,
        newCommentOfAction, newTaskCommentEdited, newCommentOfTaskComment, newTaskComment, newCommentOfTaskCommentEdited, showBoxAddLogTimer, addLogStartTime, addLogEndTime
    } = state;

    // error message
    const { errorDateAddLog, errorStartTimeAddLog, errorEndTimeAddLog } = state;
    const checkUserId = obj => obj.creator._id === currentUser;

    if (performtasks?.task && notifications?.associatedData?.value) {
        if (notifications.associatedData.dataType === "realtime_tasks") {
            props.refreshData(notifications.associatedData.value);
        }
        notifications.associatedData = {}; // reset lại ... 
    }

    useEffect(() => {
        setState({
            ...state,
            id: props.id,
            showBoxAddLogTimer: false,
            checkDateAddLog: false,
        })
        if (props.id) {
            props.getTimesheetLogs(props.id);
            props.getTimerStatusTask(props.id);
            props.getSubTask(props.id);
            props.getAllPreceedingTasks(props.id);
            props.getTaskLog(props.id);
        }

    }, [props.id])

    useEffect(() => {
        if (props.id) {
            props.getTaskById(props.id)
        }
    }, [props.auth.user.avatar])

    useEffect(() => {
        if (performtasks?.task?.taskActions) {
            setState({
                ...state,
                taskActions: performtasks.task.taskActions
            })
        }
    }, [JSON.stringify(performtasks?.task?.taskActions)])

    const setHover = async (id, value, type) => {
        console.log("value, type", value, type)
        if (type === "rating") {
            if (isNaN(value)) {
                setHover1({
                    ...hover1,
                    [`${id}-rating`]: null
                })
            } else {
                setHover1({
                    ...hover1,
                    [`${id}-rating`]: value
                })
            }
        } else {
            if (isNaN(value)) {
                setHover1({
                    ...hover1,
                    [`${id}-actionImportanceLevel`]: null
                })
            } else {
                setHover1({
                    ...hover1,
                    [`${id}-actionImportanceLevel`]: value
                })
            }
        }

        await setState({
            ...state,
            hover: {
                ...state.hover,
                id: value
            }
        })
    }

    const setValueRating = async (actionId, newValue) => {
        let newEvaluations = state.evaluations
        newEvaluations[actionId] = {
            ...newEvaluations[actionId],
            rating: newValue,
        }
        await setState(state => {
            return {
                ...state,
                valueRating: newValue,
                evaluations: newEvaluations
            }
        })
    }

    const setActionImportanceLevel = (actionId, value) => {
        let newEvaluations = state.evaluations
        newEvaluations[actionId] = {
            ...newEvaluations[actionId],
            actionImportanceLevel: value
        }
        setState(state => {
            return {
                ...state,
                evaluations: newEvaluations
            }
        })
    }

    const evaluationTaskAction = (evaAction, taskId, role, firstTime) => {
        let newEvaluations = state.evaluations
        let rating = newEvaluations?.[evaAction?._id]?.rating ?? evaAction?.rating;
        newEvaluations[evaAction?._id] = {
            ...newEvaluations[evaAction?._id],
            rating: rating === -1 ? 0 : rating,
            actionImportanceLevel: newEvaluations?.[evaAction?._id]?.actionImportanceLevel ?? evaAction?.actionImportanceLevel,
            firstTime: firstTime,
            type: "evaluation",
            role: role,
        }
        props.evaluationAction(evaAction?._id, taskId, newEvaluations?.[evaAction?._id])
        setState(state => {
            return {
                ...state,
                showEvaluations: [...state.showEvaluations, evaAction?._id]
            }
        })
    }
    const handleChangeContent = async (content) => {
        await setState(state => {
            return {
                ...state,
                selected: content
            }
        })
    }
    const handleComment = async (event) => {
        event.preventDefault();
        await setState(state => {
            return {
                ...state,
                comment: !state.comment
            }
        })
    }
    const handleAction = async (event) => {
        event.preventDefault();
        await setState(state => {
            return {
                ...state,
                action: !state.action
            }
        })
    }
    const handleShowChildComment = async (id) => {
        let a;
        if (state.showChildComment.some(obj => obj === id)) {
            a = state.showChildComment.filter(x => x !== id);
            setState(state => {
                return {
                    ...state,
                    showChildComment: a
                }
            })
        } else {
            setState(state => {
                return {
                    ...state,
                    showChildComment: [...state.showChildComment, id]
                }
            })
        }
    }
    const handleEditCommentOfTaskComment = async (childComment) => {
        await setState(state => {
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
    const handleCloseModal = (id) => {
        let element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        let modal = document.getElementById(`modelPerformTask${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }
    const submitComment = async (actionId, taskId) => {
        let { newCommentOfAction } = state;
        const data = new FormData();

        if (actionId) {
            data.append("creator", newCommentOfAction[`${actionId}`].creator);
            data.append("description", newCommentOfAction[`${actionId}`].description);
            newCommentOfAction[`${actionId}`].files && newCommentOfAction[`${actionId}`].files.forEach(x => {
                data.append("files", x);
            })
            if (newCommentOfAction[`${actionId}`].description && newCommentOfAction[`${actionId}`].creator) {
                props.createActionComment(taskId, actionId, data);
            }
            setState(state => {
                state.newCommentOfAction[`${actionId}`] = {
                    description: "",
                    files: [],
                    descriptionDefault: ''
                }
                state.CommentOfActionFilePaste = []
                return {
                    ...state,
                }
            })
        }
    }

    //Thêm mới hoạt động
    const submitAction = async (taskId, index) => {
        let { newAction } = state;

        const data = new FormData();

        data.append("creator", newAction.creator);
        data.append("description", newAction.description);
        data.append("index", index)
        newAction.files && newAction.files.forEach(x => {
            data.append("files", x);
        })
        if (newAction.creator && newAction.description) {
            props.createTaskAction(taskId, data);
        }
        // Reset state cho việc thêm mới action
        setState(state => {
            return {
                ...state,
                filePaste: [],
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
    const submitTaskComment = async (taskId) => {
        let { newTaskComment } = state;

        const data = new FormData();
        data.append("creator", newTaskComment.creator);
        data.append("description", newTaskComment.description);
        newTaskComment.files.forEach(x => {
            data.append("files", x);
        })
        if (newTaskComment.description && newTaskComment.creator) {
            props.createTaskComment(taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        await setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    description: "",
                    files: [],
                    descriptionDefault: ''
                },
                newTaskCommentFilePaste: []
            }
        })
    }
    const submitCommentOfTaskComment = async (commentId, taskId) => {
        let { newCommentOfTaskComment } = state;
        const data = new FormData();

        data.append("creator", newCommentOfTaskComment[`${commentId}`].creator);
        data.append("description", newCommentOfTaskComment[`${commentId}`].description);
        newCommentOfTaskComment[`${commentId}`].files && newCommentOfTaskComment[`${commentId}`].files.forEach(x => {
            data.append("files", x);
        })
        if (newCommentOfTaskComment[`${commentId}`].description && newCommentOfTaskComment[`${commentId}`].creator) {
            props.createCommentOfTaskComment(commentId, taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        setState(state => {
            state.newCommentOfTaskComment[`${commentId}`] = {
                description: "",
                files: [],
                descriptionDefault: ''
            }
            state.newCommentOfTaskCommentPaste = []
            return {
                ...state,
            }
        })
    }

    const handleUploadFile = (taskId, creator) => {
        const data = new FormData();
        let { taskFiles } = state;
        taskFiles.files.forEach(x => {
            data.append("files", x)
        })
        data.append("description", taskFiles.description)
        data.append("creator", creator);
        if (taskFiles.files.length > 0) {
            props.uploadFile(taskId, data);
        }
        // Reset state cho việc thêm mới bình luận
        setState(state => {
            return {
                ...state,
                taskFiles: {
                    ...state.taskFiles,
                    description: "",
                    files: [],
                    descriptionDefault: ''
                },
                taskFilesPaste: []
            }
        })


    }

    const handleEditFileTask = (file) => {
        setState(state => {
            return {
                ...state,
                showEditTaskFile: file._id,
                fileTaskEdited: {
                    descriptionDefault: file.description
                }
            }
        });
    }

    const handleEditActionComment = (actionComent) => {
        setState(state => {
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

    const handleEditAction = async (item) => {
        setState(state => {
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

    const handleEditTaskComment = (taskComment) => {
        setState(state => {
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

    const handleSaveEditAction = async (e, id, description, taskId) => {
        e.preventDefault();
        let { newActionEdited } = state;
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
            props.editTaskAction(id, data, taskId);
        }
        setState(state => {
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
    const convertDateTime = (date, time) => {
        let splitter = date.split("-");
        let strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`;
        return new Date(strDateTime);
    }

    const handleSaveChangeDateAction = (action) => {
        let data = new FormData();
        let createdDateAction = convertDateTime(action.dateCreatedAt, action.timeCreatedAt)
        data.append("type", "edit-time")
        data.append("creator", getStorage("userId"))
        data.append("dateCreatedAt", createdDateAction)
        props.editTaskAction(action.id, data, action.taskId);
    }

    const handleSaveEditTaskComment = async (e, taskId, commentId, description) => {
        e.preventDefault();
        let { newTaskCommentEdited } = state;
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
            props.editTaskComment(taskId, commentId, data);
        }
        await setState(state => {
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
    const handleSaveEditActionComment = async (e, taskId, actionId, commentId, description) => {
        e.preventDefault();
        let { newCommentOfActionEdited } = state;
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
            await props.editActionComment(taskId, actionId, commentId, data);
        }
        setState(state => {
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

    const handleSaveEditCommentOfTaskComment = async (e, commentId, taskId, description) => {
        e.preventDefault();
        let { newCommentOfTaskCommentEdited } = state;
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
            props.editCommentOfTaskComment(commentId, taskId, data);
        }

        await setState(state => {
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

    const handleSaveEditTaskFile = async (e, description, documentId, taskId) => {
        e.preventDefault();
        let { fileTaskEdited } = state;
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
            props.editDocument(documentId, taskId, data);
        }

        await setState(state => {
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


    const handleConfirmAction = async (e, actionId, userId, taskId) => {
        e.preventDefault();
        props.confirmAction(userId, actionId, taskId)
    }

    const handleChange = (event) => {

        const textareaLineHeight = 13;
        const { minRows, maxRows } = state;
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

        setState({
            value: event.target.value,
            rows: currentRows < maxRows ? currentRows : maxRows,
        });
    }

    const onActionFilesChange = (files) => {
        setState(state => {
            return {
                ...state,
                newAction: {
                    ...state.newAction,
                    files: files,
                }
            }
        })
    }

    const onEditActionFilesChange = (files) => {
        setState(state => {
            return {
                ...state,
                newActionEdited: {
                    ...state.newActionEdited,
                    files: files,
                }
            }
        })
    }
    const onEditCommentOfTaskCommentFilesChange = async (files) => {
        setState(state => {
            return {
                ...state,
                newCommentOfTaskCommentEdited: {
                    ...state.newCommentOfTaskCommentEdited,
                    files: files
                }
            }
        });
    }
    const onEditTaskCommentFilesChange = (files) => {
        setState(state => {
            return {
                ...state,
                newTaskCommentEdited: {
                    ...state.newTaskCommentEdited,
                    files: files
                }
            }
        });
    }

    const onTaskCommentFilesChange = (files) => {
        setState(state => {
            return {
                ...state,
                newTaskComment: {
                    ...state.newTaskComment,
                    files: files
                }
            }
        })
    }

    const onCommentFilesChange = (files, actionId) => {
        setState(state => {
            state.newCommentOfAction[`${actionId}`] = {
                ...state.newCommentOfAction[`${actionId}`],
                files: files
            }
            return {
                ...state
            }
        })
    }
    const onEditCommentOfActionFilesChange = (files) => {
        setState(state => {
            return {
                ...state,
                newCommentOfActionEdited: {
                    ...state.newCommentOfActionEdited,
                    files: files,
                }
            }
        })
    }
    const onCommentOfTaskCommentFilesChange = (commentId, files) => {
        setState(state => {
            state.newCommentOfTaskComment[`${commentId}`] = {
                ...state.newCommentOfTaskComment[`${commentId}`],
                files: files
            }
            return { ...state, }
        })
    }
    const onTaskFilesChange = (files) => {
        setState(state => {
            return {
                ...state,
                taskFiles: {
                    ...state.taskFiles,
                    files: files
                }
            }
        })
    }

    const onFilesError = (error, file) => {
    }

    // const filesRemoveOne = (file) => {
    //     refs.filesAddAction.removeFile(file)
    // }

    // const filesRemoveAll = () => {
    //     refs.filesAddAction.removeFiles()
    // }

    const requestDownloadFile = (e, path, fileName) => {
        e.preventDefault();
        props.downloadFile(path, fileName);
    }

    const handleShowFile = (id) => {
        let a;
        let { showFile } = state
        if (showFile.some(obj => obj === id)) {
            a = showFile.filter(x => x !== id);
            setState(state => {
                return {
                    ...state,
                    showFile: a
                }
            })
        } else {
            setState(state => {
                return {
                    ...state,
                    showFile: [...state.showFile, id]
                }
            })
        }
    }

    const handleShowEvaluations = (id) => {
        let a;
        let { showEvaluations } = state;
        if (showEvaluations.some(obj => obj === id)) {
            a = showEvaluations.filter(x => x !== id);
            setState(state => {
                return {
                    ...state,
                    showEvaluations: a
                }
            })
        } else {
            setState(state => {
                return {
                    ...state,
                    showEvaluations: [...state.showEvaluations, id]
                }
            })
        }
    }

    const handleDeleteFile = async (fileId, fileName, actionId, type) => {
        let { performtasks, translate } = props
        Swal.fire({
            html: `<div style="max-width: 100%; max-height: 100%" >${translate("task.task_perform.question_delete_file")} ${fileName} ? <div>`,
            showCancelButton: true,
            cancelButtonText: `Hủy bỏ`,
            confirmButtonText: `Đồng ý`,
        }).then((result) => {
            if (result.isConfirmed) {
                save(performtasks?.task?._id)
            }
        })
        await setState(state => {
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

    const save = (taskId) => {
        let { deleteFile } = state
        if (deleteFile.type === "action") {
            props.deleteFileAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "commentofaction") {
            props.deleteFileCommentOfAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "taskcomment") {
            props.deleteFileTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "commentoftaskcomment") {
            props.deleteFileChildTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type);
        } else if (deleteFile.type === "task") {
            props.deleteFileTask(deleteFile.fileId, deleteFile.actionId, taskId)
        }
    }

    const pressEnter = (event, taskId, index) => {
        let code = event.keyCode || event.which;
        if (code === 13 && !event.shiftKey) {
            submitAction(taskId, index)
        }
        if (code == 13 && !event.shiftKey) {
            event.preventDefault();
        }
    }
    const onEditFileTask = (files) => {
        setState(state => {
            return {
                ...state,
                fileTaskEdited: {
                    ...state.fileTaskEdited,
                    files: files
                }
            }
        });
    }

    const isImage = (src) => {
        let string = src.split(".")
        let image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
        if (image.indexOf(string[string.length - 1]) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    const handleShowSort = async () => {
        let { taskActions, showSort } = state
        if (showSort) {
            setState({ showSort: false });
        } else {
            setState({ showSort: true });
        }

    }

    const sort = (index, type) => {
        let a = []
        let { taskActions } = state
        let item = taskActions[index];
        taskActions.splice(index, 1);
        taskActions.splice(type === "up" ? index - 1 : index + 1, 0, item);
        setState(state => {
            return {
                ...state,
                taskActions: taskActions
            }
        });
    }

    const cancelSort = () => {
        let { taskActions } = state
        taskActions.sort(function (a, b) {
            return a.sort - b.sort;
        });
        setState({ taskActions: taskActions, showSort: false });
    }

    const saveSort = async (taskId) => {
        let { taskActions } = state
        let i
        let arrayActions = []
        for (i = 0; i < taskActions.length; i++) {
            arrayActions[i] = taskActions[i]
            delete arrayActions[i]._id
        }

        props.sortActions(taskId, arrayActions)
        setState({ showSort: false });
    }

    const setSrc = (src) => {
        setState({ src: src });
    }

    const convertTime = (ms) => {
        if (!ms) return '00:00:00';
        let hour = Math.floor(ms / (60 * 60 * 1000));
        let minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000));
        let second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000);

        return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`;
    }

    const getRoleNameInTask = (value) => {
        let { translate } = props;
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

    const filterLogAutoStopped = (e) => {
        setState({
            filterLogAutoStopped: e.target.value
        })
    }

    const checkValidateDate = (start, end) => {
        let mStart = moment(start);
        let mEnd = moment(end);
        return mEnd.isAfter(mStart);
    }

    // Bấm giờ công việc 
    const handleChangeDateAddLog = (value) => {
        const { translate } = props;
        const DateSplit = value.split("-");
        let addLogTimeDate = DateSplit[2] + '-' + DateSplit[1] + '-' + DateSplit[0];

        let { message } = ValidationHelper.validateEmpty(translate, value);
        const checkDateAddLog = checkValidateDate(formatDate(Date.now()), addLogTimeDate);
        if (checkDateAddLog)
            message = "Không được chọn ngày trong tương lai";

        setState({
            ...state,
            addLogTimeDate,
            errorDateAddLog: message,
            checkDateAddLog,
        })
    }

    const handleChangeDateAddStartTime = (value) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({
            ...state,
            addLogStartTime: value,
            errorStartTimeAddLog: message,
        })
    }

    const getDefaultValueStartTime = (value) => {
        setState({
            ...state,
            addLogStartTime: value,
        })
    }

    const handleChangeDateAddEndTime = (value) => {
        const { translate } = props;
        let { message } = ValidationHelper.validateEmpty(translate, value);
        setState({
            ...state,
            addLogEndTime: value,
            errorEndTimeAddLog: message
        })
    }

    const getDefaultValueEndTime = (value) => {
        setState({
            ...state,
            addLogEndTime: value,
        })
    }

    const handleChangeAddLogDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            addLogDescription: value,
        })
    }

    const saveAddLogTime = () => {
        const { performtasks } = props;
        let { addLogTimeDate, addLogStartTime, addLogEndTime, addLogDescription } = state;
        let startAt, stopAt;
        let { startDate, endDate } = performtasks.task;

        // Định dạng new Date("2021-02-21 09:40 PM") chạy trên chorme ok, chạy trên firefox invalid date
        // nên chuyển thành định dạng new Date("2021/02/21 09:40 PM")
        if (addLogTimeDate && addLogStartTime) {
            startAt = new Date((addLogTimeDate + " " + addLogStartTime).replace(/-/g, '/'));
        }

        if (addLogTimeDate && addLogEndTime) {
            stopAt = new Date((addLogTimeDate + " " + addLogEndTime).replace(/-/g, '/'));
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
        if (checkValidateDate(new Date(), stopAt)) {
            Swal.fire({
                title: 'Không được chỉ định thời gian kết thúc bấm giờ trong tương lai ',
                type: 'warning',
                confirmButtonColor: '#dd4b39',
                confirmButtonText: "Đóng",
            })
        } else {
            startDate = moment(startDate).format('YYYY-MM-DD');
            startDate = new Date(startDate).getTime();

            endDate = moment(endDate).format('YYYY-MM-DD');
            endDate = new Date(endDate).getTime();

            let checkDateRange = new Date(addLogTimeDate).getTime();

            // check xem thời gian bấm giờ nằm trong khoản thời gian bắt đầu và thời gian kết thúc của công việc
            if (!(checkDateRange >= startDate && checkDateRange <= endDate)) {
                Swal.fire({
                    title: 'Thời gian bấm giờ phải trong khoảng thời gian làm việc',
                    type: 'warning',
                    confirmButtonColor: '#dd4b39',
                    confirmButtonText: "Đóng",
                })
            }
            else {
                // Check thời gian kết thúc phải sau thời gian bắt đầu
                if (!checkValidateDate(startAt, stopAt)) {
                    Swal.fire({
                        title: 'Thời gian kết thúc phải sau thời gian bắt đầu',
                        type: 'warning',
                        confirmButtonColor: '#dd4b39',
                        confirmButtonText: "Đóng",
                    })
                } else {
                    props.stopTimer(performtasks.task._id, timer);
                    setState({
                        ...state,
                        showBoxAddLogTimer: false,
                        addLogDescription: "",
                    })
                }
            }
        }
    }

    function formatDate(date) {
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

    const isFormValidated = () => {
        const { addLogTimeDate, addLogStartTime, addLogEndTime, checkDateAddLog } = state;
        const { translate } = props;

        if (!ValidationHelper.validateEmpty(translate, addLogTimeDate).status
            || !ValidationHelper.validateEmpty(translate, addLogStartTime).status
            || !ValidationHelper.validateEmpty(translate, addLogEndTime).status || checkDateAddLog)
            return false;
        return true;
    }


    const togglePopupApproveAllAction = () => {
        setState({
            ...state,
            showPopupApproveAllAction: !state.showPopupApproveAllAction,
        })
    }

    const setValueRatingApproveAll = (value) => {
        setState({
            ...state,
            ratingAll: value
        })
    }

    const setActionImportanceLevelAll = (value) => {
        setState({
            ...state,
            actionImportanceLevelAll: value
        })
    }

    const evaluationAllTaskAction = (taskId, taskActions) => {
        console.log('taskActions', taskActions)
        const { actionImportanceLevelAll, ratingAll, evaluations } = state
        let evaluation = [], showEvaluations = [];

        taskActions.forEach((obj, index) => {
            evaluation = [...evaluation, {
                actionId: obj._id,
                role: 'accountable',
                rating: ratingAll ?? 0,
                actionImportanceLevel: actionImportanceLevelAll ?? 10
            }]
            showEvaluations = [...showEvaluations, obj._id]
        })
        let newEvaluationState = evaluations
        Object.keys(newEvaluationState).forEach((key) => {
            newEvaluationState[key].actionImportanceLevel = actionImportanceLevelAll
            newEvaluationState[key].rating = ratingAll
        })

        setState({
            ...state,
            showEvaluations,
            showPopupApproveAllAction: !state.showPopupApproveAllAction,
            evaluations: newEvaluationState

        })
        hover1["all-action"] = 0;
        props.evaluationAllAction(taskId, evaluation)

    }

    const handleShowTime = (timeSheetLog) => {
        if (timeSheetLog && timeSheetLog.length > 0) {
            timeSheetLog = timeSheetLog.filter(x => x.acceptLog === true);
            const totalDuration = timeSheetLog.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.duration;
            }, 0);
            return convertTime(totalDuration);
        } else {
            return;
        }
    }

    const getCreatorId = (creator) => {
        if (!creator)
            return
        if (creator && typeof (creator) === 'object') return creator._id;
        else return creator;
    }

    const showDetailTimer = (nameAction, timeSheetLogs) => {
        nameAction = htmlToText(nameAction);
        let result = [];
        timeSheetLogs.reduce((res, value) => {
            const creatorId = getCreatorId(value?.creator);

            if (!res[creatorId]) {
                res[creatorId] = { id: creatorId, duration: 0, creatorName: value.creator.name };
                result.push(res[creatorId]);
            }
            res[creatorId].duration += value.duration;
            return res;
        }, {});

        Swal.fire({
            html: `<div style="max-width: 100%; max-height: 100%" > 
                <h4 style="margin-bottom: 15px">Thời gian bấm giờ cho hoạt động "<strong>${nameAction}</strong>"</h4>` +
                `<ol>${result.map(o => (
                    `<li style="margin-bottom: 7px">${o.creatorName}: ${convertTime(o.duration)}</li>`
                )).join(" ")} </ol>`
                +
                `<div>`,

            confirmButtonText: `Đồng ý`,
        })
    }

    const showFilePreview = async (data) => {
        await setState({
            currentFilepri: data,
        });
        window.$('#modal-file-preview').modal('show');
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

    let task, informations, statusTask, documents, actionComments, taskComments, logTimer, logs;
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

    switch (state.filterLogAutoStopped) {
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
    console.log("state", state)
    console.log("hover1", hover1)
    return (
        <div>
            {
                state.currentFilepri &&
                <FilePreview
                    file={state.currentFilepri}
                />
            }
            <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none" }}>
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#taskAction" onClick={() => handleChangeContent("taskAction")} data-toggle="tab">{translate("task.task_perform.actions")} ({taskActions && taskActions.length})</a></li>
                    <li><a href="#taskComment" onClick={() => handleChangeContent("actionComment")} data-toggle="tab">{translate("task.task_perform.communication")} ({taskComments && taskComments.length})</a></li>
                    <li><a href="#documentTask" onClick={() => handleChangeContent("documentTask")} data-toggle="tab">{translate("task.task_perform.documents")} ({documents && documents.length})</a></li>
                    <li><a href="#logTimer" onClick={() => handleChangeContent("logTimer")} data-toggle="tab">{translate("task.task_perform.timesheetlogs")} ({logTimer && logTimer.length})</a></li>
                    <li><a href="#subTask" onClick={() => handleChangeContent("subTask")} data-toggle="tab">{translate("task.task_perform.subtasks")} ({subtasks && subtasks.length})</a></li>
                    <li><a href="#historyLog" onClick={() => handleChangeContent("historyLog")} data-toggle="tab">{translate("task.task_perform.change_history")} ({logs && logs.length})</a></li>
                    {/* Tab quy trình cho công việc theo quy trình */}
                    {(task && task.process) && <li><a href="#process" onClick={() => handleChangeContent("process")} data-toggle="tab">{translate("task.task_perform.change_process")} </a></li>}

                    {/** Điều kiện hiển thị tab dữ liệu vào */
                        task && task.preceedingTasks && task.preceedingTasks.length !== 0 &&
                        <li><a href="#incoming-data" onClick={() => handleChangeContent("incoming-data")} data-toggle="tab">{translate("task.task_perform.change_incoming")}</a></li>
                    }

                    {/** Điều kiện hiển thị tab dữ liệu ra */
                        task && task.followingTasks && task.followingTasks.length !== 0 &&
                        <li><a href="#outgoing-data" onClick={() => handleChangeContent("outgoing-data")} data-toggle="tab">{translate("task.task_perform.change_outgoing")}</a></li>
                    }
                </ul>
                <div className="tab-content">
                    <div className={selected === "taskAction" ? "active tab-pane" : "tab-pane"} id="taskAction">

                        {/* Thêm hoạt động cho công việc*/}
                        {role === "responsible" && task && !showSort &&
                            <React.Fragment  >
                                <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="user avatar" />
                                <ContentMaker
                                    idQuill={`add-action-${id}`}
                                    inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                                    onFilesChange={onActionFilesChange}
                                    onFilesError={onFilesError}
                                    files={newAction.files}
                                    text={newAction.descriptionDefault}
                                    placeholder={role === "responsible" ? translate("task.task_perform.result") : translate("task.task_perform.enter_action")}
                                    submitButtonText={role === "responsible" ? translate("general.add") : translate("task.task_perform.create_action")}
                                    onTextChange={(value, imgs) => {
                                        setState(state => {
                                            return { ...state, newAction: { ...state.newAction, description: value, descriptionDefault: null } }
                                        })
                                    }}
                                    onSubmit={(e) => { submitAction(task._id, taskActions.length) }}
                                />
                            </React.Fragment>
                        }


                        {typeof taskActions !== 'undefined' && taskActions.length !== 0 ?
                            <ShowMoreShowLess
                                id={`description${id}`}
                                classShowMoreLess='tool-level1'
                                styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                            >
                                {
                                    // Hiển thị hoạt động của công việc
                                    (taskActions).map((item, index) => {
                                        let listImage = item.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
                                        return (
                                            <div key={item._id} className={index > 3 ? "hide-component" : ""}>
                                                {item.creator ?
                                                    <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + item.creator.avatar)} alt="User Image" /> :
                                                    <div className="user-img-level1" />
                                                }
                                                {editAction !== item._id && // khi chỉnh sửa thì ẩn action hiện tại đi
                                                    <React.Fragment>
                                                        <div className="content-level1" data-width="100%">
                                                            {/* Tên người tạo hoạt động */}
                                                            <div style={{ display: 'flex', fontWeight: 'bold', justifyContent: 'space-between' }}>
                                                                {
                                                                    item.creator && <a style={{ cursor: "pointer" }}>{item.creator?.name} </a>
                                                                }
                                                                {
                                                                    item.creator && <a className="pull-right" style={{ cursor: 'pointer' }} onClick={() => showDetailTimer(item.description, item.timesheetLogs)}>{handleShowTime(item.timesheetLogs)}</a>
                                                                }
                                                            </div>
                                                            <div>
                                                                {
                                                                    item.name && <b style={{ display: 'flex', marginTop: '4px' }}>{item.name} </b>
                                                                }
                                                                {item?.description?.split('\n')?.map((item, idx) => (
                                                                    <div key={idx}>
                                                                        {parse(item)}
                                                                    </div>
                                                                ))
                                                                }
                                                            </div>

                                                            <div className="btn-group pull-right">
                                                                {(role === 'responsible' && item.creator && showSort === false && task) &&
                                                                    <React.Fragment>
                                                                        <span data-toggle="dropdown">
                                                                            <i className="fa fa-ellipsis-h"></i>
                                                                        </span>
                                                                        <ul className="dropdown-menu">
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => handleEditAction(item)} >{translate("task.task_perform.edit_action")}</a></li>
                                                                            <li><a style={{ cursor: "pointer" }} onClick={() => props.deleteTaskAction(item._id, task._id)} >{translate("task.task_perform.delete_action")}</a></li>
                                                                        </ul>
                                                                    </React.Fragment>
                                                                }
                                                                {showSort === true && (role === 'responsible' || role === 'accountable') &&
                                                                    <div className="sort-action">
                                                                        {index !== 0 && <a style={{ marginTop: index === taskActions.length - 1 ? "10px" : "0px" }} onClick={() => sort(index, "up")}><i className="glyphicon glyphicon-arrow-up"></i> </a>}
                                                                        {index !== taskActions.length - 1 && <a style={{ marginTop: index === 0 ? "13px" : "0px" }} onClick={() => sort(index, "down")}><i className="glyphicon glyphicon-arrow-down"></i> </a>}
                                                                    </div>
                                                                }

                                                            </div>
                                                        </div>

                                                        {/* Các file đính kèm */}
                                                        {!showSort && task && <ul className="list-inline tool-level1">
                                                            {role === "accountable" ?
                                                                <ModalEditDateCreatedAction data={item} taskId={task._id} saveChangeDateCreatedAction={handleSaveChangeDateAction} /> :
                                                                <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                            }
                                                            <li>{item.mandatory && !item.creator && <b className="text-sm">{translate("task.task_perform.mandatory_action")}</b>}</li>
                                                            {((item.creator === undefined || item.creator === null) && role === "responsible") &&
                                                                <li><a style={{ cursor: "pointer" }} className="text-green text-sm" onClick={(e) => handleConfirmAction(e, item._id, currentUser, task?._id)}><i className="fa fa-check-circle" aria-hidden="true"></i> {translate("task.task_perform.confirm_action")}</a></li>}

                                                            {/* Các chức năng tương tác với action */}
                                                            {item.creator &&
                                                                <React.Fragment>
                                                                    {item.evaluations && <li><a style={{ cursor: "pointer", pointerEvents: item.evaluations.length > 0 ? "" : "none" }} className="link-black text-sm" onClick={() => { handleShowEvaluations(item._id) }}><i className="fa fa-thumbs-o-up margin-r-5"></i>{translate("task.task_perform.evaluation")} ({item.evaluations && item.evaluations.length})</a></li>}
                                                                    {item.files && item.files.length > 0 && // Chỉ hiện show file khi có file đính kèm
                                                                        <li style={{ display: "inline-table" }}>
                                                                            <a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowFile(item._id)}><i className="fa fa-paperclip" aria-hidden="true"></i> {translate("task.task_perform.file_attach")} ({item.files && item.files.length})</a>
                                                                        </li>
                                                                    }
                                                                    <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate("task.task_perform.comment")} ({item.comments.length}) &nbsp;</a></li>
                                                                </React.Fragment>
                                                            }
                                                        </ul>}

                                                        {!showSort && task && <ul className="list-inline tool-level1">
                                                            {item.creator &&
                                                                <React.Fragment>
                                                                    {(role === "accountable" || role === "consulted" || role === "creator" || role === "informed") &&
                                                                        <>
                                                                            <div className="form-group text-sm">
                                                                                {/* Code hiển thị: Nếu chưa chọn điểm đánh giá mới, hiển thị điểm đánh giá trong DB. Nếu chưa đánh giá, hiển thị -- */}
                                                                                <span style={{ marginRight: "5px" }}>Điểm đánh giá: <strong>{evaluations?.[item?._id]?.rating ?? (item?.rating !== -1 ? item?.rating : "--")}/10</strong></span>
                                                                                <Rating
                                                                                    fractions={2}
                                                                                    stop={10}
                                                                                    emptySymbol="fa fa-star-o fa-2x"
                                                                                    fullSymbol="fa fa-star fa-2x"
                                                                                    initialRating={evaluations?.[item._id]?.rating ?? item?.rating}
                                                                                    onClick={(value) => {
                                                                                        setValueRating(item._id, value);
                                                                                    }}
                                                                                    onHover={(value) => {
                                                                                        setHover(item._id, value, "rating")
                                                                                    }}
                                                                                />
                                                                                <div style={{ display: "inline", marginLeft: "5px" }}>{hover1?.[`${item?._id}-rating`]}</div>
                                                                            </div>
                                                                            <div className="form-group text-sm">
                                                                                {/* Code hiển thị: Nếu chưa chọn độ quan trọng mới, hiển thị độ quan trọng trong DB */}
                                                                                <span style={{ marginRight: "5px" }}>Độ quan trọng: <strong>{evaluations?.[item?._id]?.actionImportanceLevel ?? item?.actionImportanceLevel}/10</strong></span>
                                                                                <Rating
                                                                                    fractions={2}
                                                                                    stop={10}
                                                                                    emptySymbol="fa fa-star-o fa-2x"
                                                                                    fullSymbol="fa fa-star fa-2x"
                                                                                    initialRating={evaluations?.[item._id]?.actionImportanceLevel ?? item?.actionImportanceLevel}
                                                                                    onClick={(value) => {
                                                                                        setActionImportanceLevel(item._id, value)
                                                                                    }}
                                                                                    onHover={(value) => {
                                                                                        setHover(item._id, value, "actionImportanceLevel")
                                                                                    }}
                                                                                />
                                                                                <div style={{ display: "inline", marginLeft: "5px" }}>{hover1?.[`${item?._id}-actionImportanceLevel`]}</div>
                                                                            </div>
                                                                            <a style={{ cursor: "pointer", fontWeight: '600' }} onClick={() => evaluationTaskAction(item, task._id, role, 1)}>Gửi đánh giá</a>
                                                                        </>
                                                                    }
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
                                                                                Array.isArray(item?.evaluations) &&
                                                                                item.evaluations.map((element, index) => {
                                                                                    return (
                                                                                        <p key={index}>
                                                                                            <b> {element?.creator?.name} </b>
                                                                                            {getRoleNameInTask(element?.role)}
                                                                                            <span> Điểm đánh giá:<span className="text-red"> {element?.rating}/10</span> - Độ quan trọng:<span className="text-red"> {element?.actionImportanceLevel}/10</span></span>
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
                                                                                    <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
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
                                                    </React.Fragment>
                                                }
                                                {/*Chỉnh sửa nội dung hoạt động của công việc */}
                                                {editAction === item._id && task &&
                                                    <React.Fragment>
                                                        <div>
                                                            <ContentMaker
                                                                idQuill={`edit-action-${item._id}`}
                                                                inputCssClass="text-input-level1" controlCssClass="tool-level2 row"
                                                                onFilesChange={onEditActionFilesChange}
                                                                onFilesError={onFilesError}
                                                                files={newActionEdited.files}
                                                                text={newActionEdited.descriptionDefault}
                                                                submitButtonText={translate("task.task_perform.save_edit")}
                                                                cancelButtonText={translate("task.task_perform.cancel")}
                                                                handleEdit={(item) => handleEditAction(item)}
                                                                onTextChange={(value, imgs) => {
                                                                    setState(state => {
                                                                        return { ...state, newActionEdited: { ...state.newActionEdited, description: value } }
                                                                    })
                                                                }}
                                                                onSubmit={(e) => { handleSaveEditAction(e, item._id, item.description, task._id) }}
                                                            />

                                                            {item.files.length > 0 &&
                                                                <div className="tool-level1" style={{ marginTop: -15 }}>
                                                                    {item.files.map((file, index) => {
                                                                        return <div key={index}>
                                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { handleDeleteFile(file._id, file.name, item._id, "action") }}><i className="fa fa-times"></i></a>
                                                                        </div>
                                                                    })}
                                                                </div>}
                                                        </div>
                                                    </React.Fragment>
                                                }

                                                {/* Hiển thị bình luận cho hoạt động */}
                                                {!showSort && task && showChildComment.some(obj => obj === item._id) &&
                                                    <div>
                                                        {item.comments.map(child => {
                                                            let listImage = child.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
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
                                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => handleEditActionComment(child)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => props.deleteActionComment(task._id, item._id, child._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                                    </ul>
                                                                                </div>}
                                                                        </div>
                                                                        <ul className="list-inline tool-level2">
                                                                            <li><span className="text-sm">{<DateTimeConverter dateTime={child.createdAt} />}</span></li>
                                                                            {child.files && child.files.length > 0 &&
                                                                                <li style={{ display: "inline-table" }}>
                                                                                    <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({child.files && child.files.length})</i></b></a></div>
                                                                                </li>
                                                                            }
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
                                                                                                <div>
                                                                                                    <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
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
                                                                                onFilesChange={onEditCommentOfActionFilesChange}
                                                                                onFilesError={onFilesError}
                                                                                files={newCommentOfActionEdited.files}
                                                                                text={newCommentOfActionEdited.descriptionDefault}
                                                                                submitButtonText={translate("task.task_perform.save_edit")}
                                                                                cancelButtonText={translate("task.task_perform.cancel")}
                                                                                handleEdit={(e) => handleEditActionComment(e)}
                                                                                onTextChange={(value, imgs) => {
                                                                                    setState(state => {
                                                                                        return { ...state, newCommentOfActionEdited: { ...state.newCommentOfActionEdited, description: value } }
                                                                                    })
                                                                                }}
                                                                                onSubmit={(e) => { handleSaveEditActionComment(e, task._id, item._id, child._id, child.description) }}
                                                                            />
                                                                            {/* Hiện file đã tải lên */}
                                                                            {child.files.length > 0 &&
                                                                                <div className="tool-level2" style={{ marginTop: -15 }}>
                                                                                    {child.files.map((file, index) => {
                                                                                        return <div key={index}>
                                                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { handleDeleteFile(file._id, file.name, item._id, "commentofaction") }}><i className="fa fa-times"></i></a>
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
                                                                onFilesChange={(files) => onCommentFilesChange(files, item._id)}
                                                                onFilesError={onFilesError}
                                                                files={newCommentOfAction[`${item._id}`]?.files}
                                                                text={newCommentOfAction[`${item._id}`]?.descriptionDefault}
                                                                placeholder={translate("task.task_perform.enter_comment_action")}
                                                                submitButtonText={translate("task.task_perform.create_comment_action")}
                                                                onTextChange={(value, imgs) => {
                                                                    setState(state => {
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
                                                                onSubmit={(e) => { submitComment(item._id, task._id) }}
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
                        {/* Sắp xếo hoạt động CV*/}
                        {task && showSort ?
                            <div className="row" style={{ marginTop: 20 }}>
                                <div className="col-xs-6">
                                    <button type="button" className={`btn btn-block`} onClick={() => cancelSort()}>Hủy</button>
                                </div>
                                <div className="col-xs-6">
                                    <button type="button" className={`btn btn-block`} onClick={() => saveSort(task._id)}>Lưu</button>
                                </div>
                            </div>
                            :
                            <React.Fragment>
                                {
                                    // Đánh giá tất cả các hoạt động CV
                                    state.showPopupApproveAllAction ?
                                        (role === "accountable") && taskActions.length > 1 &&
                                        <div style={{ borderColor: "#ddd", marginTop: 20 }}>
                                            <button style={{ marginTop: 7, marginBottom: 7 }} className="btn btn-block btn-default btn-sm" onClick={() => togglePopupApproveAllAction()}>Hủy đánh giá tất cả các hoạt động</button>

                                            <div className="form-group text-sm">
                                                <span style={{ marginRight: "5px" }}>Điểm đánh giá: <strong>{ratingAll ?? 0}/10</strong></span>
                                                <Rating
                                                    fractions={2}
                                                    stop={10}
                                                    emptySymbol="fa fa-star-o fa-2x"
                                                    fullSymbol="fa fa-star fa-2x"
                                                    initialRating={ratingAll ?? 0}
                                                    onClick={(value) => {
                                                        setValueRatingApproveAll(value);
                                                    }}
                                                    onHover={(value) => {
                                                        setHover('all-action', value, "rating")
                                                    }}
                                                />
                                                <div style={{ display: "inline", marginLeft: "5px" }}>{hover1?.['all-action-rating']}</div>
                                            </div>

                                            <div className="form-group text-sm">
                                                <span style={{ marginRight: "5px" }}>Độ quan trọng: <strong>{actionImportanceLevelAll ?? 10}/10</strong></span>
                                                <Rating
                                                    fractions={2}
                                                    stop={10}
                                                    emptySymbol="fa fa-star-o fa-2x"
                                                    fullSymbol="fa fa-star fa-2x"
                                                    initialRating={actionImportanceLevelAll ?? 10}
                                                    onClick={(value) => {
                                                        setActionImportanceLevelAll(value)
                                                    }}
                                                    onHover={(value) => {
                                                        setHover('all-action', value, "actionImportanceLevel")
                                                    }}
                                                />
                                                <div style={{ display: "inline", marginLeft: "5px" }}>{hover1?.['all-action-actionImportanceLevel']}</div>
                                            </div>
                                            <button style={{ marginTop: 7, marginBottom: 7 }} className="btn btn-block btn-default btn-sm" onClick={() => evaluationAllTaskAction(task._id, taskActions)}>Gửi đánh giá tất cả các hoạt động</button>
                                        </div>
                                        : (role === "accountable") && taskActions.length > 1 && <button className="btn btn-block btn-success btn-sm" onClick={() => togglePopupApproveAllAction()}>Đánh giá tất cả hoạt động</button>
                                }
                                {(role === "responsible" || role === "accountable") && taskActions.length > 1 && <button className="btn btn-block btn-default btn-sm" onClick={() => handleShowSort()}>Sắp xếp hoạt động</button>}
                            </React.Fragment>
                        }
                    </div>

                    {/* Chuyển qua tab trao đổi */}
                    <div className={selected === "taskComment" ? "active tab-pane" : "tab-pane"} id="taskComment">

                        {/* Thêm bình luận cho công việc*/}
                        <img className="user-img-level1" src={(process.env.REACT_APP_SERVER + auth.user.avatar)} alt="User Image" />
                        <ContentMaker
                            idQuill={`add-comment-task-${id}`}
                            inputCssClass="text-input-level1" controlCssClass="tool-level1 row"
                            onFilesChange={onTaskCommentFilesChange}
                            onFilesError={onFilesError}
                            files={newTaskComment.files}
                            text={newTaskComment.descriptionDefault}
                            placeholder={translate("task.task_perform.enter_comment")}
                            submitButtonText={translate("task.task_perform.create_comment")}
                            onTextChange={(value, imgs) => {
                                setState(state => {
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
                            onSubmit={(e) => { submitTaskComment(task?._id) }}
                        />

                        {task && typeof taskComments !== 'undefined' && taskComments.length !== 0 ?
                            <ShowMoreShowLess
                                id={`taskComment${id}`}
                                classShowMoreLess='tool-level1'
                                styleShowMoreLess={{ display: "inline-block", marginBotton: 15 }}
                            >
                                {
                                    taskComments.map((item, index) => {
                                        let listImage = item.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
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
                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => handleEditTaskComment(item)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => props.deleteTaskComment(item._id, task._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                    </ul>
                                                                </div>}
                                                        </div>


                                                        <ul className="list-inline tool-level1">
                                                            <li><span className="text-sm">{<DateTimeConverter dateTime={item.createdAt} />}</span></li>
                                                            <li><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowChildComment(item._id)}><i className="fa fa-comments-o margin-r-5"></i> {translate("task.task_perform.comment")} ({item.comments.length}) &nbsp;</a></li>
                                                            {item.files.length > 0 &&
                                                                <React.Fragment>
                                                                    <li style={{ display: "inline-table" }}>
                                                                        <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowFile(item._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({item.files && item.files.length})</i></b></a> </div></li>
                                                                    {showFile.some(obj => obj === item._id) &&
                                                                        <li style={{ display: "inline-table" }}>{item.files.map((elem, index) => {
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
                                                                                    : <div>
                                                                                        <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
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
                                                                onFilesChange={onEditTaskCommentFilesChange}
                                                                onFilesError={onFilesError}
                                                                files={newTaskCommentEdited.files}
                                                                text={newTaskCommentEdited.descriptionDefault}
                                                                submitButtonText={translate("task.task_perform.save_edit")}
                                                                cancelButtonText={translate("task.task_perform.cancel")}
                                                                handleEdit={(e) => handleEditTaskComment(e)}
                                                                onTextChange={(value, imgs) => {
                                                                    setState(state => {
                                                                        return { ...state, newTaskCommentEdited: { ...state.newTaskCommentEdited, description: value } }
                                                                    })
                                                                }}
                                                                onSubmit={(e) => { handleSaveEditTaskComment(e, task._id, item._id, item.description) }}
                                                            />
                                                            {/* Hiện file đã tải lên */}
                                                            {item.files.length > 0 &&
                                                                <div className="tool-level1" style={{ marginTop: -15 }}>
                                                                    {item.files.map((file, index) => {
                                                                        return <div key={index} >
                                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { handleDeleteFile(file._id, file.name, item._id, "taskcomment") }}><i className="fa fa-times"></i></a>
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
                                                            let listImage = child.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
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
                                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => handleEditCommentOfTaskComment(child)} >{translate("task.task_perform.edit_comment")}</a></li>
                                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => props.deleteCommentOfTaskComment(child._id, task._id)} >{translate("task.task_perform.delete_comment")}</a></li>
                                                                                    </ul>
                                                                                </div>}
                                                                        </div>
                                                                        <ul className="list-inline tool-level2">
                                                                            <li><span className="text-sm">{<DateTimeConverter dateTime={child.createdAt} />}</span></li>
                                                                            {child.files.length > 0 &&
                                                                                <React.Fragment>
                                                                                    <li style={{ display: "inline-table" }}>
                                                                                        <div><a style={{ cursor: "pointer" }} className="link-black text-sm" onClick={() => handleShowFile(child._id)}><b><i className="fa fa-paperclip" aria-hidden="true"> {translate("task.task_perform.file_attach")} ({child.files && child.files.length})</i></b></a></div></li>
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
                                                                                                        <div>
                                                                                                            <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
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

                                                                {/* Sửa bình luận của bình luận */}
                                                                {editCommentOfTaskComment === child._id &&
                                                                    <React.Fragment>
                                                                        <div>
                                                                            <ContentMaker
                                                                                idQuill={`edit-child-comment-${child._id}`}
                                                                                inputCssClass="text-input-level2" controlCssClass="tool-level2 row"
                                                                                onFilesChange={onEditCommentOfTaskCommentFilesChange}
                                                                                onFilesError={onFilesError}
                                                                                files={newCommentOfTaskCommentEdited.files}
                                                                                text={newCommentOfTaskCommentEdited.descriptionDefault}
                                                                                submitButtonText={translate("task.task_perform.save_edit")}
                                                                                cancelButtonText={translate("task.task_perform.cancel")}
                                                                                handleEdit={(e) => handleEditCommentOfTaskComment(e)}
                                                                                onTextChange={(value, imgs) => {
                                                                                    setState(state => {
                                                                                        return { ...state, newCommentOfTaskCommentEdited: { ...state.newCommentOfTaskCommentEdited, description: value } }
                                                                                    })
                                                                                }}
                                                                                onSubmit={(e) => { handleSaveEditCommentOfTaskComment(e, child._id, task._id, child.description) }}
                                                                            />
                                                                            {/* Hiện file đã tải lên */}
                                                                            {child.files.length > 0 &&
                                                                                <div className="tool-level2" style={{ marginTop: -15 }}>
                                                                                    {child.files.map(file => {
                                                                                        return <div>
                                                                                            <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { handleDeleteFile(file._id, file.name, item._id, "commentoftaskcomment") }}><i className="fa fa-times"></i></a>
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
                                                                onFilesChange={(files) => onCommentOfTaskCommentFilesChange(item._id, files)}
                                                                onFilesError={onFilesError}
                                                                files={newCommentOfTaskComment[`${item._id}`]?.files}
                                                                text={newCommentOfTaskComment[`${item._id}`]?.descriptionDefault}
                                                                placeholder={translate("task.task_perform.enter_comment")}
                                                                submitButtonText={translate("task.task_perform.create_comment")}
                                                                onTextChange={(value, imgs) => {
                                                                    setState(state => {
                                                                        state.newCommentOfTaskComment[`${item._id}`] = {
                                                                            ...state.newCommentOfTaskComment[`${item._id}`],
                                                                            description: value,
                                                                            creator: currentUser,
                                                                            descriptionDefault: null
                                                                        }
                                                                        return { ...state }
                                                                    })
                                                                }}
                                                                onSubmit={(e) => { submitCommentOfTaskComment(item._id, task._id) }}
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
                                            let listImage = item.files.map((elem) => isImage(elem.name) ? elem.url : -1).filter(url => url !== -1);
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
                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => handleEditFileTask(item)} >{translate("task.task_perform.edit")}</a></li>
                                                                        <li><a style={{ cursor: "pointer" }} onClick={() => props.deleteDocument(item._id, task._id)} >{translate("task.task_perform.delete")}</a></li>
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
                                                                    <a style={{ cursor: 'pointer' }} onClick={() => { handleShowFile(item._id) }}>Ẩn bớt<i className='fa fa-angle-double-up'></i></a>
                                                                    :
                                                                    <a style={{ cursor: 'pointer' }} onClick={() => { handleShowFile(item._id) }}>Hiển thị {item?.files?.length} tài liệu &nbsp; <i className='fa fa-angle-double-down'></i> </a>
                                                                }
                                                            </div>
                                                            {showFile.some(obj => obj === item._id) &&
                                                                <React.Fragment>
                                                                    <div>
                                                                        {item.files.map((elem, index) => {
                                                                            return (
                                                                                <div key={index} className="show-files-task">
                                                                                    {isImage(elem.name) ?
                                                                                        <ApiImage
                                                                                            listImage={listImage}
                                                                                            className="attachment-img files-attach"
                                                                                            style={{ marginTop: "5px" }}
                                                                                            src={elem.url}
                                                                                            file={elem}
                                                                                            requestDownloadFile={requestDownloadFile}
                                                                                        />
                                                                                        : <div>
                                                                                            <a style={{ cursor: "pointer" }} style={{ marginTop: "2px" }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}> {elem.name}</a>
                                                                                            <a href="#" onClick={() => showFilePreview(elem && elem.url)}>
                                                                                                <u>{elem && checkTypeFile(elem.url) ?
                                                                                                    <i className="fa fa-eye"></i> : ""}</u>
                                                                                            </a>
                                                                                        </div>
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
                                                                    onFilesChange={onEditFileTask}
                                                                    onFilesError={onFilesError}
                                                                    files={fileTaskEdited.files}
                                                                    text={fileTaskEdited.descriptionDefault}
                                                                    submitButtonText={translate("task.task_perform.save_edit")}
                                                                    cancelButtonText={translate("task.task_perform.cancel")}
                                                                    handleEdit={(e) => handleEditFileTask(e)}
                                                                    onTextChange={(value, imgs) => {
                                                                        setState(state => {
                                                                            return { ...state, fileTaskEdited: { ...state.fileTaskEdited, description: value } }
                                                                        })
                                                                    }}
                                                                    onSubmit={(e) => { handleSaveEditTaskFile(e, item.description, item._id, task._id) }}
                                                                />
                                                                {item.files.length > 0 &&
                                                                    <div className="tool-level1" style={{ marginTop: -15 }}>
                                                                        {item.files.map(file => {
                                                                            return <div>
                                                                                <a style={{ cursor: "pointer" }}>{file.name} &nbsp;</a><a style={{ cursor: "pointer" }} className="link-black text-sm btn-box-tool" onClick={() => { handleDeleteFile(file._id, file.name, item._id, "task") }}><i className="fa fa-times"></i></a>
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
                                    idQuill={`upload-file-${id}`}
                                    inputCssClass="text-input-level1" controlCssClass="tool-level1"
                                    onFilesChange={onTaskFilesChange}
                                    onFilesError={onFilesError}
                                    files={taskFiles.files}
                                    text={taskFiles.descriptionDefault}
                                    placeholder={translate("task.task_perform.enter_description")}
                                    submitButtonText={translate("task.task_perform.create_document")}
                                    onTextChange={(value, imgs) => {
                                        setState(state => {
                                            return { ...state, taskFiles: { ...state.taskFiles, description: value, descriptionDefault: null } }

                                        })
                                    }}
                                    disableSubmit={true}
                                    onSubmit={(e) => { handleUploadFile(task?._id, currentUser) }}
                                />
                            </div>
                        </React.Fragment>
                    </div>

                    {/* Chuyển qua tab công việc liên quan */}
                    <div className={selected === "subTask" ? "active tab-pane" : "tab-pane"} id="subTask">
                        <SubTaskTab
                            id={state.id}
                        />
                    </div>

                    {/* Chuyển qua tab Bấm giờ */}
                    <div className={selected === "logTimer" ? "active tab-pane" : "tab-pane"} id="logTimer">
                        <div className="row" style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label>Hình thức bấm giờ</label>
                                    <select className="form-control" value={state.filterLogAutoStopped} onChange={filterLogAutoStopped}>
                                        <option value="all">Tất cả</option>
                                        <option value="hand">Bấm giờ</option>
                                        <option value="auto">Bấm hẹn giờ</option>
                                        <option value="addlog">Bấm bù giờ</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <button className="btn btn-success" style={{ float: 'right' }}
                                    disabled={showBoxAddLogTimer}
                                    onClick={() => {
                                        setState({
                                            ...state,
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
                                                onChange={handleChangeDateAddLog}
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
                                                        onChange={handleChangeDateAddStartTime}
                                                        getDefaultValue={getDefaultValueStartTime}
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
                                                        onChange={handleChangeDateAddEndTime}
                                                        getDefaultValue={getDefaultValueEndTime}
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
                                                onChange={handleChangeAddLogDescription}
                                            />
                                        </div>
                                        <div>
                                            <button className="btn btn-success" style={{ marginRight: '10px' }} onClick={() => saveAddLogTime()} disabled={!isFormValidated()} >Lưu</button>
                                            <button className="btn btn-danger" onClick={() => {
                                                setState({
                                                    ...state,
                                                    showBoxAddLogTimer: false,
                                                    addLogDescription: "",
                                                })
                                            }}>Hủy</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {logTimer &&
                            <ShowMoreShowLess
                                id={`logTimer${id}`}
                                styleShowMoreLess={{ display: "inline-block", marginBottom: 15, marginTop: 15 }}
                            >
                                {logTimer.map((item, index) =>
                                    <React.Fragment key={index}>
                                        {item.stoppedAt &&
                                            <div key={item._id} className={`item-box ${index > 3 ? "hide-component" : ""}`}>
                                                <h3 className={`pull-right ${item.acceptLog ? 'text-green' : 'text-red'}`}>{convertTime(item.duration)}</h3>
                                                <a style={{ fontWeight: 700, cursor: "pointer" }}>{item.creator?.name} </a>
                                                <div>
                                                    <i className="fa fa-clock-o"> </i> {moment(item.startedAt).format("DD/MM/YYYY HH:mm:ss")}{" - "}
                                                    <i className="fa fa-clock-o"> </i> {moment(item.stoppedAt).format("DD/MM/YYYY HH:mm:ss")})
                                                </div>
                                                <div>
                                                    <i style={{ marginRight: '5px' }} className={`${item.autoStopped === 1 ? 'text-green fa fa-hand-pointer-o' : (item.autoStopped === 2 ? 'text-red fa fa-clock-o' : 'text-red fa fa-plus')}`}>{item.autoStopped === 1 ? 'Bấm giờ' : (item.autoStopped === 2 ? 'Bấm hẹn giờ' : 'Bấm bù giờ')}</i>
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
                                                                                    props.editTimeSheetLog(state.id, item._id, {
                                                                                        acceptLog: false
                                                                                    })
                                                                                } :
                                                                                () => {
                                                                                    props.editTimeSheetLog(state.id, item._id, {
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
                            </ShowMoreShowLess>
                        }
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
    getTimerStatusTask: performTaskAction.getTimerStatusTask,
    editTaskComment: performTaskAction.editTaskComment,
    deleteTaskComment: performTaskAction.deleteTaskComment,
    createTaskComment: performTaskAction.createTaskComment,
    createCommentOfTaskComment: performTaskAction.createCommentOfTaskComment,
    editCommentOfTaskComment: performTaskAction.editCommentOfTaskComment,
    deleteCommentOfTaskComment: performTaskAction.deleteCommentOfTaskComment,
    evaluationAction: performTaskAction.evaluationAction,
    evaluationAllAction: performTaskAction.evaluationAllAction,
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

    refreshData: performTaskAction.refreshData,
};

const actionTab = connect(mapState, actionCreators)(withTranslate(ActionTab));
export { actionTab as ActionTab }

