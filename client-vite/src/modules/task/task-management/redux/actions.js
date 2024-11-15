import { taskManagementConstants } from './constants'
import { taskManagementService } from './services'

/**
 * lấy công việc theo người thực hiện
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getResponsibleTaskByUser(
  unit,
  number,
  perPage,
  status,
  priority,
  special,
  name,
  startDate,
  endDate,
  startDateAfter,
  endDateBefore,
  aPeriodOfTime = false
) {
  // user, -- param
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_REQUEST
    })

    taskManagementService
      .getResponsibleTaskByUser(
        unit,
        number,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        startDateAfter,
        endDateBefore,
        aPeriodOfTime
      )
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GETTASK_RESPONSIBLE_BYUSER_FAILURE,
          error
        })
      })
  }
}

/**
 * lấy công việc theo người phê duyệt
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getAccountableTaskByUser(
  unit,
  number,
  perPage,
  status,
  priority,
  special,
  name,
  startDate,
  endDate,
  startDateAfter,
  endDateBefore,
  aPeriodOfTime = false
) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_REQUEST
    })
    taskManagementService
      .getAccountableTaskByUser(
        unit,
        number,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        startDateAfter,
        endDateBefore,
        aPeriodOfTime
      )
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GETTASK_ACCOUNTABLE_BYUSER_FAILURE,
          error
        })
      })
  }
}

/**
 * lấy công việc theo người quan sát
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getConsultedTaskByUser(
  unit,
  number,
  perPage,
  status,
  priority,
  special,
  name,
  startDate,
  endDate,
  startDateAfter,
  endDateBefore,
  aPeriodOfTime = false
) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_REQUEST
    })

    taskManagementService
      .getConsultedTaskByUser(
        unit,
        number,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        startDateAfter,
        endDateBefore,
        aPeriodOfTime
      )
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GETTASK_CONSULTED_BYUSER_FAILURE,
          error
        })
      })
  }
}

/**
 * lấy công việc theo người quan sát
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getInformedTaskByUser(
  unit,
  number,
  perPage,
  status,
  priority,
  special,
  name,
  startDate,
  endDate,
  startDateAfter,
  endDateBefore,
  aPeriodOfTime = false
) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GETTASK_INFORMED_BYUSER_REQUEST
    })

    taskManagementService
      .getInformedTaskByUser(
        unit,
        number,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        startDateAfter,
        endDateBefore,
        aPeriodOfTime
      )
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GETTASK_INFORMED_BYUSER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GETTASK_INFORMED_BYUSER_FAILURE,
          error
        })
      })
  }
}

/**
 * lấy công việc theo người tạo
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getCreatorTaskByUser(
  unit,
  number,
  perPage,
  status,
  priority,
  special,
  name,
  startDate,
  endDate,
  startDateAfter,
  endDateBefore,
  aPeriodOfTime = false
) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GETTASK_CREATOR_BYUSER_REQUEST
    })

    taskManagementService
      .getCreatorTaskByUser(
        unit,
        number,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        startDateAfter,
        endDateBefore,
        aPeriodOfTime
      )
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GETTASK_CREATOR_BYUSER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GETTASK_CREATOR_BYUSER_FAILURE,
          error
        })
      })
  }
}

/**
 * lấy công việc có đánh giá của đơn vị
 * @param {*} unit đơn vị
 * @param {*} month tháng
 */

function getAllTasksThatHasEvaluation(unit, startDate, endDate) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GET_TASK_HAS_EVALUATION_REQUEST
    })

    taskManagementService
      .getAllTasksThatHasEvaluation(unit, startDate, endDate)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_TASK_HAS_EVALUATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GET_TASK_HAS_EVALUATION_FAILURE,
          error
        })
      })
  }
}

