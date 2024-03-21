import { getStorage } from '../../../../config'
import { sendRequest } from '../../../../helpers/requestHelper'

export const taskManagementService = {
  getResponsibleTaskByUser,
  getAccountableTaskByUser,
  getConsultedTaskByUser,
  getInformedTaskByUser,
  getCreatorTaskByUser,
  getPaginateTasksByUser,
  getPaginateTasks,
  getPaginatedTasksByOrganizationalUnit,
  getAllTasksThatHasEvaluation,

  addNewTask,
  editTask,
  deleteTaskById,
  getSubTask,

  getTasksByUser,
  getTaskEvaluations,
  getTaskInOrganizationUnitByMonth,

  getTaskAnalysOfUser,
  getTaskByPriorityInOrganizationUnit,
  getTimeSheetOfUser,
  getAllUserTimeSheet,

  addNewProjectTask,
  getTasksByProject,
  importTasks,

  getOrganizationTaskDashboardChart,

  saveTaskAttributes,
  addTaskDelegation,
  revokeTaskDelegation,
  deleteTaskDelegation,
  confirmTaskDelegation,
  rejectTaskDelegation,
  editTaskDelegation,

  proposalPersonnel
}

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
  aPeriodOfTime,
  user
) {
  var user = user || getStorage('userId')

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'responsible',
        unit: unit,
        user: user,
        number: number,
        perPage: perPage,
        status: status,
        priority: priority,
        special: special,
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateAfter: startDateAfter,
        endDateBefore: endDateBefore,
        aPeriodOfTime: aPeriodOfTime
      }
    },
    false,
    true,
    'task.task_management'
  )
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
  aPeriodOfTime,
  user
) {
  var user = user || getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'accountable',
        unit: unit,
        user: user,
        number: number,
        perPage: perPage,
        status: status,
        priority: priority,
        special: special,
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateAfter: startDateAfter,
        endDateBefore: endDateBefore,
        aPeriodOfTime: aPeriodOfTime
      }
    },
    false,
    true,
    'task.task_management'
  )
}

/**
 * lấy công việc theo người tư vấn
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
  aPeriodOfTime,
  user
) {
  var user = user || getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'consulted',
        unit: unit,
        user: user,
        number: number,
        perPage: perPage,
        status: status,
        priority: priority,
        special: special,
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateAfter: startDateAfter,
        endDateBefore: endDateBefore,
        aPeriodOfTime: aPeriodOfTime
      }
    },
    false,
    true,
    'task.task_management'
  )
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
  aPeriodOfTime,
  user
) {
  var user = user || getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'informed',
        unit: unit,
        user: user,
        number: number,
        perPage: perPage,
        status: status,
        priority: priority,
        special: special,
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateAfter: startDateAfter,
        endDateBefore: endDateBefore,
        aPeriodOfTime: aPeriodOfTime
      }
    },
    false,
    true,
    'task.task_management'
  )
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
  aPeriodOfTime,
  user
) {
  var user = user || getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'creator',
        unit: unit,
        user: user,
        number: number,
        perPage: perPage,
        status: status,
        priority: priority,
        special: special,
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateAfter: startDateAfter,
        endDateBefore: endDateBefore,
        aPeriodOfTime: aPeriodOfTime
      }
    },
    false,
    true,
    'task.task_management'
  )
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
  aPeriodOfTime
) {
  var user = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'all_role',
        unit: unit,
        user: user,
        number: number,
        perPage: perPage,
        status: status,
        priority: priority,
        special: special,
        name: name,
        startDate: startDate,
        endDate: endDate,
        startDateAfter: startDateAfter,
        endDateBefore: endDateBefore,
        aPeriodOfTime: aPeriodOfTime
      }
    },
    false,
    true,
    'task.task_management'
  )
}

/**
 * lấy công việc có đánh giá của đơn vị
 * @param {*} unit đơn vị
 * @param {*} month tháng
 */

function getAllTasksThatHasEvaluation(unit, startDate, endDate) {
  var user = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'task_has_evaluation',
        unit: unit,
        user: user,
        startDate,
        endDate
      }
    },
    false,
    true,
    'task.task_management'
  )
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
 */
function getPaginatedTasksByOrganizationalUnit(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'paginated_task_by_unit',
        unit: data?.unit,
        page: data?.page,
        perPage: data?.perPage,
        status: data?.status,
        priority: data?.priority,
        special: data?.special,
        name: data?.name,
        startDate: data?.startDate,
        endDate: data?.endDate,
        isAssigned: data?.isAssigned,
        responsibleEmployees: data?.responsibleEmployees,
        accountableEmployees: data?.accountableEmployees,
        creatorEmployees: data?.creatorEmployees,
        organizationalUnitRole: data?.organizationalUnitRole,
        tags: data?.tags
      }
    },
    false,
    true,
    'task.task_management'
  )
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
  var user = getStorage('userId')

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'choose_multi_role',
        unit: data?.unit,
        user: user,
        role: data?.role,
        number: data?.number,
        perPage: data?.perPage,
        status: data?.status,
        priority: data?.priority,
        special: data?.special,
        name: data?.name,
        startDate: data?.startDate,
        endDate: data?.endDate,
        responsibleEmployees: data?.responsibleEmployees,
        accountableEmployees: data?.accountableEmployees,
        creatorEmployees: data?.creatorEmployees,
        creatorTime: data?.creatorTime,
        projectSearch: data?.projectSearch,
        startDateAfter: data?.startDateAfter,
        endDateBefore: data?.endDateBefore,
        aPeriodOfTime: data?.aPeriodOfTime,
        tags: data?.tags,
        getAll: data?.getAll
      }
    },
    false,
    true,
    'task.task_management'
  )
}

