import { getStorage } from '../../../../config'
import { sendRequest } from '../../../../helpers/requestHelper'

export const performTaskService = {
  getTimesheetLogs,
  getTimerStatusTask,
  getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit,
  startTimerTask,
  stopTimerTask,
  editTimeSheetLog,

  createActionComment,
  deleteActionComment,
  editActionComment,

  createTaskAction,
  editTaskAction,
  deleteTaskAction,
  confirmAction,

  createTaskComment,
  editTaskComment,
  deleteTaskComment,
  createCommentOfTaskComment,
  editCommentOfTaskComment,
  deleteCommentOfTaskComment,

  getTaskLog,

  deleteFileAction,
  deleteFileCommentOfAction,
  deleteFileTaskComment,
  deleteFileChildTaskComment,

  uploadFile,
  deleteFileTask,

  editTaskByAccountableEmployees,
  editTaskByResponsibleEmployees,
  editActivateOfTask,
  editArchivedOfTask,
  editDocument,
  deleteDocument,

  evaluationAction,
  deleteActionEvaluation,
  evaluateTaskByAccountableEmployees,
  evaluateTaskByConsultedEmployees,
  evaluateTaskByResponsibleEmployees,
  editHoursSpentInEvaluate,

  deleteEvaluation,

  editInformationTask,
  getById,
  confirmTask,
  requestAndApprovalCloseTask,
  openTaskAgain,
  editEmployeeCollaboratedWithOrganizationalUnits,

  // Comment in process
  createComment,
  editComment,
  deleteComment,
  createChildComment,
  editChildComment,
  deleteChildComment,
  deleteFileComment,
  deleteFileChildComment,

  getAllPreceedingTasks,
  sortActions,
  evaluationAllAction,

  evaluateTaskByResponsibleEmployeesProject,
  evaluateTaskByAccountableEmployeesProject,

  createTaskOutputs,
  editTaskOutputs,
  getTaskOutputs,
  approveTaskOutputs,
  editSubmissionResults,
  deleteSubmissionResults,
  deleteFileOfTaskOutput,

  createCommentOfTaskOutput,
  editCommentOfTaskOutput
}

/**
 * lấy công việc theo id
 * @param {*} taskId id công việc
 */
function getById(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'GET'
    },
    false,
    true,
    'task.task_management'
  )
}

/**
 * lấy lịch sử bấm giờ
 * @param {*} taskId  id của task
 */
function getTimesheetLogs(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/timesheet-logs`,
      method: 'GET'
    },
    false,
    false,
    'task.task_perform'
  )
}

/**
 * Lấy ra các đồng hồ đang bấm giờ
 */
function getTimerStatusTask(taskId) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/task-timesheet-logs`,
      method: 'GET',
      params: {
        taskId,
        userId
      }
    },
    false,
    false,
    'task.task_perform'
  )
}

/**
 * Lấy các nhân viên đang bấm giờ trong 1 đơn vị
 */
function getCurrentTaskTimesheetLogOfEmployeeInOrganizationalUnit(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/task-timesheet-logs`,
      method: 'GET',
      params: {
        currentTimesheetLog: 1,
        organizationalUnitId: data?.organizationalUnitId
      }
    },
    false,
    false,
    'task.task_perform'
  )
}

/**
 * Bắt đầu bấm giờ
 * @param {*} newTimer dữ liệu gửi lên
 */
function startTimerTask(taskId, newTimer) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/timesheet-logs/start-timer`,
      method: 'POST',
      data: newTimer
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Chỉnh sửa lịch sử bấm giờ
 */
function editTimeSheetLog(taskId, timesheetlogId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/timesheet-logs/${timesheetlogId}`,
      method: 'PATCH',
      data
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Dừng bấm giờ
 * @param {*} newTimer dữ liệu gửi lên
 */
function stopTimerTask(taskId, newTimer) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/timesheet-logs/stop-timer`,
      method: 'POST',
      data: newTimer
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Tạo mới bình luận của hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} newComment nội dung bình luận
 */
function createActionComment(taskId, actionId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments`,
      method: 'POST',
      data: newComment
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Thêm mới hoạt động
 * @param {*} taskId id của task
 * @param {*} newAction nội dung hành động
 */
function createTaskAction(taskId, newAction) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions`,
      method: 'POST',
      data: newAction
    },
    true,
    true,
    'task.task_perform'
  )
}