/**
 * lấy công việc theo người tạo
 * @param {*} unit đơn vị
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getPaginateTasksByUser(
  unit,
  number,
  perPage,
  status,
  priority,
  special,
  name,
  startDate,
  endDate,
  startDateAfter,
  endDateBefore,
  aPeriodOfTime = false,
  calledId = null
) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GET_PAGINATE_TASK_BYUSER_REQUEST,
      calledId
    })

    taskManagementService
      .getPaginateTasksByUser(
        unit,
        number,
        perPage,
        status,
        priority,
        special,
        name,
        startDate,
        endDate,
        startDateAfter,
        endDateBefore,
        aPeriodOfTime
      )
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_PAGINATE_TASK_BYUSER_SUCCESS,
          payload: res.data.content,
          calledId
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GET_PAGINATE_TASK_BYUSER_FAILURE,
          error
        })
      })
  }
}

/**
 * lấy công việc
 * @param {*} unit đơn vị
 * @param {*} role vai trò
 * @param {*} number số trang hiện tại
 * @param {*} perPage số bản ghi trên 1 trang
 * @param {*} status trạng thái
 * @param {*} priority độ ưu tiên
 * @param {*} special lưu kho???
 * @param {*} name tên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate kết thúc công việc
 */

function getPaginateTasks(data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GET_PAGINATE_TASK_REQUEST
    })

    taskManagementService
      .getPaginateTasks(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_PAGINATE_TASK_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GET_PAGINATE_TASK_FAILURE,
          error
        })
      })
  }
}

/**
 * Tìm kiếm công việc đơn vị theo 1 roleId
 * @param {*} roleId
 * @param {*} number
 * @param {*} perPage
 * @param {*} status
 * @param {*} priority
 * @param {*} special
 * @param {*} name
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} startDateAfter
 * @param {*} endDateBefore
 * @param {*} aPeriodOfTime
 * @param {*} calledId
 */
function getPaginatedTasksByOrganizationalUnit(data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_REQUEST
    })

    taskManagementService
      .getPaginatedTasksByOrganizationalUnit(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GET_PAGINATE_TASK_BY_ORGANIZATIONALUNIT_FAILURE,
          error
        })
      })
  }
}

/**
 * thêm mới công việc
 * @param {*} task dữ liệu task mới thêm
 */

function addTask(task) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.ADDNEW_TASK_REQUEST, task })

    taskManagementService
      .addNewTask(task)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.ADDNEW_TASK_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.ADDNEW_TASK_FAILURE,
          error
        })
      })
  }
}

/**
 * edit task
 * @param {*} id
 * @param {*} task
 */

function editTask(id, task) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.EDIT_TASK_REQUEST, id })

    taskManagementService
      .editTaskTemplate(id, task)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.EDIT_TASK_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.EDIT_TASK_FAILURE,
          error
        })
      })
  }
}

/**
 * delete task
 * prefixed function name with underscore because delete is a reserved word in javascript
 */
function deleteTask(id) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.DELETE_TASK_REQUEST, id })

    taskManagementService
      .deleteTaskById(id)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.DELETE_TASK_SUCCESS,
          id
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.DELETE_TASK_FAILURE,
          id,
          error
        })
      })
  }
}

/**
 * get sub task
 * @param {*} taskId id của task
 */
function getSubTask(taskId) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_SUBTASK_REQUEST, taskId })
    taskManagementService
      .getSubTask(taskId)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_SUBTASK_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GET_SUBTASK_FAILURE, error })
      })
  }
}

/**
 * get task by user
 */
function getTasksByUser(data) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_TASK_BY_USER_REQUEST })
    taskManagementService
      .getTasksByUser(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_TASK_BY_USER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GET_TASK_BY_USER_FAILURE, error })
      })
  }
}

function getTaskEvaluations(data) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_TASK_EVALUATION_REQUEST })
    taskManagementService
      .getTaskEvaluations(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_TASK_EVALUATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GET_TASK_EVALUATION_FAILURE, error })
      })
  }
}

function getTaskInOrganizationUnitByMonth(organizationUnitId, startDateAfter, endDateBefore, typeApi = null) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_REQUEST, typeApi })
    taskManagementService
      .getTaskInOrganizationUnitByMonth(organizationUnitId, startDateAfter, endDateBefore)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_SUCCESS,
          typeApi,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_FAILURE, error })
      })
  }
}

