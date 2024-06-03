import { getStorage } from '../../../../config'
import { sendRequest } from '../../../../helpers/requestHelper'

/** get all task template */
function getAll() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates`,
      method: 'GET'
    },
    false,
    true,
    'task.task_template'
  )
}

/** get a task template by id */
function getById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates/${id}`,
      method: 'GET'
    },
    false,
    true,
    'task.task_template'
  )
}

/** get all task template by Role */
function getAllTaskTemplateByRole(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates`,
      params: {
        roleId: id
      },
      method: 'GET'
    },
    false,
    true,
    'task.task_template'
  )
}

/** get all task template by User
 *   Để lấy tất cả kết quả: cho pageNumber=1, noResultsPerPage = 0
 */
function getAllTaskTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name) {
  const id = getStorage('userId')

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates`,
      method: 'GET',
      params: {
        userId: id,
        pageNumber,
        noResultsPerPage,
        arrayUnit,
        name
      }
    },
    false,
    true,
    'task.task_template'
  )
}

/** add new task template */
function addNewTaskTemplate(newTaskTemplate) {
  const id = getStorage('userId')
  const payload = { ...newTaskTemplate, creator: id }

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates`,
      method: 'POST',
      data: payload
    },
    true,
    true,
    'task.task_template'
  )
}

function editTaskTemplate(id, newTaskTemplate) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates/${id}`,
      method: 'PATCH',
      data: newTaskTemplate
    },
    true,
    true,
    'task.task_template'
  )
}

/** delete a task template */
function deleteTaskTemplateById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'task.task_template'
  )
}

/** import a task Task Template  */
function importTaskTemplate(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/task/task-templates/import`,
      method: 'POST',
      data
    },
    true,
    true,
    'task.task_template'
  )
}

export const taskTemplateService = {
  getAll,
  getById,
  getAllTaskTemplateByRole,
  getAllTaskTemplateByUser,
  addNewTaskTemplate,
  editTaskTemplate,
  deleteTaskTemplateById,
  importTaskTemplate,
}