/**
 * Sửa bình luận cho hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} commentId id của bình luận cần sửa
 * @param {*} newComment nội dung chỉnh sửa
 */
function editActionComment(taskId, actionId, commentId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/${commentId}`,
      method: 'PATCH',
      data: newComment
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Chỉnh sửa hoạt động
 * @param {*} actionId id của hoạt động
 * @param {*} newAction dữ liệu
 * @param {*} taskId id của task
 */
function editTaskAction(actionId, newAction, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
      method: 'PATCH',
      data: newAction
    },
    false,
    true,
    'task.task_perform'
  )
}
/**
 * Xóa bình luận của hoạt động
 * @param {*} taskId id của task
 * @param {*} actionId id của hoạt động cha
 * @param {*} commentId id của bình luận cần xóa
 */
function deleteActionComment(taskId, actionId, commentId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/${commentId}`,
      method: 'DELETE'
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xóa hoạt động
 * @param {*} actionId id của hoat động cần xóa
 * @param {*} taskId id của task
 */
function deleteTaskAction(actionId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
      method: 'DELETE'
    },
    false,
    true,
    'task.task_perform'
  )
}

/** Chỉnh sửa task information */
function editInformationTask(taskId, taskInformations) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-informations`,
      method: 'PATCH',
      data: taskInformations
    },
    true,
    true,
    'task.task_perform'
  )
}

/** Xác nhận công việc */
function confirmTask(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      params: {
        type: 'confirm_task'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/** Yêu cầu kết thúc công việc */
function requestAndApprovalCloseTask(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      data: {
        ...data,
        requestAndApprovalCloseTask: 1
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/** Mở lại công việc đã kết thúc */
function openTaskAgain(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      data: {
        type: 'open_task_again'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/** Chỉnh sửa đơn vị phối hợp */
function editEmployeeCollaboratedWithOrganizationalUnits(taskId, employeeCollaboratedWithUnit) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      params: {
        type: 'edit_employee_collaborated_with_unit'
      },
      data: employeeCollaboratedWithUnit
    },
    true,
    true,
    'task.task_management'
  )
}
/**
 * Tạo bình luận công việc
 * @param {*} taskId id của task cần tạo
 * @param {*} newComment nội dung bình luận
 */
function createTaskComment(taskId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments`,
      method: 'POST',
      data: newComment
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Sửa bình luận công việc
 * @param {*} taskId id của task
 * @param {*} commentId id của bình luận cần sửa
 * @param {*} newComment nội dung sửa
 */
function editTaskComment(taskId, commentId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}`,
      method: 'PATCH',
      data: newComment
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xóa bình luận công việc
 * @param {*} commentId id của bình luận cần xóa
 * @param {*} taskId id của task chứa bình luận
 */
function deleteTaskComment(commentId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}`,
      method: 'DELETE'
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Tạo bình luận cho bình luận
 * @param {*} commentId id của bình luận cha
 * @param {*} taskId id của task
 * @param {*} newComment nội dung bình luận
 */
function createCommentOfTaskComment(commentId, taskId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}/comments`,
      method: 'POST',
      data: newComment
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Sửa bình luận của bình luận
 * @param {*} commentId id của bình luận cần xóa
 * @param {*} taskId id của task
 * @param {*} newComment bình luận mới
 */
function editCommentOfTaskComment(commentId, taskId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/comments/${commentId}`,
      method: 'PATCH',
      data: newComment
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xóa bình luận của bình luận
 * @param {*} commentId
 * @param {*} taskId
 */