function getTaskAnalysOfUser(userId, type) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_TASK_ANALYS_OF_USER_REQUEST })
    return new Promise((resolve, reject) => {
      taskManagementService
        .getTaskAnalysOfUser(userId, type)
        .then((res) => {
          dispatch({
            type: taskManagementConstants.GET_TASK_ANALYS_OF_USER_SUCCESS,
            payload: res.data.content
          })
          resolve(res)
        })
        .catch((error) => {
          dispatch({ type: taskManagementConstants.GET_TASK_ANALYS_OF_USER_FAILE, error })
          reject(error)
        })
    })
  }
}

function getTaskByPriorityInOrganizationUnit(organizationUnitId, date) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_REQUEST })
    taskManagementService
      .getTaskByPriorityInOrganizationUnit(organizationUnitId, date)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GET_TASK_IN_ORGANIZATION_UNIT_PRIORITY_FAILURE })
      })
  }
}

function getTimeSheetOfUser(userId, month, year, requireActions = false) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_TIME_SHEET_OF_USER_REQUEST })
    taskManagementService
      .getTimeSheetOfUser(userId, month, year, requireActions)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_TIME_SHEET_OF_USER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GET_TIME_SHEET_OF_USER_FAILE })
      })
  }
}

function getAllUserTimeSheet(month, year, rowLimit, page, timeLimit, unitArray, sortType) {
  sortType = parseInt(sortType[0])
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.GET_ALL_USER_TIME_SHEET_LOG_REQUEST })
    taskManagementService
      .getAllUserTimeSheet(month, year, rowLimit, page, timeLimit, unitArray, sortType)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_ALL_USER_TIME_SHEET_LOG_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GET_ALL_USER_TIME_SHEET_LOG_FAILE })
      })
  }
}

/**
 * thêm mới công việc cho dự án
 * @param {*} task dữ liệu task mới thêm
 */

function addProjectTask(task) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.ADDNEW_TASK_REQUEST, task })

    taskManagementService
      .addNewProjectTask(task)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.ADDNEW_TASK_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.ADDNEW_TASK_FAILURE,
          error
        })
      })
  }
}

/**
 * get task by query
 */
function getTasksByProject(data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GETTASK_BYPROJECT_PAGINATE_REQUEST
    })
    taskManagementService
      .getTasksByProject(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GETTASK_BYPROJECT_PAGINATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GETTASK_BYPROJECT_PAGINATE_FAILURE, error })
      })
  }
}

/**
 * get task by projectId
 */
function getAllTasksByProject(projectId) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GETTASK_BYPROJECT_REQUEST
    })
    taskManagementService
      .getTasksByProject({ projectId, calledId: 'get_all' })
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GETTASK_BYPROJECT_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.GETTASK_BYPROJECT_FAILURE, error })
      })
  }
}

function importTasks(data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.IMPORT_TASKS_REQUEST
    })

    taskManagementService
      .importTasks(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.IMPORT_TASKS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: taskManagementConstants.IMPORT_TASKS_FAILURE,
          error: err?.response?.data?.content
        })
      })
  }
}
function getOrganizationTaskDashboardChart(data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GET_ORGANIZATION_TASK_DASHBOARD_CHART_REQUEST,
      chartNameArr: Object.keys(data)
    })

    taskManagementService
      .getOrganizationTaskDashboardChart(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_ORGANIZATION_TASK_DASHBOARD_CHART_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.GET_ORGANIZATION_TASK_DASHBOARD_CHART_FAILURE,
          error
        })
      })
  }
}

/**
 * Lưu thông tin thuộc tính công việc
 * @taskId id công việc
 * @data dữ liệu chỉnh sửa
 */
