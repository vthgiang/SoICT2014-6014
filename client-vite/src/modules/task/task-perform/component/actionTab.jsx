import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import Swal from 'sweetalert2'
import Rating from 'react-rating'
import moment from 'moment'
import 'moment/locale/vi'
import parse from 'html-react-parser'
import './actionTab.css'
import { htmlToText } from 'html-to-text'
import FilePreview from './FilePreview'
import { ContentMaker, DateTimeConverter, ApiImage, ShowMoreShowLess } from '../../../../common-components'

import { getStorage } from '../../../../config'

import { performTaskAction } from '../redux/actions'
import { AuthActions } from '../../../auth/redux/actions'
import { ModalEditDateCreatedAction } from './modalEditDateCreatedAction'
import { SubTaskTab } from './subTaskTab'
import { ViewProcess } from '../../task-process/component/task-process-management/viewProcess'
import { IncomingDataTab } from './incomingDataTab'
import { OutgoingDataTab } from './outgoingDataTab'
import ModalAddLogTime from './modalAddLogTime'
import { TaskOutputsTab } from './taskOutputs'

const getTaskOutputs = (data) => {
  const taskOutputsApproval = data?.filter((item) => item.status === 'approved')
  if (!data) {
    return '0'
  }
  if (data && data.length === 0) {
    return '0'
  }
  return `${taskOutputsApproval.length}/${data.length}`
}