function deleteCommentOfTaskComment(commentId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/comments/${commentId}`,
      method: 'DELETE'
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Đánh giá hoạt động
 * @param {*} actionId id của action
 * @param {*} evaluation điểm rating người khác chấm
 */
function evaluationAction(actionId, taskId, evaluation) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
      method: 'PATCH',
      data: evaluation
    },
    false,
    true,
    'task.task_perform'
  )
}

function evaluationAllAction(taskId, evaluation) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/evaluation/all`,
      method: 'PATCH',
      data: evaluation
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xoá đánh giá hoạt động
 * @param {*} actionId id của action
 * @param {*} taskId id của công việc
 * @param {*} evaluationId id của đánh giá
 */
function deleteActionEvaluation(actionId, taskId, evaluationId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/evaluation/${evaluationId}`,
      method: 'DELETE'
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xác nhận hành động
 * @param {*} actionId id của action cần xác nhận
 * @param {*} idUser id của người xác nhận
 * @param {*} taskId id của task
 */
function confirmAction(userId, actionId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}`,
      method: 'POST',
      data: {
        userId
      }
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Upload file
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} data: dữ liệu cần upload
 */
function uploadFile(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/files`,
      method: 'POST',
      data
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xóa tài liệu của hoạt động
 * @param {*} fileId: id của file cần xóa
 * @param {*} actionId: id của hoạt động chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type
 */
function deleteFileAction(fileId, actionId, taskId, type) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/files/${fileId}`,
      method: 'PATCH'
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xóa tài liệu của bình luận hoạt động
 * @param {*} fileId: id của file cần xóa
 * @param {*} actionId: id của hoạt động chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type
 */
function deleteFileCommentOfAction(fileId, actionId, taskId, type) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-actions/${actionId}/comments/files/${fileId}`,
      method: 'PATCH'
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xóa tài liệu của trao đổi
 * @param {*} fileId: id của file cần xóa
 * @param {*} commentId: id của bình luận chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type
 */
function deleteFileTaskComment(fileId, commentId, taskId, type) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}/files/${fileId}`,
      method: 'PATCH'
    },
    false,
    true,
    'task.task_perform'
  )
}

/**
 * Xóa tài liệu của bình luận
 * @param {*} fileId: id của file cần xóa
 * @param {*} commentId: id của bình luận chứa file cần xóa
 * @param {*} taskId: id của task chứa file cần xóa
 * @param {*} type:
 */
function deleteFileChildTaskComment(fileId, commentId, taskId, type) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-comments/${commentId}/comments/files/${fileId}`,
      method: 'PATCH'
    },
    false,
    true,
    'task.task_perform'
  )
}

// Hàm thêm nhật ký cho một công việc
function getTaskLog(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/logs`,
      method: 'GET'
    },
    false,
    false,
    'task.task_perform'
  )
}

/**
 * chỉnh sửa trạng thái lưu kho
 * @param {*} taskId id công việc
 */

function editArchivedOfTask(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      data: {
        type: 'edit_archived'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * edit status of task
 * @param {*} taskId id cua task
 * @param {*} status trang thai muon cap nhat
 */
function editActivateOfTask(taskId, typeOfTask, listSelected) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      data: {
        typeOfTask,
        listSelected,
        type: 'edit_activate'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * edit Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByResponsibleEmployees(data, taskId) {
  const formData = new FormData()
  formData.append('type', 'all')
  formData.append('role', 'responsible')
  formData.append('data', JSON.stringify(data))

  // append image
  data.imageDescriptions &&
    data.imageDescriptions.forEach((x) => {
      formData.append('files', x)
    })

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      data: formData
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * edit Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editTaskByAccountableEmployees(data, taskId) {
  const formData = new FormData()
  formData.append('type', 'all')
  formData.append('role', 'accountable')
  formData.append('data', JSON.stringify(data))

  // append image
  data.imageDescriptions &&
    data.imageDescriptions.forEach((x) => {
      formData.append('files', x)
    })

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}`,
      method: 'POST',
      data: formData
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * evaluate Task By Responsible Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByResponsibleEmployees(data, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
      method: 'POST',
      data: {
        data,
        role: 'responsible'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * evaluate Task By Consulted Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByConsultedEmployees(data, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
      method: 'POST',
      data: {
        data,
        role: 'consulted'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByAccountableEmployees(data, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
      method: 'POST',
      data: {
        data,
        role: 'accountable'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * evaluate Task By Accountable Employees
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function editHoursSpentInEvaluate(data, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate`,
      method: 'POST',
      data: {
        data,
        type: 'hoursSpent'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * Delete file of task
 * @param {*} taskId id task
 * @param {*} evaluationId id evaluation
 */
function deleteEvaluation(taskId, evaluationId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluations/${evaluationId}`,
      method: 'DELETE'
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * Delete file of task
 */
function deleteFileTask(fileId, documentId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/documents/${documentId}/files/${fileId}`,
      method: 'PATCH'
    },
    true,
    true,
    'task.task_perform'
  )
}
/**
 * Delete document of task
 */
function deleteDocument(documentId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/documents/${documentId}`,
      method: 'DELETE'
    },
    true,
    true,
    'task.task_perform'
  )
}
/**
 * Edit document of task
 */
function editDocument(documentId, taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/documents`,
      params: {
        documentId
      },
      data,
      method: 'PATCH'
    },
    true,
    true,
    'task.task_perform'
  )
}

/**
 * Tạo comment cho kpi set
 */
function createComment(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments`,
      method: 'POST',
      data
    },
    false,
    true
  )
}
/**
 * Tạo comment cho kpi set
 */
function createChildComment(taskId, commentId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments`,
      method: 'POST',
      data
    },
    false,
    true
  )
}