function saveTaskAttributes(taskId, data) {
  return (dispatch) => {
    dispatch({ type: taskManagementConstants.SAVE_TASK_ATTRIBUTES_REQUEST, taskId })
    taskManagementService
      .saveTaskAttributes(taskId, data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.SAVE_TASK_ATTRIBUTES_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({ type: taskManagementConstants.SAVE_TASK_ATTRIBUTES_FAILURE, error })
      })
  }
}

function addTaskDelegation(taskId, data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.ADD_TASK_DELEGATION_REQUEST
    })
    taskManagementService
      .addTaskDelegation(taskId, data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.ADD_TASK_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.ADD_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function editTaskDelegation(taskId, data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.EDIT_TASK_DELEGATION_REQUEST
    })
    taskManagementService
      .editTaskDelegation(taskId, data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.EDIT_TASK_DELEGATION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.EDIT_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function deleteTaskDelegation(taskId, data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.DELETE_TASK_DELEGATION_REQUEST
    })

    taskManagementService
      .deleteTaskDelegation(taskId, data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.DELETE_TASK_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationId: data.delegationId
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.DELETE_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function revokeTaskDelegation(taskId, data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.REVOKE_TASK_DELEGATION_REQUEST
    })

    taskManagementService
      .revokeTaskDelegation(taskId, data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.REVOKE_TASK_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationId: data.delegationId,
          reason: data.reason
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.REVOKE_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function confirmTaskDelegation(taskId, data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.CONFIRM_TASK_DELEGATION_REQUEST
    })

    taskManagementService
      .confirmTaskDelegation(taskId, data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.CONFIRM_TASK_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationId: data.delegationId
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.CONFIRM_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function rejectTaskDelegation(taskId, data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.REJECT_TASK_DELEGATION_REQUEST
    })

    taskManagementService
      .rejectTaskDelegation(taskId, data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.REJECT_TASK_DELEGATION_SUCCESS,
          payload: res.data.content,
          delegationId: data.delegationId,
          reason: data.reason
        })
      })
      .catch((error) => {
        dispatch({
          type: taskManagementConstants.REJECT_TASK_DELEGATION_FAILURE,
          error
        })
      })
  }
}

function proposalPersonnel(data) {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.PROPOSAL_PERSONNEL_REQUEST
    })

    taskManagementService
      .proposalPersonnel(data)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.PROPOSAL_PERSONNEL_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: taskManagementConstants.PROPOSAL_PERSONNEL_FAILURE,
          error: err?.response?.data?.content
        })
      })
  }
}

const getCurrentUserProgressTask = (payload) => {
  return (dispatch) => {
    dispatch({
      type: taskManagementConstants.GET_USER_TASK_PROGRESS_REQUEST
    })
    taskManagementService
      .getCurrentUserProgressTask(payload)
      .then((res) => {
        dispatch({
          type: taskManagementConstants.GET_USER_TASK_PROGRESS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: taskManagementConstants.GET_USER_TASK_PROGRESS_FAILURE,
          error: err?.response?.data?.content
        })
      })
  }
}

export const taskManagementActions = {
  getResponsibleTaskByUser,
  getAccountableTaskByUser,
  getConsultedTaskByUser,
  getInformedTaskByUser,
  getCreatorTaskByUser,
  getPaginateTasksByUser,
  getPaginateTasks,
  getPaginatedTasksByOrganizationalUnit,
  getAllTasksThatHasEvaluation,

  addTask,
  editTask,
  deleteTask,
  getSubTask,

  getTasksByUser,
  getTaskInOrganizationUnitByMonth,
  getTaskEvaluations,

  getTaskAnalysOfUser,
  getTaskByPriorityInOrganizationUnit,
  getTimeSheetOfUser,
  getAllUserTimeSheet,

  addProjectTask,
  getTasksByProject,
  getAllTasksByProject,

  importTasks,

  getOrganizationTaskDashboardChart,

  saveTaskAttributes,
  addTaskDelegation,
  deleteTaskDelegation,
  revokeTaskDelegation,
  confirmTaskDelegation,
  rejectTaskDelegation,
  editTaskDelegation,

  proposalPersonnel,
  getCurrentUserProgressTask
}