function ActionTab(props) {
  const idUser = getStorage('userId')
  const { performtasks, notifications, user, auth, translate, role, id } = props

  const [state, setState] = useState(() => {
    const lang = getStorage('lang')
    moment.locale(lang)
    return {
      filterLogAutoStopped: 'all',
      taskActions: [],
      currentUser: idUser,
      selected: 'taskAction',
      comment: false,
      action: false,
      editComment: '',
      valueRating: 2.5,
      showSort: false,
      files: [],
      hover: {},
      taskFiles: {
        creator: idUser,
        description: '',
        files: []
      },
      editAction: '',
      editTaskComment: '',
      editCommentOfTaskComment: '',
      pauseTimer: false,
      showChildComment: [],
      showEvaluations: [],
      newAction: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newActionEdited: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newCommentOfAction: {
        creator: idUser,
        description: '',
        files: [],
        taskActionId: null,
        descriptionDefault: ''
      },
      newCommentOfActionEdited: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newTaskComment: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newTaskCommentEdited: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newCommentOfTaskComment: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newCommentOfTaskCommentEdited: {
        creator: idUser,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      showEdit: false,
      timer: {
        startTimer: '',
        stopTimer: null,
        user: idUser,
        time: 0
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
      descriptionFile: '',
      deleteFile: '',

      showPopupApproveAllAction: false
    }
  })
  const [hover1, setHover1] = useState({})
  const {
    showEvaluations,
    selected,
    comment,
    editComment,
    showChildComment,
    editAction,
    action,
    taskActions,
    editTaskComment,
    showEditTaskFile,
    evaluations,
    actionImportanceLevelAll,
    ratingAll,
    editCommentOfTaskComment,
    valueRating,
    currentUser,
    hover,
    fileTaskEdited,
    showSort,
    showFile,
    deleteFile,
    taskFiles,
    newActionEdited,
    newCommentOfActionEdited,
    newAction,
    newCommentOfAction,
    newTaskCommentEdited,
    newCommentOfTaskComment,
    newTaskComment,
    newCommentOfTaskCommentEdited,
    addLogStartTime,
    addLogEndTime
  } = state

  useEffect(() => {
    if (performtasks?.task && notifications?.associatedData?.value) {
      if (notifications.associatedData.dataType === 'realtime_tasks') {
        if (performtasks?.task._id === notifications.associatedData.value._id) {
          props.refreshData(notifications.associatedData.value, performtasks?.task)
        }
      }
      notifications.associatedData = {} // reset lại ...
    }
    notifications.associatedData = {} // reset lại ...
  }, [JSON.stringify(notifications?.associatedData?.value), JSON.stringify(performtasks?.task)])

  useEffect(() => {
    if (props.id) {
      if (props?.isProcess) {
        props.getAllPreceedingTasks(props.id)
      }
    }
  }, [props.id])

  useEffect(() => {
    if (performtasks?.task?.taskActions) {
      setState({
        ...state,
        taskActions: performtasks.task.taskActions
      })
    }
  }, [JSON.stringify(performtasks?.task?.taskActions)])

  const setHover = (id, value, type) => {
    if (type === 'rating') {
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
    } else if (isNaN(value)) {
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

    setState({
      ...state,
      hover: {
        ...state.hover,
        id: value
      }
    })
  }

  const setValueRating = (actionId, newValue) => {
    const newEvaluations = state.evaluations
    newEvaluations[actionId] = {
      ...newEvaluations[actionId],
      rating: newValue
    }
    setState({
      ...state,
      valueRating: newValue,
      evaluations: newEvaluations
    })
  }

  const setActionImportanceLevel = (actionId, value) => {
    const newEvaluations = state.evaluations
    newEvaluations[actionId] = {
      ...newEvaluations[actionId],
      actionImportanceLevel: value
    }
    setState((state) => {
      return {
        ...state,
        evaluations: newEvaluations
      }
    })
  }

  const handleDeleteActionEvaluation = (actionId, taskId, evaluationId) => {
    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa đánh giá ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: props.translate('general.no'),
      confirmButtonText: props.translate('general.yes')
    }).then((result) => {
      if (result.value) {
        props.deleteActionEvaluation(actionId, taskId, evaluationId)
      }
    })
  }

  const evaluationTaskAction = (evaAction, taskId, role, firstTime) => {
    const newEvaluations = state.evaluations
    const rating = newEvaluations?.[evaAction?._id]?.rating ?? evaAction?.rating
    newEvaluations[evaAction?._id] = {
      ...newEvaluations[evaAction?._id],
      rating: rating === -1 ? 0 : rating,
      actionImportanceLevel: newEvaluations?.[evaAction?._id]?.actionImportanceLevel ?? evaAction?.actionImportanceLevel,
      firstTime,
      type: 'evaluation',
      role
    }
    props.evaluationAction(evaAction?._id, taskId, newEvaluations?.[evaAction?._id])
    setState({
      ...state,
      showEvaluations: [...state.showEvaluations, evaAction?._id]
    })
  }

  const handleChangeContent = (content) => {
    setState({
      ...state,
      selected: content
    })
  }

  const handleShowChildComment = (id) => {
    let a
    if (state.showChildComment.some((obj) => obj === id)) {
      a = state.showChildComment.filter((x) => x !== id)
      setState({
        ...state,
        showChildComment: a
      })
    } else {
      setState({
        ...state,
        showChildComment: [...state.showChildComment, id]
      })
    }
  }
  const handleEditCommentOfTaskComment = (childComment) => {
    setState({
      ...state,
      editCommentOfTaskComment: childComment._id,
      newCommentOfTaskCommentEdited: {
        ...state.newCommentOfTaskCommentEdited,
        descriptionDefault: childComment.description
      }
    })
  }

  const submitComment = (actionId, taskId) => {
    let { newCommentOfAction, CommentOfActionFilePaste } = state
    const data = new FormData()
    if (actionId) {
      data.append('creator', newCommentOfAction[`${actionId}`]?.creator)
      data.append('description', newCommentOfAction[`${actionId}`]?.description)
      newCommentOfAction[`${actionId}`]?.files &&
        newCommentOfAction[`${actionId}`].files.forEach((x) => {
          data.append('files', x)
        })
      if (newCommentOfAction[`${actionId}`]?.description && newCommentOfAction[`${actionId}`]?.creator) {
        props.createActionComment(taskId, actionId, data)
      }
      newCommentOfAction[actionId] = {
        description: '',
        files: [],
        descriptionDefault: ''
      }
      CommentOfActionFilePaste = []
      setState((state) => {
        return {
          ...state,
          newCommentOfAction,
          CommentOfActionFilePaste
        }
      })
    }
  }

  // Thêm mới hoạt động
  const submitAction = (taskId, index) => {
    const { newAction } = state

    const data = new FormData()

    data.append('creator', newAction.creator)
    data.append('description', newAction.description)
    data.append('index', index)
    newAction.files &&
      newAction.files.forEach((x) => {
        data.append('files', x)
      })
    if (newAction.creator && newAction.description) {
      props.createTaskAction(taskId, data)
    }
    // Reset state cho việc thêm mới action
    setState({
      ...state,
      filePaste: [],
      newAction: {
        ...state.newAction,
        description: '',
        files: [],
        descriptionDefault: ''
      }
    })
  }

  // Thêm mới bình luận của công việc
  const submitTaskComment = (taskId) => {
    const { newTaskComment } = state

    const data = new FormData()
    data.append('creator', newTaskComment.creator)
    data.append('description', newTaskComment.description)
    newTaskComment.files.forEach((x) => {
      data.append('files', x)
    })
    if (newTaskComment.description && newTaskComment.creator) {
      props.createTaskComment(taskId, data)
    }
    // Reset state cho việc thêm mới bình luận
    setState({
      ...state,
      newTaskComment: {
        ...state.newTaskComment,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      newTaskCommentFilePaste: []
    })
  }

  const submitCommentOfTaskComment = (commentId, taskId) => {
    const { newCommentOfTaskComment } = state
    const data = new FormData()

    data.append('creator', newCommentOfTaskComment[`${commentId}`].creator)
    data.append('description', newCommentOfTaskComment[`${commentId}`].description)
    newCommentOfTaskComment[`${commentId}`].files &&
      newCommentOfTaskComment[`${commentId}`].files.forEach((x) => {
        data.append('files', x)
      })
    if (newCommentOfTaskComment[`${commentId}`].description && newCommentOfTaskComment[`${commentId}`].creator) {
      props.createCommentOfTaskComment(commentId, taskId, data)
    }
    // Reset state cho việc thêm mới bình luận
    setState((state) => {
      state.newCommentOfTaskComment[`${commentId}`] = {
        description: '',
        files: [],
        descriptionDefault: ''
      }
      state.newCommentOfTaskCommentPaste = []
      return {
        ...state
      }
    })
  }

  const handleUploadFile = (taskId, creator) => {
    const data = new FormData()
    const { taskFiles } = state
    taskFiles.files.forEach((x) => {
      data.append('files', x)
    })
    data.append('description', taskFiles.description)
    data.append('creator', creator)
    if (taskFiles.files.length > 0) {
      props.uploadFile(taskId, data)
    }
    // Reset state cho việc thêm mới bình luận
    setState({
      ...state,
      taskFiles: {
        ...state.taskFiles,
        description: '',
        files: [],
        descriptionDefault: ''
      },
      taskFilesPaste: []
    })
  }

  const handleEditFileTask = (file) => {
    setState({
      ...state,
      showEditTaskFile: file._id,
      fileTaskEdited: {
        descriptionDefault: file.description
      }
    })
  }

  const handleEditActionComment = (actionComent) => {
    setState({
      ...state,
      editComment: actionComent._id,
      newCommentOfActionEdited: {
        ...state.newCommentOfActionEdited,
        descriptionDefault: actionComent.description
      }
    })
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

  const handleEditTaskComment = (taskComment) => {
    setState({
      ...state,
      editTaskComment: taskComment._id,
      newTaskCommentEdited: {
        ...state.newTaskCommentEdited,
        descriptionDefault: taskComment.description
      }
    })
  }

  const handleSaveEditAction = (e, id, description, taskId) => {
    e.preventDefault()
    const { newActionEdited } = state
    const data = new FormData()
    newActionEdited.files.forEach((x) => {
      data.append('files', x)
    })
    data.append('type', 'edit')
    if (newActionEdited.description === '') {
      data.append('description', description)
    } else {
      data.append('description', newActionEdited.description)
    }
    data.append('creator', newActionEdited.creator)
    if (newActionEdited.description || newActionEdited.files) {
      props.editTaskAction(id, data, taskId)
    }
    setState({
      ...state,
      editAction: '',
      newActionEdited: {
        ...state.newActionEdited,
        files: [],
        description: '',
        descriptionDefault: null
      }
    })
  }
  const convertDateTime = (date, time) => {
    const splitter = date.split('-')
    const strDateTime = `${splitter[2]}/${splitter[1]}/${splitter[0]} ${time}`
    return new Date(strDateTime)
  }

  const handleSaveChangeDateAction = (action) => {
    const data = new FormData()
    const createdDateAction = convertDateTime(action.dateCreatedAt, action.timeCreatedAt)
    data.append('type', 'edit-time')
    data.append('creator', getStorage('userId'))
    data.append('dateCreatedAt', createdDateAction)
    props.editTaskAction(action.id, data, action.taskId)
  }

  const handleSaveEditTaskComment = (e, taskId, commentId, description) => {
    e.preventDefault()
    const { newTaskCommentEdited } = state
    const data = new FormData()
    newTaskCommentEdited.files.forEach((x) => {
      data.append('files', x)
    })
    if (newTaskCommentEdited.description === '') {
      data.append('description', description)
    } else {
      data.append('description', newTaskCommentEdited.description)
    }
    data.append('creator', newTaskCommentEdited.creator)
    if (newTaskCommentEdited.description || newTaskCommentEdited.files) {
      props.editTaskComment(taskId, commentId, data)
    }
    setState({
      ...state,
      newTaskCommentEdited: {
        ...state.newTaskComment,
        description: '',
        files: [],
        descriptionDefault: null
      },
      editTaskComment: ''
    })
  }

  // Lưu hoạt động
  const handleSaveEditActionComment = async (e, taskId, actionId, commentId, description) => {
    e.preventDefault()
    const { newCommentOfActionEdited } = state
    const data = new FormData()
    newCommentOfActionEdited.files.forEach((x) => {
      data.append('files', x)
    })
    if (newCommentOfActionEdited.description === '') {
      data.append('description', description)
    } else {
      data.append('description', newCommentOfActionEdited.description)
    }
    data.append('creator', newCommentOfActionEdited.creator)
    if (newCommentOfActionEdited.description || newCommentOfActionEdited.files) {
      await props.editActionComment(taskId, actionId, commentId, data)
    }
    setState({
      ...state,
      newCommentOfActionEdited: {
        ...state.newCommentOfActionEdited,
        description: '',
        files: [],
        descriptionDefault: null
      },
      editComment: ''
    })
  }

  const handleSaveEditCommentOfTaskComment = (e, commentId, taskId, description) => {
    e.preventDefault()
    const { newCommentOfTaskCommentEdited } = state
    const data = new FormData()
    newCommentOfTaskCommentEdited.files.forEach((x) => {
      data.append('files', x)
    })
    if (newCommentOfTaskCommentEdited.description === '') {
      data.append('description', description)
    } else {
      data.append('description', newCommentOfTaskCommentEdited.description)
    }
    data.append('creator', newCommentOfTaskCommentEdited.creator)
    if (newCommentOfTaskCommentEdited.description || newCommentOfTaskCommentEdited.files) {
      props.editCommentOfTaskComment(commentId, taskId, data)
    }

    setState({
      ...state,
      newCommentOfTaskCommentEdited: {
        ...state.newCommentOfTaskCommentEdited,
        description: '',
        files: [],
        descriptionDefault: null
      },
      editCommentOfTaskComment: ''
    })
  }

  const handleSaveEditTaskFile = async (e, description, documentId, taskId) => {
    e.preventDefault()
    const { fileTaskEdited } = state
    const data = new FormData()
    fileTaskEdited.files.forEach((x) => {
      data.append('files', x)
    })
    if (fileTaskEdited.description === '') {
      data.append('description', description)
    } else {
      data.append('description', fileTaskEdited.description)
    }
    data.append('creator', fileTaskEdited.creator)
    if (fileTaskEdited.description || fileTaskEdited.files) {
      props.editDocument(documentId, taskId, data)
    }

    setState({
      ...state,
      fileTaskEdited: {
        ...state.fileTaskEdited,
        description: '',
        files: [],
        descriptionDefault: null
      },
      showEditTaskFile: ''
    })
  }

  const handleConfirmAction = async (e, actionId, userId, taskId) => {
    e.preventDefault()
    props.confirmAction(userId, actionId, taskId)
  }

  const onActionFilesChange = (files) => {
    setState({
      ...state,
      newAction: {
        ...state.newAction,
        files
      }
    })
  }

  const onEditActionFilesChange = (files) => {
    setState({
      ...state,
      newActionEdited: {
        ...state.newActionEdited,
        files
      }
    })
  }
  const onEditCommentOfTaskCommentFilesChange = (files) => {
    setState({
      ...state,
      newCommentOfTaskCommentEdited: {
        ...state.newCommentOfTaskCommentEdited,
        files
      }
    })
  }
  const onEditTaskCommentFilesChange = (files) => {
    setState({
      ...state,
      newTaskCommentEdited: {
        ...state.newTaskCommentEdited,
        files
      }
    })
  }

  const onTaskCommentFilesChange = (files) => {
    setState({
      ...state,
      newTaskComment: {
        ...state.newTaskComment,
        files
      }
    })
  }

  const onCommentFilesChange = (files, actionId) => {
    const { newCommentOfAction } = state
    newCommentOfAction[actionId] = {
      ...newCommentOfAction[actionId],
      files
    }
    setState((state) => {
      return {
        ...state,
        newCommentOfAction
      }
    })
  }
  const onEditCommentOfActionFilesChange = (files) => {
    setState({
      ...state,
      newCommentOfActionEdited: {
        ...state.newCommentOfActionEdited,
        files
      }
    })
  }
  const onCommentOfTaskCommentFilesChange = (commentId, files) => {
    setState((state) => {
      state.newCommentOfTaskComment[`${commentId}`] = {
        ...state.newCommentOfTaskComment[`${commentId}`],
        files
      }
      return { ...state }
    })
  }
  const onTaskFilesChange = (files) => {
    setState({
      ...state,
      taskFiles: {
        ...state.taskFiles,
        files
      }
    })
  }

  const onFilesError = (error, file) => {}

  // const filesRemoveOne = (file) => {
  //     refs.filesAddAction.removeFile(file)
  // }

  // const filesRemoveAll = () => {
  //     refs.filesAddAction.removeFiles()
  // }

  const requestDownloadFile = (e, path, fileName) => {
    e.preventDefault()
    props.downloadFile(path, fileName)
  }

  const handleShowFile = (id) => {
    let a
    const { showFile } = state
    if (showFile.some((obj) => obj === id)) {
      a = showFile.filter((x) => x !== id)
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

  const handleShowEvaluations = (id) => {
    let a
    const { showEvaluations } = state
    if (showEvaluations.some((obj) => obj === id)) {
      a = showEvaluations.filter((x) => x !== id)
      setState({
        ...state,
        showEvaluations: a
      })
    } else {
      setState({
        ...state,
        showEvaluations: [...state.showEvaluations, id]
      })
    }
  }

  const handleDeleteFile = (fileId, fileName, actionId, type) => {
    const { performtasks, translate } = props
    Swal.fire({
      html: `<div style="max-width: 100%; max-height: 100%" >${translate('task.task_perform.question_delete_file')} ${fileName} ? <div>`,
      showCancelButton: true,
      cancelButtonText: `Hủy bỏ`,
      confirmButtonText: `Đồng ý`
    }).then((result) => {
      if (result.isConfirmed) {
        save(performtasks?.task?._id)
      }
    })
    setState({
      ...state,
      deleteFile: {
        fileId,
        actionId,
        fileName,
        type
      }
    })
  }

  const save = (taskId) => {
    const { deleteFile } = state
    if (deleteFile.type === 'action') {
      props.deleteFileAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type)
    } else if (deleteFile.type === 'commentofaction') {
      props.deleteFileCommentOfAction(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type)
    } else if (deleteFile.type === 'taskcomment') {
      props.deleteFileTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type)
    } else if (deleteFile.type === 'commentoftaskcomment') {
      props.deleteFileChildTaskComment(deleteFile.fileId, deleteFile.actionId, taskId, deleteFile.type)
    } else if (deleteFile.type === 'task') {
      props.deleteFileTask(deleteFile.fileId, deleteFile.actionId, taskId)
    }
  }

  const onEditFileTask = (files) => {
    setState({
      ...state,
      fileTaskEdited: {
        ...state.fileTaskEdited,
        files
      }
    })
  }

  const isImage = (src) => {
    const string = src.toLowerCase().split('.')
    const image = ['jpg', 'jpeg', 'png', 'tiff', 'gif']
    if (image.indexOf(string[string.length - 1]) !== -1) {
      return true
    }
    return false
  }

  const handleShowSort = () => {
    const { taskActions, showSort } = state
    if (showSort) {
      setState({
        ...state,
        showSort: false
      })
    } else {
      setState({
        ...state,
        showSort: true
      })
    }
  }

  const sort = (index, type) => {
    const a = []
    const { taskActions } = state
    const item = taskActions[index]
    taskActions.splice(index, 1)
    taskActions.splice(type === 'up' ? index - 1 : index + 1, 0, item)
    setState({
      ...state,
      taskActions
    })
  }

  const cancelSort = () => {
    const { taskActions } = state
    taskActions.sort(function (a, b) {
      return a.sort - b.sort
    })
    setState({
      ...state,
      taskActions,
      showSort: false
    })
  }

  const saveSort = (taskId) => {
    const { taskActions } = state
    let i
    const arrayActions = []
    for (i = 0; i < taskActions.length; i++) {
      arrayActions[i] = taskActions[i]
      delete arrayActions[i]._id
    }

    props.sortActions(taskId, arrayActions)
    setState({
      ...state,
      showSort: false
    })
  }

  const convertTime = (ms) => {
    if (!ms) return '00:00:00'
    const hour = Math.floor(ms / (60 * 60 * 1000))
    const minute = Math.floor((ms - hour * 60 * 60 * 1000) / (60 * 1000))
    const second = Math.floor((ms - hour * 60 * 60 * 1000 - minute * 60 * 1000) / 1000)

    return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`
  }

  const getRoleNameInTask = (value) => {
    const { translate } = props
    switch (value) {
      case 'responsible':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.responsible')} ]</span>
      case 'accountable':
        return (
          <span style={{ fontSize: 10 }} className='text-green'>
            [ {translate('task.task_management.accountable')} ]
          </span>
        )
      case 'consulted':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.consulted')} ]</span>
      case 'informed':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.informed')} ]</span>
      case 'creator':
        return <span style={{ fontSize: 10 }}>[ {translate('task.task_management.creator')} ]</span>
      default:
        return ''
    }
  }

  const filterLogAutoStopped = (e) => {
    setState({
      ...state,
      filterLogAutoStopped: e.target.value
    })
  }

  const handleOpenModalAddLog = () => {
    window.$('#modal-add-log-time').modal('show')
  }

  const togglePopupApproveAllAction = () => {
    setState({
      ...state,
      showPopupApproveAllAction: !state.showPopupApproveAllAction
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
    const { actionImportanceLevelAll, ratingAll, evaluations } = state
    let evaluation = []
    let showEvaluations = []

    taskActions.forEach((obj, index) => {
      evaluation = [
        ...evaluation,
        {
          actionId: obj._id,
          role: 'accountable',
          rating: ratingAll ?? 0,
          actionImportanceLevel: actionImportanceLevelAll ?? 10
        }
      ]
      showEvaluations = [...showEvaluations, obj._id]
    })
    const newEvaluationState = evaluations
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
    hover1['all-action'] = 0
    props.evaluationAllAction(taskId, evaluation)
  }

  const handleShowTime = (timeSheetLog) => {
    if (timeSheetLog && timeSheetLog.length > 0) {
      timeSheetLog = timeSheetLog.filter((x) => x.acceptLog === true)
      const totalDuration = timeSheetLog.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.duration
      }, 0)
      return convertTime(totalDuration)
    }
  }

  const getCreatorId = (creator) => {
    if (!creator) return
    if (creator && typeof creator === 'object') return creator._id
    return creator
  }

  const showDetailTimer = (nameAction, timeSheetLogs) => {
    nameAction = htmlToText(nameAction)
    const result = []
    timeSheetLogs.reduce((res, value) => {
      const creatorId = getCreatorId(value?.creator)

      if (!res[creatorId]) {
        res[creatorId] = {
          id: creatorId,
          duration: 0,
          creatorName: value.creator.name
        }
        result.push(res[creatorId])
      }
      res[creatorId].duration += value.duration
      return res
    }, {})

    Swal.fire({
      html:
        `<div style="max-width: 100%; max-height: 100%" >
                <h4 style="margin-bottom: 15px">Thời gian bấm giờ cho hoạt động "<strong>${nameAction}</strong>"</h4>` +
        `<ol>${result.map((o) => `<li style="margin-bottom: 7px">${o.creatorName}: ${convertTime(o.duration)}</li>`).join(' ')} </ol>` +
        `<div>`,

      confirmButtonText: `Đồng ý`
    })
  }

  const showFilePreview = (data) => {
    setState({
      ...state,
      currentFilepri: data
    })
    window.$('#modal-file-preview').modal('show')
  }

  const checkTypeFile = (data) => {
    if (typeof data === 'string' || data instanceof String) {
      const index = data.lastIndexOf('.')
      const typeFile = data.substring(index + 1, data.length)
      if (typeFile === 'pdf') {
        return true
      }
      return false
    }
    return false
  }
  const reverseArr = (arr) => {
    return [].concat(arr).reverse()
  }
  let task
  let documents
  let taskComments
  let logTimer
  let logs
  let subtasks
  if (typeof performtasks.task !== 'undefined' && performtasks.task !== null) {
    task = performtasks.task
    taskComments = task.taskComments
    documents = task.documents
  }

  if (performtasks?.task) {
    logTimer = performtasks.task.timesheetLogs
    subtasks = performtasks.task.subTasks
    if (performtasks?.logs) {
      logs = performtasks?.logs
    } else {
      logs = performtasks?.task.logs
    }
  }

  switch (state.filterLogAutoStopped) {
    case 'auto':
      logTimer = logTimer.filter((item) => item.autoStopped === 2)
      break
    case 'hand':
      logTimer = logTimer.filter((item) => item.autoStopped === 1)
      break
    case 'addlog':
      logTimer = logTimer.filter((item) => item.autoStopped === 3)
      break
    default:
      break
  }

  const handleChangleCommentOfTaskActions = (value, item) => {
    const { newCommentOfAction } = state
    newCommentOfAction[item._id] = {
      ...newCommentOfAction[item._id],
      creator: idUser,
      description: value,
      descriptionDefault: null
    }
    setState((state) => {
      return {
        ...state,
        newCommentOfAction
      }
    })
  }

  // console.log("state ActionTab", state)

  return (
    <div>
      {state.currentFilepri && <FilePreview file={state.currentFilepri} />}
      <div
        className='nav-tabs-custom'
        style={{
          boxShadow: 'none',
          MozBoxShadow: 'none',
          WebkitBoxShadow: 'none'
        }}
      >
        <ul className='nav nav-tabs'>
          <li className='active'>
            <a href='#taskAction' onClick={() => handleChangeContent('taskAction')} data-toggle='tab'>
              {translate('task.task_perform.actions')} ({taskActions && taskActions.length})
            </a>
          </li>
          <li>
            <a href='#taskComment' onClick={() => handleChangeContent('actionComment')} data-toggle='tab'>
              {translate('task.task_perform.communication')} ({taskComments && taskComments.length})
            </a>
          </li>
          <li>
            <a href='#documentTask' onClick={() => handleChangeContent('documentTask')} data-toggle='tab'>
              {translate('task.task_perform.documents')} ({documents && documents.length})
            </a>
          </li>
          <li>
            <a href='#taskOutputs' onClick={() => handleChangeContent('taskOutputs')} data-toggle='tab'>
              Kết quả giao nộp ({getTaskOutputs(performtasks?.task?.taskOutputs)})
            </a>
          </li>
          <li>
            <a href='#logTimer' onClick={() => handleChangeContent('logTimer')} data-toggle='tab'>
              {translate('task.task_perform.timesheetlogs')} ({logTimer && logTimer.length})
            </a>
          </li>
          <li>
            <a href='#subTask' onClick={() => handleChangeContent('subTask')} data-toggle='tab'>
              {translate('task.task_perform.subtasks')} ({subtasks && subtasks.length})
            </a>
          </li>
          <li>
            <a href='#historyLog' onClick={() => handleChangeContent('historyLog')} data-toggle='tab'>
              {translate('task.task_perform.change_history')} ({logs && logs.length})
            </a>
          </li>
          {/* Tab quy trình cho công việc theo quy trình */}
          {task && task.process && (
            <li>
              <a href='#process' onClick={() => handleChangeContent('process')} data-toggle='tab'>
                {translate('task.task_perform.change_process')}{' '}
              </a>
            </li>
          )}

          {
            /** Điều kiện hiển thị tab dữ liệu vào */
            task && task.preceedingTasks && task.preceedingTasks.length !== 0 && (
              <li>
                <a href='#incoming-data' onClick={() => handleChangeContent('incoming-data')} data-toggle='tab'>
                  {translate('task.task_perform.change_incoming')}
                </a>
              </li>
            )
          }

          {
            /** Điều kiện hiển thị tab dữ liệu ra */
            task && task.followingTasks && task.followingTasks.length !== 0 && (
              <li>
                <a href='#outgoing-data' onClick={() => handleChangeContent('outgoing-data')} data-toggle='tab'>
                  {translate('task.task_perform.change_outgoing')}
                </a>
              </li>
            )
          }
        </ul>
        <div className='tab-content'>
          <div className={selected === 'taskAction' ? 'active tab-pane' : 'tab-pane'} id='taskAction'>
            {/* Thêm hoạt động cho công việc */}
            {role === 'responsible' && task && !showSort && (
              <>
                <img className='user-img-level1' src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='user avatar' />
                <ContentMaker
                  idQuill={`add-action-${id}`}
                  inputCssClass='text-input-level1'
                  controlCssClass='tool-level1 row'
                  onFilesChange={onActionFilesChange}
                  onFilesError={onFilesError}
                  files={newAction.files}
                  text={newAction.descriptionDefault}
                  placeholder={role === 'responsible' ? translate('task.task_perform.result') : translate('task.task_perform.enter_action')}
                  submitButtonText={role === 'responsible' ? translate('general.add') : translate('task.task_perform.create_action')}
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
                  onSubmit={(e) => {
                    submitAction(task._id, taskActions.length)
                  }}
                />
              </>
            )}

            {typeof taskActions !== 'undefined' && taskActions.length !== 0 ? (
              <ShowMoreShowLess
                id={`description${id}`}
                classShowMoreLess='tool-level1'
                styleShowMoreLess={{
                  display: 'inline-block',
                  marginBotton: 15
                }}
              >
                {
                  // Hiển thị hoạt động của công việc
                  taskActions.map((item, index) => {
                    const listImage = item.files.map((elem) => (isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                    return (
                      <div key={item._id} className={index > 3 ? 'hide-component' : ''}>
                        {item.creator ? (
                          <img className='user-img-level1' src={process.env.REACT_APP_SERVER + item.creator.avatar} alt='User Image' />
                        ) : (
                          <div className='user-img-level1' />
                        )}
                        {editAction !== item._id && ( // khi chỉnh sửa thì ẩn action hiện tại đi
                          <>
                            <div className='content-level1' data-width='100%'>
                              {/* Tên người tạo hoạt động */}
                              <div
                                style={{
                                  display: 'flex',
                                  fontWeight: 'bold',
                                  justifyContent: 'space-between'
                                }}
                              >
                                {item.creator && (
                                  <a style={{ cursor: 'pointer' }}>
                                    {item.creator?.name}
                                    {item.delegator ? (
                                      <span style={{ color: '#333' }}>
                                        {` (${translate('task.task_perform.delegated_from')} ${item.delegator?.name})`}
                                      </span>
                                    ) : null}
                                  </a>
                                )}
                                {item.creator && (
                                  <a
                                    className='pull-right'
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => showDetailTimer(item.description, item.timesheetLogs)}
                                  >
                                    {handleShowTime(item.timesheetLogs)}
                                  </a>
                                )}
                              </div>
                              <div>
                                {item.name && (
                                  <b
                                    style={{
                                      display: 'flex',
                                      marginTop: '4px'
                                    }}
                                  >
                                    {item.name}{' '}
                                  </b>
                                )}
                                {item?.description?.split('\n')?.map((item, idx) => (
                                  <div key={idx}>{parse(item)}</div>
                                ))}
                              </div>

                              <div className='btn-group pull-right'>
                                {role === 'responsible' && item.creator && showSort === false && task && (
                                  <>
                                    <span data-toggle='dropdown'>
                                      <i className='fa fa-ellipsis-h' />
                                    </span>
                                    <ul className='dropdown-menu'>
                                      <li>
                                        <a style={{ cursor: 'pointer' }} onClick={() => handleEditAction(item)}>
                                          {translate('task.task_perform.edit_action')}
                                        </a>
                                      </li>
                                      <li>
                                        <a style={{ cursor: 'pointer' }} onClick={() => props.deleteTaskAction(item._id, task._id)}>
                                          {translate('task.task_perform.delete_action')}
                                        </a>
                                      </li>
                                    </ul>
                                  </>
                                )}
                                {showSort === true && (role === 'responsible' || role === 'accountable') && (
                                  <div className='sort-action'>
                                    {index !== 0 && (
                                      <a
                                        style={{
                                          marginTop: index === taskActions.length - 1 ? '10px' : '0px'
                                        }}
                                        onClick={() => sort(index, 'up')}
                                      >
                                        <i className='glyphicon glyphicon-arrow-up' />{' '}
                                      </a>
                                    )}
                                    {index !== taskActions.length - 1 && (
                                      <a
                                        style={{
                                          marginTop: index === 0 ? '13px' : '0px'
                                        }}
                                        onClick={() => sort(index, 'down')}
                                      >
                                        <i className='glyphicon glyphicon-arrow-down' />{' '}
                                      </a>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Các file đính kèm */}
                            {!showSort && task && (
                              <ul className='list-inline tool-level1'>
                                {role === 'accountable' ? (
                                  <ModalEditDateCreatedAction
                                    data={item}
                                    taskId={task._id}
                                    saveChangeDateCreatedAction={handleSaveChangeDateAction}
                                  />
                                ) : (
                                  <li>
                                    <span className='text-sm'>
                                      <DateTimeConverter dateTime={item.createdAt} />
                                    </span>
                                  </li>
                                )}
                                <li>
                                  {item.mandatory && !item.creator && (
                                    <b className='text-sm'>{translate('task.task_perform.mandatory_action')}</b>
                                  )}
                                </li>
                                {(item.creator === undefined || item.creator === null) && role === 'responsible' && (
                                  <li>
                                    <a
                                      style={{ cursor: 'pointer' }}
                                      className='text-green text-sm'
                                      onClick={(e) => handleConfirmAction(e, item._id, currentUser, task?._id)}
                                    >
                                      <i className='fa fa-check-circle' aria-hidden='true' />{' '}
                                      {translate('task.task_perform.confirm_action')}
                                    </a>
                                  </li>
                                )}

                                {/* Các chức năng tương tác với action */}
                                {item.creator && (
                                  <>
                                    {item.evaluations && (
                                      <li>
                                        <a
                                          style={{
                                            cursor: 'pointer',
                                            pointerEvents: item.evaluations.length > 0 ? '' : 'none'
                                          }}
                                          className='link-black text-sm'
                                          onClick={() => {
                                            handleShowEvaluations(item._id)
                                          }}
                                        >
                                          <i className='fa fa-thumbs-o-up margin-r-5' />
                                          {translate('task.task_perform.evaluation')} ({item.evaluations && item.evaluations.length})
                                        </a>
                                      </li>
                                    )}
                                    {item.files &&
                                      item.files.length > 0 && ( // Chỉ hiện show file khi có file đính kèm
                                        <li style={{ display: 'inline-table' }}>
                                          <a
                                            style={{ cursor: 'pointer' }}
                                            className='link-black text-sm'
                                            onClick={() => handleShowFile(item._id)}
                                          >
                                            <i className='fa fa-paperclip' aria-hidden='true' />{' '}
                                            {translate('task.task_perform.file_attach')} ({item.files && item.files.length})
                                          </a>
                                        </li>
                                      )}
                                    <li>
                                      <a
                                        style={{ cursor: 'pointer' }}
                                        className='link-black text-sm'
                                        onClick={() => handleShowChildComment(item._id)}
                                      >
                                        <i className='fa fa-comments-o margin-r-5' /> {translate('task.task_perform.comment')} (
                                        {item.comments.length}) &nbsp;
                                      </a>
                                    </li>
                                  </>
                                )}
                              </ul>
                            )}

                            {!showSort && task && (
                              <ul className='list-inline tool-level1'>
                                {item.creator && (
                                  <>
                                    {(role === 'accountable' || role === 'consulted' || role === 'creator' || role === 'informed') && (
                                      <>
                                        <div className='form-group text-sm'>
                                          {/* Code hiển thị: Nếu chưa chọn điểm đánh giá mới, hiển thị điểm đánh giá trong DB. Nếu chưa đánh giá, hiển thị -- */}
                                          <span style={{ marginRight: '5px' }}>
                                            Điểm đánh giá:{' '}
                                            <strong>
                                              {evaluations?.[item?._id]?.rating ?? (item?.rating !== -1 ? item?.rating : '--')}
                                              /10
                                            </strong>
                                          </span>
                                          <Rating
                                            fractions={2}
                                            stop={10}
                                            emptySymbol='fa fa-star-o fa-2x'
                                            fullSymbol='fa fa-star fa-2x'
                                            initialRating={evaluations?.[item._id]?.rating ?? item?.rating}
                                            onClick={(value) => {
                                              setValueRating(item._id, value)
                                            }}
                                            onHover={(value) => {
                                              setHover(item._id, value, 'rating')
                                            }}
                                          />
                                          <div
                                            style={{
                                              display: 'inline',
                                              marginLeft: '5px'
                                            }}
                                          >
                                            {hover1?.[`${item?._id}-rating`]}
                                          </div>
                                        </div>
                                        <div className='form-group text-sm'>
                                          {/* Code hiển thị: Nếu chưa chọn độ quan trọng mới, hiển thị độ quan trọng trong DB */}
                                          <span style={{ marginRight: '5px' }}>
                                            Độ quan trọng:{' '}
                                            <strong>
                                              {evaluations?.[item?._id]?.actionImportanceLevel ?? item?.actionImportanceLevel}
                                              /10
                                            </strong>
                                          </span>
                                          <Rating
                                            fractions={2}
                                            stop={10}
                                            emptySymbol='fa fa-star-o fa-2x'
                                            fullSymbol='fa fa-star fa-2x'
                                            initialRating={evaluations?.[item._id]?.actionImportanceLevel ?? item?.actionImportanceLevel}
                                            onClick={(value) => {
                                              setActionImportanceLevel(item._id, value)
                                            }}
                                            onHover={(value) => {
                                              setHover(item._id, value, 'actionImportanceLevel')
                                            }}
                                          />
                                          <div
                                            style={{
                                              display: 'inline',
                                              marginLeft: '5px'
                                            }}
                                          >
                                            {hover1?.[`${item?._id}-actionImportanceLevel`]}
                                          </div>
                                        </div>
                                        <a
                                          style={{
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                          }}
                                          onClick={() => evaluationTaskAction(item, task._id, role, 1)}
                                        >
                                          Gửi đánh giá
                                        </a>
                                      </>
                                    )}
                                  </>
                                )}
                              </ul>
                            )}
                            <div className='tool-level1' style={{ paddingLeft: 5 }}>
                              {/* Các kết quả đánh giá của action */}
                              {showEvaluations.some((obj) => obj === item._id) && (
                                <div style={{ marginBottom: '10px' }}>
                                  <ul className='list-inline'>
                                    <li>
                                      {Array.isArray(item?.evaluations) &&
                                        item.evaluations.map((element, index) => {
                                          return (
                                            <div key={index}>
                                              <b> {element?.creator?.name} </b>
                                              {getRoleNameInTask(element?.role)}
                                              <span>
                                                {' '}
                                                Điểm đánh giá:
                                                <span className='text-red'> {element?.rating}/10</span> - Độ quan trọng:
                                                <span className='text-red'>
                                                  {' '}
                                                  {element?.actionImportanceLevel}
                                                  /10
                                                </span>
                                              </span>
                                              &ensp;
                                              {role === 'accountable' && (
                                                <a
                                                  style={{
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                  }}
                                                  onClick={() => handleDeleteActionEvaluation(item._id, task._id, element._id)}
                                                >
                                                  <i
                                                    className='material-icons text-red'
                                                    style={{
                                                      display: 'inline-flex',
                                                      verticalAlign: 'top'
                                                    }}
                                                  >
                                                    delete
                                                  </i>
                                                </a>
                                              )}
                                            </div>
                                          )
                                        })}
                                    </li>
                                  </ul>
                                  {Array.isArray(item?.evaluations) &&
                                    item?.evaluations?.filter((element) => element.role === 'accountable').length > 0 && (
                                      <p>
                                        <b>Trung bình :</b>
                                        <span>
                                          {' '}
                                          Điểm đánh giá:
                                          <span className='text-red'> {item?.rating}/10</span> - Độ quan trọng:
                                          <span className='text-red'> {item?.actionImportanceLevel}/10</span>
                                        </span>
                                      </p>
                                    )}
                                </div>
                              )}
                              {/* Các file đính kèm của action */}
                              {showFile.some((obj) => obj === item._id) && (
                                <div style={{ cursor: 'pointer' }}>
                                  {item.files.map((elem, index) => {
                                    return (
                                      <div key={index} className='show-files-task'>
                                        {isImage(elem.name) ? (
                                          <ApiImage
                                            listImage={listImage}
                                            className='attachment-img files-attach'
                                            style={{ marginTop: '5px' }}
                                            src={elem.url}
                                            file={elem}
                                            requestDownloadFile={requestDownloadFile}
                                          />
                                        ) : (
                                          <div>
                                            <a style={{ marginTop: '2px' }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}>
                                              {' '}
                                              {elem.name}
                                            </a>
                                            &nbsp;&nbsp;&nbsp;
                                            <a href='#' onClick={() => showFilePreview(elem && elem.url)}>
                                              <u>{elem && checkTypeFile(elem.url) ? <i className='fa fa-eye fa-1' /> : ''}</u>
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                        {/* Chỉnh sửa nội dung hoạt động của công việc */}
                        {editAction === item._id && task && (
                          <div>
                            <ContentMaker
                              idQuill={`edit-action-${item._id}`}
                              inputCssClass='text-input-level1'
                              controlCssClass='tool-level2 row'
                              onFilesChange={onEditActionFilesChange}
                              onFilesError={onFilesError}
                              files={newActionEdited.files}
                              text={newActionEdited.descriptionDefault}
                              submitButtonText={translate('task.task_perform.save_edit')}
                              cancelButtonText={translate('task.task_perform.cancel')}
                              handleEdit={(item) => handleEditAction(item)}
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
                                handleSaveEditAction(e, item._id, item.description, task._id)
                              }}
                            />

                            {item.files.length > 0 && (
                              <div className='tool-level1' style={{ marginTop: -10 }}>
                                {item.files.map((file, index) => {
                                  return (
                                    <div key={index}>
                                      <a style={{ cursor: 'pointer' }}>{file.name} &nbsp;</a>
                                      <a
                                        style={{ cursor: 'pointer' }}
                                        className='link-black text-sm btn-box-tool'
                                        onClick={() => {
                                          handleDeleteFile(file._id, file.name, item._id, 'action')
                                        }}
                                      >
                                        <i className='fa fa-times' />
                                      </a>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Hiển thị bình luận cho hoạt động */}
                        {!showSort && task && showChildComment.some((obj) => obj === item._id) && (
                          <div>
                            {reverseArr(item.comments).map((child) => {
                              const listImage = child.files.map((elem) => (isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                              return (
                                <div key={child._id}>
                                  <img
                                    className='user-img-level2'
                                    src={process.env.REACT_APP_SERVER + child.creator?.avatar}
                                    alt='User Image'
                                  />
                                  {editComment !== child._id && ( // Khi đang edit thì nội dung cũ đi
                                    <div>
                                      <div className='content-level2'>
                                        <a style={{ cursor: 'pointer' }}>{child.creator?.name} </a>
                                        {child.description.split('\n').map((item, idx) => {
                                          return <span key={idx}>{parse(item)}</span>
                                        })}

                                        {child.creator?._id === currentUser && (
                                          <div className='btn-group pull-right'>
                                            <span data-toggle='dropdown'>
                                              <i className='fa fa-ellipsis-h' />
                                            </span>
                                            <ul className='dropdown-menu'>
                                              <li>
                                                <a
                                                  style={{
                                                    cursor: 'pointer'
                                                  }}
                                                  onClick={() => handleEditActionComment(child)}
                                                >
                                                  {translate('task.task_perform.edit_comment')}
                                                </a>
                                              </li>
                                              <li>
                                                <a
                                                  style={{
                                                    cursor: 'pointer'
                                                  }}
                                                  onClick={() => props.deleteActionComment(task._id, item._id, child._id)}
                                                >
                                                  {translate('task.task_perform.delete_comment')}
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        )}
                                      </div>
                                      <ul className='list-inline tool-level2'>
                                        <li>
                                          <span className='text-sm'>
                                            <DateTimeConverter dateTime={child.createdAt} />
                                          </span>
                                        </li>
                                        {child.files && child.files.length > 0 && (
                                          <li
                                            style={{
                                              display: 'inline-table'
                                            }}
                                          >
                                            <div>
                                              <a
                                                style={{
                                                  cursor: 'pointer'
                                                }}
                                                className='link-black text-sm'
                                                onClick={() => handleShowFile(child._id)}
                                              >
                                                <b>
                                                  <i className='fa fa-paperclip' aria-hidden='true'>
                                                    {' '}
                                                    {translate('task.task_perform.file_attach')} ({child.files && child.files.length})
                                                  </i>
                                                </b>
                                              </a>
                                            </div>
                                          </li>
                                        )}
                                        {showFile.some((obj) => obj === child._id) && (
                                          <li
                                            style={{
                                              display: 'inline-table'
                                            }}
                                          >
                                            {child.files.map((elem, index) => {
                                              return (
                                                <div
                                                  style={{
                                                    cursor: 'pointer'
                                                  }}
                                                  key={index}
                                                  className='show-files-task'
                                                >
                                                  {isImage(elem.name) ? (
                                                    <ApiImage
                                                      listImage={listImage}
                                                      className='attachment-img files-attach'
                                                      style={{
                                                        marginTop: '5px'
                                                      }}
                                                      src={elem.url}
                                                      file={elem}
                                                      requestDownloadFile={requestDownloadFile}
                                                    />
                                                  ) : (
                                                    <div>
                                                      <a
                                                        style={{
                                                          cursor: 'pointer',
                                                          marginTop: '2px'
                                                        }}
                                                        onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}
                                                      >
                                                        {' '}
                                                        {elem.name}
                                                      </a>
                                                      <a href='#' onClick={() => showFilePreview(elem && elem.url)}>
                                                        <u>{elem && checkTypeFile(elem.url) ? <i className='fa fa-eye' /> : ''}</u>
                                                      </a>
                                                    </div>
                                                  )}
                                                </div>
                                              )
                                            })}
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  )}
                                  {/* Chỉnh sửa nội dung bình luận của hoạt động */}
                                  {editComment === child._id && (
                                    <div>
                                      <ContentMaker
                                        idQuill={`edit-comment-${child._id}`}
                                        inputCssClass='text-input-level2'
                                        controlCssClass='tool-level2 row'
                                        onFilesChange={onEditCommentOfActionFilesChange}
                                        onFilesError={onFilesError}
                                        files={newCommentOfActionEdited.files}
                                        text={newCommentOfActionEdited.descriptionDefault}
                                        submitButtonText={translate('task.task_perform.save_edit')}
                                        cancelButtonText={translate('task.task_perform.cancel')}
                                        handleEdit={(e) => handleEditActionComment(e)}
                                        onTextChange={(value, imgs) => {
                                          setState({
                                            ...state,
                                            newCommentOfActionEdited: {
                                              ...state.newCommentOfActionEdited,
                                              description: value
                                            }
                                          })
                                        }}
                                        onSubmit={(e) => {
                                          handleSaveEditActionComment(e, task._id, item._id, child._id, child.description)
                                        }}
                                      />
                                      {/* Hiện file đã tải lên */}
                                      {child.files.length > 0 && (
                                        <div
                                          className='tool-level2'
                                          style={{
                                            marginTop: -8,
                                            fontSize: '12px'
                                          }}
                                        >
                                          {child.files.map((file, index) => {
                                            return (
                                              <div key={index}>
                                                <a
                                                  style={{
                                                    cursor: 'pointer'
                                                  }}
                                                >
                                                  {file.name} &nbsp;
                                                </a>
                                                <a
                                                  style={{
                                                    cursor: 'pointer'
                                                  }}
                                                  className='link-black text-sm btn-box-tool'
                                                  onClick={() => {
                                                    handleDeleteFile(file._id, file.name, item._id, 'commentofaction')
                                                  }}
                                                >
                                                  <i className='fa fa-times' />
                                                </a>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                              return true
                            })}
                            {/* Thêm bình luận cho hoạt động */}
                            <div>
                              <img className='user-img-level2' src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='user avatar' />
                              <ContentMaker
                                idQuill={`add-comment-action-${item._id}`}
                                imageDropAndPasteQuill={false}
                                inputCssClass='text-input-level2'
                                controlCssClass='tool-level2 row'
                                onFilesChange={(files) => onCommentFilesChange(files, item._id)}
                                onFilesError={onFilesError}
                                files={newCommentOfAction[`${item._id}`]?.files}
                                text={newCommentOfAction[`${item._id}`]?.descriptionDefault}
                                placeholder={translate('task.task_perform.enter_comment_action')}
                                submitButtonText={translate('task.task_perform.create_comment_action')}
                                onTextChange={(value, imgs) => handleChangleCommentOfTaskActions(value, item)}
                                onSubmit={(e) => {
                                  submitComment(item._id, task._id)
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                }
              </ShowMoreShowLess>
            ) : null}
            {/* Sắp xếo hoạt động CV */}
            {task && showSort ? (
              <div className='row' style={{ marginTop: 20 }}>
                <div className='col-xs-6'>
                  <button type='button' className='btn btn-block' onClick={() => cancelSort()}>
                    Hủy
                  </button>
                </div>
                <div className='col-xs-6'>
                  <button type='button' className='btn btn-block' onClick={() => saveSort(task._id)}>
                    Lưu
                  </button>
                </div>
              </div>
            ) : (
              <>
                {
                  // Đánh giá tất cả các hoạt động CV
                  state.showPopupApproveAllAction
                    ? role === 'accountable' &&
                      taskActions.length > 1 && (
                        <div style={{ borderColor: '#ddd', marginTop: 20 }}>
                          <button
                            style={{ marginTop: 7, marginBottom: 7 }}
                            className='btn btn-block btn-default btn-sm'
                            onClick={() => togglePopupApproveAllAction()}
                          >
                            Hủy đánh giá tất cả các hoạt động
                          </button>

                          <div className='form-group text-sm'>
                            <span style={{ marginRight: '5px' }}>
                              Điểm đánh giá: <strong>{ratingAll ?? 0}/10</strong>
                            </span>
                            <Rating
                              fractions={2}
                              stop={10}
                              emptySymbol='fa fa-star-o fa-2x'
                              fullSymbol='fa fa-star fa-2x'
                              initialRating={ratingAll ?? 0}
                              onClick={(value) => {
                                setValueRatingApproveAll(value)
                              }}
                              onHover={(value) => {
                                setHover('all-action', value, 'rating')
                              }}
                            />
                            <div style={{ display: 'inline', marginLeft: '5px' }}>{hover1?.['all-action-rating']}</div>
                          </div>

                          <div className='form-group text-sm'>
                            <span style={{ marginRight: '5px' }}>
                              Độ quan trọng: <strong>{actionImportanceLevelAll ?? 10}/10</strong>
                            </span>
                            <Rating
                              fractions={2}
                              stop={10}
                              emptySymbol='fa fa-star-o fa-2x'
                              fullSymbol='fa fa-star fa-2x'
                              initialRating={actionImportanceLevelAll ?? 10}
                              onClick={(value) => {
                                setActionImportanceLevelAll(value)
                              }}
                              onHover={(value) => {
                                setHover('all-action', value, 'actionImportanceLevel')
                              }}
                            />
                            <div style={{ display: 'inline', marginLeft: '5px' }}>{hover1?.['all-action-actionImportanceLevel']}</div>
                          </div>
                          <button
                            style={{ marginTop: 7, marginBottom: 7 }}
                            className='btn btn-block btn-default btn-sm'
                            onClick={() => evaluationAllTaskAction(task._id, taskActions)}
                          >
                            Gửi đánh giá tất cả các hoạt động
                          </button>
                        </div>
                      )
                    : role === 'accountable' &&
                      taskActions.length > 1 && (
                        <button className='btn btn-block btn-success btn-sm' onClick={() => togglePopupApproveAllAction()}>
                          Đánh giá tất cả hoạt động
                        </button>
                      )
                }
                {(role === 'responsible' || role === 'accountable') && taskActions.length > 1 && (
                  <button className='btn btn-block btn-default btn-sm' onClick={() => handleShowSort()}>
                    Sắp xếp hoạt động
                  </button>
                )}
              </>
            )}
          </div>

          {/* Chuyển qua tab trao đổi */}
          <div className={selected === 'taskComment' ? 'active tab-pane' : 'tab-pane'} id='taskComment'>
            {/* Thêm bình luận cho công việc */}
            <img className='user-img-level1' src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='User Image' />
            <ContentMaker
              idQuill={`add-comment-task-${id}`}
              inputCssClass='text-input-level1'
              controlCssClass='tool-level1 row'
              onFilesChange={onTaskCommentFilesChange}
              onFilesError={onFilesError}
              files={newTaskComment.files}
              text={newTaskComment.descriptionDefault}
              placeholder={translate('task.task_perform.enter_comment')}
              submitButtonText={translate('task.task_perform.create_comment')}
              onTextChange={(value, imgs) => {
                setState({
                  ...state,
                  newTaskComment: {
                    ...state.newTaskComment,
                    description: value,
                    descriptionDefault: null
                  }
                })
              }}
              onSubmit={(e) => {
                submitTaskComment(task?._id)
              }}
            />

            {task && typeof taskComments !== 'undefined' && taskComments.length !== 0 ? (
              <ShowMoreShowLess
                id={`taskComment${id}`}
                classShowMoreLess='tool-level1'
                styleShowMoreLess={{
                  display: 'inline-block',
                  marginBotton: 15
                }}
              >
                {taskComments.map((item, index) => {
                  const listImage = item.files.map((elem) => (isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                  return (
                    <div key={item._id} className={index > 3 ? 'hide-component' : ''}>
                      <img className='user-img-level1' src={process.env.REACT_APP_SERVER + item.creator?.avatar} alt='User Image' />
                      {editTaskComment !== item._id && ( // Khi đang edit thì ẩn đi
                        <>
                          <div className='content-level1'>
                            <a style={{ cursor: 'pointer' }}>{item.creator?.name} </a>
                            {item.description.split('\n').map((item, idx) => {
                              return <span key={idx}>{parse(item)}</span>
                            })}
                            {item.creator?._id === currentUser && (
                              <div className='btn-group pull-right'>
                                <span data-toggle='dropdown'>
                                  <i className='fa fa-ellipsis-h' />
                                </span>
                                <ul className='dropdown-menu'>
                                  <li>
                                    <a style={{ cursor: 'pointer' }} onClick={() => handleEditTaskComment(item)}>
                                      {translate('task.task_perform.edit_comment')}
                                    </a>
                                  </li>
                                  <li>
                                    <a style={{ cursor: 'pointer' }} onClick={() => props.deleteTaskComment(item._id, task._id)}>
                                      {translate('task.task_perform.delete_comment')}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>

                          <ul className='list-inline tool-level1'>
                            <li>
                              <span className='text-sm'>
                                <DateTimeConverter dateTime={item.createdAt} />
                              </span>
                            </li>
                            <li>
                              <a
                                style={{ cursor: 'pointer' }}
                                className='link-black text-sm'
                                onClick={() => handleShowChildComment(item._id)}
                              >
                                <i className='fa fa-comments-o margin-r-5' /> {translate('task.task_perform.comment')} (
                                {item.comments.length}) &nbsp;
                              </a>
                            </li>
                            {item.files.length > 0 && (
                              <>
                                <li style={{ display: 'inline-table' }}>
                                  <div>
                                    <a
                                      style={{ cursor: 'pointer' }}
                                      className='link-black text-sm'
                                      onClick={() => handleShowFile(item._id)}
                                    >
                                      <b>
                                        <i className='fa fa-paperclip' aria-hidden='true'>
                                          {' '}
                                          {translate('task.task_perform.file_attach')} ({item.files && item.files.length})
                                        </i>
                                      </b>
                                    </a>{' '}
                                  </div>
                                </li>
                                {showFile.some((obj) => obj === item._id) && (
                                  <li style={{ display: 'inline-table' }}>
                                    {item.files.map((elem, index) => {
                                      return (
                                        <div style={{ cursor: 'pointer' }} key={index} className='show-files-task'>
                                          {isImage(elem.name) ? (
                                            <ApiImage
                                              listImage={listImage}
                                              className='attachment-img files-attach'
                                              style={{ marginTop: '5px' }}
                                              src={elem.url}
                                              file={elem}
                                              requestDownloadFile={requestDownloadFile}
                                            />
                                          ) : (
                                            <div>
                                              <a style={{ marginTop: '2px' }} onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}>
                                                {' '}
                                                {elem.name}
                                              </a>
                                              <a href='#' onClick={() => showFilePreview(elem && elem.url)}>
                                                <u>{elem && checkTypeFile(elem.url) ? <i className='fa fa-eye' /> : ''}</u>
                                              </a>
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </li>
                                )}
                              </>
                            )}
                          </ul>
                        </>
                      )}

                      {/* Chỉnh sửa nội dung trao đổi của công việc */}
                      {editTaskComment === item._id && (
                        <div>
                          <ContentMaker
                            idQuill={`edit-content-${item._id}`}
                            inputCssClass='text-input-level1'
                            controlCssClass='tool-level2 row'
                            onFilesChange={onEditTaskCommentFilesChange}
                            onFilesError={onFilesError}
                            files={newTaskCommentEdited.files}
                            text={newTaskCommentEdited.descriptionDefault}
                            submitButtonText={translate('task.task_perform.save_edit')}
                            cancelButtonText={translate('task.task_perform.cancel')}
                            handleEdit={(e) => handleEditTaskComment(e)}
                            onTextChange={(value, imgs) => {
                              setState({
                                ...state,
                                newTaskCommentEdited: {
                                  ...state.newTaskCommentEdited,
                                  description: value
                                }
                              })
                            }}
                            onSubmit={(e) => {
                              handleSaveEditTaskComment(e, task._id, item._id, item.description)
                            }}
                          />
                          {/* Hiện file đã tải lên */}
                          {item.files.length > 0 && (
                            <div className='tool-level1' style={{ marginTop: -10 }}>
                              {item.files.map((file, index) => {
                                return (
                                  <div key={index}>
                                    <a style={{ cursor: 'pointer' }}>{file.name} &nbsp;</a>
                                    <a
                                      style={{ cursor: 'pointer' }}
                                      className='link-black text-sm btn-box-tool'
                                      onClick={() => {
                                        handleDeleteFile(file._id, file.name, item._id, 'taskcomment')
                                      }}
                                    >
                                      <i className='fa fa-times' />
                                    </a>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hiển thị bình luận cho bình luận */}
                      {showChildComment.some((x) => x === item._id) && (
                        <div className='comment-content-child'>
                          {reverseArr(item.comments).map((child) => {
                            const listImage = child.files.map((elem) => (isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                            return (
                              <div key={child._id}>
                                <img
                                  className='user-img-level2'
                                  src={process.env.REACT_APP_SERVER + child.creator?.avatar}
                                  alt='User Image'
                                />
                                {editCommentOfTaskComment !== child._id && ( // Đang edit thì ẩn đi
                                  <div>
                                    <div className='content-level2'>
                                      <a style={{ cursor: 'pointer' }}>{child.creator?.name} </a>
                                      {child.description.split('\n').map((item, idx) => {
                                        return <span key={idx}>{parse(item)}</span>
                                      })}

                                      {child.creator?._id === currentUser && (
                                        <div className='btn-group pull-right'>
                                          <span data-toggle='dropdown'>
                                            <i className='fa fa-ellipsis-h' />
                                          </span>
                                          <ul className='dropdown-menu'>
                                            <li>
                                              <a style={{ cursor: 'pointer' }} onClick={() => handleEditCommentOfTaskComment(child)}>
                                                {translate('task.task_perform.edit_comment')}
                                              </a>
                                            </li>
                                            <li>
                                              <a
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => props.deleteCommentOfTaskComment(child._id, task._id)}
                                              >
                                                {translate('task.task_perform.delete_comment')}
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                    <ul className='list-inline tool-level2'>
                                      <li>
                                        <span className='text-sm'>
                                          <DateTimeConverter dateTime={child.createdAt} />
                                        </span>
                                      </li>
                                      {child.files.length > 0 && (
                                        <>
                                          <li style={{ display: 'inline-table' }}>
                                            <div>
                                              <a
                                                style={{ cursor: 'pointer' }}
                                                className='link-black text-sm'
                                                onClick={() => handleShowFile(child._id)}
                                              >
                                                <b>
                                                  <i className='fa fa-paperclip' aria-hidden='true'>
                                                    {' '}
                                                    {translate('task.task_perform.file_attach')} ({child.files && child.files.length})
                                                  </i>
                                                </b>
                                              </a>
                                            </div>
                                          </li>
                                          {showFile.some((obj) => obj === child._id) && (
                                            <li
                                              style={{
                                                display: 'inline-table'
                                              }}
                                            >
                                              {child.files.map((elem, index) => {
                                                return (
                                                  <div key={index} className='show-files-task'>
                                                    {isImage(elem.name) ? (
                                                      <ApiImage
                                                        listImage={listImage}
                                                        className='attachment-img files-attach'
                                                        style={{
                                                          marginTop: '5px'
                                                        }}
                                                        src={elem.url}
                                                        file={elem}
                                                        requestDownloadFile={requestDownloadFile}
                                                      />
                                                    ) : (
                                                      <div>
                                                        <a
                                                          style={{
                                                            cursor: 'pointer',
                                                            marginTop: '2px'
                                                          }}
                                                          onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}
                                                        >
                                                          {' '}
                                                          {elem.name}
                                                        </a>
                                                        <a href='#' onClick={() => showFilePreview(elem && elem.url)}>
                                                          <u>{elem && checkTypeFile(elem.url) ? <i className='fa fa-eye' /> : ''}</u>
                                                        </a>
                                                      </div>
                                                    )}
                                                  </div>
                                                )
                                              })}
                                            </li>
                                          )}
                                        </>
                                      )}
                                    </ul>
                                  </div>
                                )}

                                {/* Sửa bình luận của bình luận */}
                                {editCommentOfTaskComment === child._id && (
                                  <div>
                                    <ContentMaker
                                      idQuill={`edit-child-comment-${child._id}`}
                                      inputCssClass='text-input-level2'
                                      controlCssClass='tool-level2 row'
                                      onFilesChange={onEditCommentOfTaskCommentFilesChange}
                                      onFilesError={onFilesError}
                                      files={newCommentOfTaskCommentEdited.files}
                                      text={newCommentOfTaskCommentEdited.descriptionDefault}
                                      submitButtonText={translate('task.task_perform.save_edit')}
                                      cancelButtonText={translate('task.task_perform.cancel')}
                                      handleEdit={(e) => handleEditCommentOfTaskComment(e)}
                                      onTextChange={(value, imgs) => {
                                        setState({
                                          ...state,
                                          newCommentOfTaskCommentEdited: {
                                            ...state.newCommentOfTaskCommentEdited,
                                            description: value
                                          }
                                        })
                                      }}
                                      onSubmit={(e) => {
                                        handleSaveEditCommentOfTaskComment(e, child._id, task._id, child.description)
                                      }}
                                    />
                                    {/* Hiện file đã tải lên */}
                                    {child.files.length > 0 && (
                                      <div
                                        className='tool-level2'
                                        style={{
                                          marginTop: -8,
                                          fontSize: '12px'
                                        }}
                                      >
                                        {child.files.map((file) => {
                                          return (
                                            <div>
                                              <a style={{ cursor: 'pointer' }}>{file.name} &nbsp;</a>
                                              <a
                                                style={{ cursor: 'pointer' }}
                                                className='link-black text-sm btn-box-tool'
                                                onClick={() => {
                                                  handleDeleteFile(file._id, file.name, item._id, 'commentoftaskcomment')
                                                }}
                                              >
                                                <i className='fa fa-times' />
                                              </a>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                            return true
                          })}
                          {/* Thêm bình luận cho bình luận */}
                          <div>
                            <img className='user-img-level2' src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='user avatar' />
                            <ContentMaker
                              idQuill={`add-child-comment-${item._id}`}
                              inputCssClass='text-input-level2'
                              controlCssClass='tool-level2 row'
                              onFilesChange={(files) => onCommentOfTaskCommentFilesChange(item._id, files)}
                              onFilesError={onFilesError}
                              files={newCommentOfTaskComment[`${item._id}`]?.files}
                              text={newCommentOfTaskComment[`${item._id}`]?.descriptionDefault}
                              placeholder={translate('task.task_perform.enter_comment')}
                              submitButtonText={translate('task.task_perform.create_comment')}
                              onTextChange={(value, imgs) => {
                                setState((state) => {
                                  state.newCommentOfTaskComment[item._id] = {
                                    ...state.newCommentOfTaskComment[item._id],
                                    description: value,
                                    creator: currentUser,
                                    descriptionDefault: null
                                  }
                                  return { ...state }
                                })
                              }}
                              onSubmit={(e) => {
                                submitCommentOfTaskComment(item._id, task._id)
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </ShowMoreShowLess>
            ) : null}
          </div>

          {/* Chuyển qua tab tài liệu */}
          <div className={selected === 'documentTask' ? 'active tab-pane' : 'tab-pane'} id='documentTask'>
            <div>
              {documents && (
                <ShowMoreShowLess
                  id={`documentTask${id}`}
                  styleShowMoreLess={{
                    display: 'inline-block',
                    marginBotton: 15,
                    marginTop: 15
                  }}
                >
                  {documents.map((item, index) => {
                    const listImage = item.files.map((elem) => (isImage(elem.name) ? elem.url : -1)).filter((url) => url !== -1)
                    return (
                      <React.Fragment key={`documents-${item._id}`}>
                        {showEditTaskFile !== item._id && (
                          <div key={item._id} className={`item-box ${index > 3 ? 'hide-component' : ''}`}>
                            {currentUser === item.creator?._id && (
                              <div className='btn-group pull-right'>
                                <span data-toggle='dropdown'>
                                  <i className='fa fa-ellipsis-h' />
                                </span>
                                <ul className='dropdown-menu'>
                                  <li>
                                    <a style={{ cursor: 'pointer' }} onClick={() => handleEditFileTask(item)}>
                                      {translate('task.task_perform.edit')}
                                    </a>
                                  </li>
                                  <li>
                                    <a style={{ cursor: 'pointer' }} onClick={() => props.deleteDocument(item._id, task._id)}>
                                      {translate('task.task_perform.delete')}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            )}
                            <div>
                              <ul className='list-inline list-name-document'>
                                <li>
                                  <strong>{item.creator?.name} </strong>
                                </li>
                                <li>
                                  <span className='text-sm'>
                                    <DateTimeConverter dateTime={item.createdAt} />
                                  </span>
                                </li>
                              </ul>
                              {parse(item.description)}
                            </div>
                            <div>
                              {showFile.some((obj) => obj === item._id) ? (
                                <a
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    handleShowFile(item._id)
                                  }}
                                >
                                  Ẩn bớt
                                  <i className='fa fa-angle-double-up' />
                                </a>
                              ) : (
                                <a
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    handleShowFile(item._id)
                                  }}
                                >
                                  Hiển thị {item?.files?.length} tài liệu &nbsp; <i className='fa fa-angle-double-down' />{' '}
                                </a>
                              )}
                            </div>
                            {showFile.some((obj) => obj === item._id) && (
                              <div>
                                {item.files.map((elem, index) => {
                                  return (
                                    <div style={{ cursor: 'pointer' }} key={index} className='show-files-task'>
                                      {isImage(elem.name) ? (
                                        <ApiImage
                                          listImage={listImage}
                                          className='attachment-img files-attach'
                                          style={{ marginTop: '5px' }}
                                          src={elem.url}
                                          file={elem}
                                          requestDownloadFile={requestDownloadFile}
                                        />
                                      ) : (
                                        <div>
                                          <a
                                            style={{
                                              cursor: 'pointer',
                                              marginTop: '2px'
                                            }}
                                            onClick={(e) => requestDownloadFile(e, elem.url, elem.name)}
                                          >
                                            {' '}
                                            {elem.name}
                                          </a>
                                          <a href='#' onClick={() => showFilePreview(elem && elem.url)}>
                                            <u>{elem && checkTypeFile(elem.url) ? <i className='fa fa-eye' /> : ''}</u>
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        {showEditTaskFile === item._id && (
                          <div style={{ marginTop: '15px' }}>
                            <img className='user-img-level1' src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='user avatar' />
                            <ContentMaker
                              idQuill={`edit-file-${item._id}`}
                              inputCssClass='text-input-level1'
                              controlCssClass='tool-level2 row'
                              onFilesChange={onEditFileTask}
                              onFilesError={onFilesError}
                              files={fileTaskEdited.files}
                              text={fileTaskEdited.descriptionDefault}
                              submitButtonText={translate('task.task_perform.save_edit')}
                              cancelButtonText={translate('task.task_perform.cancel')}
                              handleEdit={(e) => handleEditFileTask(e)}
                              onTextChange={(value, imgs) => {
                                setState({
                                  ...state,
                                  fileTaskEdited: {
                                    ...state.fileTaskEdited,
                                    description: value
                                  }
                                })
                              }}
                              onSubmit={(e) => {
                                handleSaveEditTaskFile(e, item.description, item._id, task._id)
                              }}
                            />
                            {item.files.length > 0 && (
                              <div className='tool-level1' style={{ marginTop: -10 }}>
                                {item.files.map((file) => {
                                  return (
                                    <div>
                                      <a style={{ cursor: 'pointer' }}>{file.name} &nbsp;</a>
                                      <a
                                        style={{ cursor: 'pointer' }}
                                        className='link-black text-sm btn-box-tool'
                                        onClick={() => {
                                          handleDeleteFile(file._id, file.name, item._id, 'task')
                                        }}
                                      >
                                        <i className='fa fa-times' />
                                      </a>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    )
                  })}
                </ShowMoreShowLess>
              )}
            </div>
            <div style={{ marginTop: '15px' }}>
              <img className='user-img-level1' src={process.env.REACT_APP_SERVER + auth.user.avatar} alt='user avatar' />
              <ContentMaker
                idQuill={`upload-file-${id}`}
                inputCssClass='text-input-level1'
                controlCssClass='tool-level1'
                onFilesChange={onTaskFilesChange}
                onFilesError={onFilesError}
                files={taskFiles.files}
                text={taskFiles.descriptionDefault}
                placeholder={translate('task.task_perform.enter_description')}
                submitButtonText={translate('task.task_perform.create_document')}
                onTextChange={(value, imgs) => {
                  setState({
                    ...state,
                    taskFiles: {
                      ...state.taskFiles,
                      description: value,
                      descriptionDefault: null
                    }
                  })
                }}
                disableSubmit
                onSubmit={(e) => {
                  handleUploadFile(task?._id, currentUser)
                }}
              />
            </div>
          </div>
          <div className={selected === 'taskOutputs' ? 'active tab-pane' : 'tab-pane'} id='subTask'>
            <TaskOutputsTab role={role} />
          </div>
          {/* Chuyển qua tab công việc liên quan */}
          <div className={selected === 'subTask' ? 'active tab-pane' : 'tab-pane'} id='subTask'>
            <SubTaskTab subtasks={subtasks} />
          </div>

          {/* Chuyển qua tab Bấm giờ */}
          <div className={selected === 'logTimer' ? 'active tab-pane' : 'tab-pane'} id='logTimer'>
            <div className='row' style={{ display: 'flex', alignItems: 'center' }}>
              <div className='col-md-6'>
                <div className='form-group'>
                  <label>Hình thức bấm giờ</label>
                  <select className='form-control' value={state.filterLogAutoStopped} onChange={filterLogAutoStopped}>
                    <option value='all'>Tất cả</option>
                    <option value='hand'>Bấm giờ</option>
                    <option value='auto'>Bấm hẹn giờ</option>
                    <option value='addlog'>Bấm bù giờ</option>
                  </select>
                </div>
              </div>

              <div className='col-md-6'>
                <button className='btn btn-success' style={{ float: 'right' }} onClick={handleOpenModalAddLog}>
                  Add log hours
                </button>
              </div>
              <ModalAddLogTime />
            </div>
            {logTimer && (
              <ShowMoreShowLess
                id={`logTimer${id}`}
                styleShowMoreLess={{
                  display: 'inline-block',
                  marginBottom: 15,
                  marginTop: 15
                }}
              >
                {logTimer.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.stoppedAt && (
                      <div key={item._id} className={`item-box ${index > 3 ? 'hide-component' : ''}`}>
                        <h3 className={`pull-right ${item.acceptLog ? 'text-green' : 'text-red'}`}>{convertTime(item.duration)}</h3>
                        <a style={{ fontWeight: 700, cursor: 'pointer' }}>
                          {item.creator?.name}{' '}
                          {item.delegator ? (
                            <span style={{ color: '#333' }}>
                              {` (${translate('task.task_perform.delegated_from')} ${item.delegator?.name})`}
                            </span>
                          ) : null}
                        </a>
                        <div>
                          <i className='fa fa-clock-o'> </i> {moment(item.startedAt).format('DD/MM/YYYY HH:mm:ss')}
                          {' - '}
                          <i className='fa fa-clock-o'> </i> {moment(item.stoppedAt).format('DD/MM/YYYY HH:mm:ss')})
                        </div>
                        <div>
                          <i
                            style={{ marginRight: '5px' }}
                            className={`${item.autoStopped === 1 ? 'text-green fa fa-hand-pointer-o' : item.autoStopped === 2 ? 'text-red fa fa-clock-o' : 'text-red fa fa-plus'}`}
                          >
                            {item.autoStopped === 1 ? 'Bấm giờ' : item.autoStopped === 2 ? 'Bấm hẹn giờ' : 'Bấm bù giờ'}
                          </i>
                          {role === 'accountable' ? (
                            <>
                              <i className={`${item.acceptLog ? 'text-green fa fa-check' : 'text-red fa fa-close'}`}>
                                {' '}
                                {item.acceptLog ? 'Được chấp nhận' : 'Không được chấp nhận'}
                              </i>
                              <a
                                style={{
                                  cursor: 'pointer',
                                  marginLeft: 10,
                                  fontWeight: 'bold'
                                }}
                                className={item.acceptLog ? 'text-red' : 'text-green'}
                                onClick={
                                  item.acceptLog
                                    ? () => {
                                        props.editTimeSheetLog(props.id, item._id, {
                                          acceptLog: false
                                        })
                                      }
                                    : () => {
                                        props.editTimeSheetLog(props.id, item._id, {
                                          acceptLog: true
                                        })
                                      }
                                }
                              >
                                [ {item.acceptLog ? 'Hủy' : 'Chấp nhận'} ]
                              </a>
                            </>
                          ) : (
                            <i className={`${item.acceptLog ? 'text-green fa fa-check' : 'text-red fa fa-close'}`}>
                              {' '}
                              {item.acceptLog ? 'Được chấp nhận' : 'Không được chấp nhận'}
                            </i>
                          )}
                        </div>
                        <div>
                          <i className='fa fa-edit' />
                          {item.description ? item.description : translate('task.task_perform.none_description')}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </ShowMoreShowLess>
            )}
          </div>

          {/* Chuyển qua tab Nhật ký lịch sử */}
          <div className={selected === 'historyLog' ? 'active tab-pane' : 'tab-pane'} id='historyLog'>
            {logs && (
              <ShowMoreShowLess
                id={`historyLog${id}`}
                styleShowMoreLess={{
                  display: 'inline-block',
                  marginBotton: 15
                }}
              >
                {logs.map((item, index) => (
                  <div key={item._id} className={`item-box ${index > 3 ? 'hide-component' : ''}`}>
                    <a style={{ fontWeight: 700, cursor: 'pointer' }}>
                      {item.creator?.name}{' '}
                      {item.delegator ? (
                        <span style={{ color: '#333' }}>
                          {` (${translate('task.task_perform.delegated_from')} ${item.delegator?.name})`}
                        </span>
                      ) : null}
                    </a>
                    {item.title ? item.title : translate('task.task_perform.none_description')}
                    &nbsp; ({moment(item.createdAt).format('HH:mm:ss DD/MM/YYYY')})
                    <div>{item.description ? parse(item.description) : translate('task.task_perform.none_description')}</div>
                  </div>
                ))}
              </ShowMoreShowLess>
            )}
          </div>

          {/* Chuyển qua tab quy trình */}
          <div className={selected === 'process' ? 'active tab-pane' : 'tab-pane'} id='process'>
            {task && task.process && (
              <div>
                {task && (
                  <ViewProcess
                    isTabPane
                    data={task && task.process}
                    idProcess={task && task.process._id}
                    xmlDiagram={task && task.process.xmlDiagram}
                    processName={task && task.process.processName}
                    processDescription={task && task.process.processDescription}
                    infoTask={task && task.process.tasks}
                    creator={task && task.process.creator}
                  />
                )}
              </div>
            )}
          </div>
          {/* Dữ liệu vào */}
          <div className={selected === 'incoming-data' ? 'active tab-pane' : 'tab-pane'} id='incoming-data'>
            {task && task.process && <IncomingDataTab taskId={task._id} preceedingTasks={task.preceedingTasks} />}
          </div>

          {/** Dữ liệu ra */}
          <div className={selected === 'outgoing-data' ? 'active tab-pane' : 'tab-pane'} id='outgoing-data'>
            {task && task.process && (
              <OutgoingDataTab
                isOutgoingData={task && task.followingTasks && task.followingTasks.length !== 0}
                taskId={task._id}
                task={task}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  const { performtasks, auth, notifications } = state
  return { performtasks, auth, notifications }
}

const actionCreators = {
  createActionComment: performTaskAction.createActionComment,
  editActionComment: performTaskAction.editActionComment,
  deleteActionComment: performTaskAction.deleteActionComment,
  createTaskAction: performTaskAction.createTaskAction,
  editTaskAction: performTaskAction.editTaskAction,
  deleteTaskAction: performTaskAction.deleteTaskAction,
  startTimer: performTaskAction.startTimerTask,
  stopTimer: performTaskAction.stopTimerTask,
  editTimeSheetLog: performTaskAction.editTimeSheetLog,
  editTaskComment: performTaskAction.editTaskComment,
  deleteTaskComment: performTaskAction.deleteTaskComment,
  createTaskComment: performTaskAction.createTaskComment,
  createCommentOfTaskComment: performTaskAction.createCommentOfTaskComment,
  editCommentOfTaskComment: performTaskAction.editCommentOfTaskComment,
  deleteCommentOfTaskComment: performTaskAction.deleteCommentOfTaskComment,
  evaluationAction: performTaskAction.evaluationAction,
  evaluationAllAction: performTaskAction.evaluationAllAction,
  deleteActionEvaluation: performTaskAction.deleteActionEvaluation,
  confirmAction: performTaskAction.confirmAction,
  downloadFile: AuthActions.downloadFile,
  uploadFile: performTaskAction.uploadFile,
  deleteFileAction: performTaskAction.deleteFileAction,
  deleteFileCommentOfAction: performTaskAction.deleteFileCommentOfAction,
  deleteFileTaskComment: performTaskAction.deleteFileTaskComment,
  deleteFileChildTaskComment: performTaskAction.deleteFileChildTaskComment,
  // getTaskLog: performTaskAction.getTaskLog,
  deleteFileTask: performTaskAction.deleteFileTask,
  deleteDocument: performTaskAction.deleteDocument,
  editDocument: performTaskAction.editDocument,
  getAllPreceedingTasks: performTaskAction.getAllPreceedingTasks,
  sortActions: performTaskAction.sortActions,

  refreshData: performTaskAction.refreshData
}

export default connect(mapState, actionCreators)(withTranslate(ActionTab))