/**
 * Edit comment cho kpi set
 */
function editComment(taskId, commentId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}`,
      method: 'PATCH',
      data
    },
    false,
    true
  )
}
/**
 * Delete comment
 */
function deleteComment(taskId, commentId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}`,
      method: 'DELETE'
    },
    false,
    true
  )
}
/**
 * Edit comment of comment
 */
function editChildComment(taskId, commentId, childCommentId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}`,
      method: 'PATCH',
      data
    },
    false,
    true
  )
}
/**
 * Delete comment of comment
 */
function deleteChildComment(taskId, commentId, childCommentId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}`,
      method: 'DELETE'
    },
    false,
    true
  )
}

/**
 * Delete file of comment
 */
function deleteFileComment(fileId, commentId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/files/${fileId}`,
      method: 'PATCH'
    },
    false,
    true
  )
}
/**
 * Delete file child comment
 */
function deleteFileChildComment(fileId, childCommentId, commentId, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}/comments/${commentId}/child-comments/${childCommentId}/files/${fileId}`,
      method: 'PATCH'
    },
    false,
    true
  )
}
/**
 * Lấy tất cả preceeding task
 * @param {*} taskId
 */
function getAllPreceedingTasks(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/process/tasks/${taskId}`,
      method: 'GET',
      params: {
        preceedingTasks: true
      }
    },
    false,
    false
  )
}
/**
 * Sắp xếp actions
 */
function sortActions(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/sort`,
      method: 'POST',
      data
    },
    false,
    false
  )
}

/**
 * evaluate Task By Responsible Employees Project
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByResponsibleEmployeesProject(data, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate-project`,
      method: 'POST',
      data: {
        data,
        role: 'responsible'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * evaluate Task By Accountable Employees PROJECT
 * @param {*} data du lieu cap nhat
 * @param {*} taskId id cua task muon cap nhat
 */
function evaluateTaskByAccountableEmployeesProject(data, taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/evaluate-project`,
      method: 'POST',
      data: {
        data,
        role: 'accountable'
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * Thêm mới hoạt động
 * @param {*} taskId id của task
 * @param {*} newAction nội dung hành động
 */
function createTaskOutputs(taskId, taskOutputId, newAction) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs/${taskOutputId}/submissionResults`,
      method: 'POST',
      data: newAction
    },
    true,
    true,
    'task.task_perform'
  )
}

function getTaskOutputs(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs`,
      method: 'GET'
    },
    false,
    false,
    'task.task_perform'
  )
}

function approveTaskOutputs(taskId, taskOutputId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs/${taskOutputId}/approve`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'task.task_perform'
  )
}

function editSubmissionResults(taskId, taskOutputId, newAction) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs/${taskOutputId}/submissionResults`,
      method: 'PATCH',
      data: newAction
    },
    true,
    true,
    'task.task_perform'
  )
}

function deleteSubmissionResults(taskId, taskOutputId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs/${taskOutputId}/submissionResults`,
      method: 'DELETE'
    },
    true,
    true,
    'task.task_perform'
  )
}

function editTaskOutputs(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'task.task_perform'
  )
}

function deleteFileOfTaskOutput(taskId, taskOutputId, fileId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs/${taskOutputId}/documents/${fileId}`,
      method: 'PATCH'
    },
    true,
    true,
    'task.task_perform'
  )
}

function createCommentOfTaskOutput(taskId, taskOutputId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs/${taskOutputId}/comments`,
      method: 'POST',
      data: newComment
    },
    true,
    true,
    'task.task_perform'
  )
}

function editCommentOfTaskOutput(taskId, taskOutputId, commentId, newComment) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/performtask/tasks/${taskId}/task-outputs/${taskOutputId}/comments/${commentId}`,
      method: 'PATCH',
      data: newComment
    },
    true,
    true,
    'task.task_perform'
  )
}