/**
 * thêm công việc mới
 * @param {*} newTask công việc mới
 */

function addNewTask(newTask) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'POST',
      data: newTask
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * chỉnh sửa công việc
 * @param {*} id id công việc
 * @param {*} newTask công việc mới sau khi sửa
 */

function editTask(taskId, newTask) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}`,
      method: 'PUT',
      data: newTask
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * xóa công việc theo id
 * @param {*} taskId id công việc
 */

function deleteTaskById(taskId) {
  let id = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}`,
      method: 'DELETE',
      params: {
        userId: id
      }
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * lấy công việc liên quan
 * @param {*} taskId id công việc liên quan
 */
function getSubTask(taskId) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/sub-tasks`,
      method: 'GET'
    },
    false,
    true,
    'task.task_management'
  )
}

/**
 * lấy công việc theo người dùng
 */
function getTasksByUser(data) {
  var id = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        userId: id,
        type: 'all_by_user',
        organizationUnitId: data.organizationUnitId,
        data: data.type
      }
    },
    false,
    true,
    'task.task_management'
  )
}

function getTaskEvaluations(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-evaluations`,
      method: 'GET',
      params: data
    },
    false,
    true,
    'task.task_management'
  )
}

function getTaskInOrganizationUnitByMonth(organizationUnitId, startDateAfter, endDateBefore) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'task_in_unit',
        organizationUnitId: organizationUnitId,
        startDateAfter: startDateAfter,
        endDateBefore: endDateBefore
      }
    },
    false,
    true,
    'task.task_management'
  )
}

function getTaskAnalysOfUser(userId, type) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/analyse/user/${userId}`,
      method: 'GET',
      params: { type }
    },
    false,
    true,
    'task.task_management'
  )
}

function getTaskByPriorityInOrganizationUnit(organizationUnitId, date) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: {
        type: 'priority',
        organizationUnitId: organizationUnitId,
        date: date
      }
    },
    false,
    true,
    'task.task_management'
  )
}

function getTimeSheetOfUser(userId, month, year, requireActions) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/time-sheet`,
      method: 'GET',
      params: { userId, month, year, requireActions }
    },
    false,
    true,
    'task.task_management'
  )
}

function getAllUserTimeSheet(month, year, rowLimit, page, timeLimit, unitArray, sortType) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/time-sheet`,
      method: 'GET',
      params: { month, year, rowLimit, page, timeLimit, unitArray, sortType }
    },
    false,
    true,
    'task.task_management'
  )
}

/**
 * thêm công việc mới cho dự án
 * @param {*} newTask công việc mới
 */

function addNewProjectTask(newTask) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/project-tasks`,
      method: 'POST',
      data: newTask
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * lấy dữ liệu các công việc
 * @param {*} data dữ liệu về công việc cần tìm
 * @param {*} status trạng thái thực hiện
 * @param {*} name tên công việc
 * @param {*} priority độ ưu tiên công việc
 * @param {*} startDate ngày bắt đầu
 * @param {*} endDate ngày kết thúc
 * @param {*} responsibleEmployees nhân viên thực hiện
 * @param {*} accountableEmployees nhận viên phê duyệt
 * @param {*} creatorEmployees người tạo công việc
 * @param {*} preceedingTasks công việc tiền nhiệm
 * @param {*} preceedingMilestones cột mốc tiền nhiệm
 * @param {*} projectId id của dự án
 * @param {*} page số trang
 * @param {*} perPage số bản ghi trên trang
 * @param {*} callId có lấy tất cả các công việc thuộc dự án hay không
 */

function getTasksByProject(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks`,
      method: 'GET',
      params: { ...data, type: 'project' }
    },
    false,
    true,
    'project'
  )
}

function importTasks(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/import`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'task.task_management'
  )
}

function getOrganizationTaskDashboardChart(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/organization-task-dashboard-chart-data`,
      method: 'GET',
      params: data
    },
    false,
    true,
    'task.task_management'
  )
}

/**
 * Lưu thuộc tính công việc
 * @param {*} taskId id công việc
 * @param {*} attribute thuộc tính
 *
 **/
function saveTaskAttributes(taskId, attribute) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/attributes`,
      method: 'PATCH',
      data: attribute
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * Lưu ủy quyền công việc
 * @param {*} taskId id công việc
 * @param {*} data thông tin ủy quyền
 *
 **/
function addTaskDelegation(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/delegation`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * Chỉnh sửa ủy quyền công việc
 * @param {*} taskId id công việc
 * @param {*} data thông tin ủy quyền
 *
 **/
function editTaskDelegation(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/delegation/edit`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * Xóa ủy quyền công việc
 * @param {*} taskId id công việc
 * @param {*} data thông tin ủy quyền
 *
 **/
function deleteTaskDelegation(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/delegation/delete`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'task.task_management'
  )
}

/**
 * Thu hồi ủy quyền công việc
 * @param {*} taskId id công việc
 * @param {*} data thông tin ủy quyền
 *
 **/
function revokeTaskDelegation(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/delegation/revoke`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'task.task_management'
  )
}

function rejectTaskDelegation(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/delegation/reject`,
      method: 'PATCH',
      data: {
        delegationId: data?.delegationId,
        reason: data?.reason
      }
    },
    true,
    true,
    'task.task_management'
  )
}

function confirmTaskDelegation(taskId, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/${taskId}/delegation/confirm`,
      method: 'PATCH',
      data: {
        delegationId: data?.delegationId
      }
    },
    true,
    true,
    'task.task_management'
  )
}

function proposalPersonnel(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/tasks/proposal-personnel`,
      method: 'POST',
      data: data
    },
    false,
    false,
    'task.task_management'
  )
}
