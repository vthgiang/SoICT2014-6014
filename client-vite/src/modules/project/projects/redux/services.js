import { sendRequest } from '../../../../helpers/requestHelper'

function getProjects(params = undefined) {
  // console.log('params project', params)
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/projects/project`,
      method: 'GET',
      params
    },
    false,
    true,
    'project'
  )
}

function createProject(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/projects/project`,
      method: 'POST',
      data
    },
    true,
    true,
    'project'
  )
}

function editProject(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/projects/project/${id}`,
      method: 'PATCH',
      data
      // params: { option },
    },
    true,
    true,
    'project'
  )
}

function deleteProject(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/projects/project/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'project'
  )
}

/**
 * lấy lương của danh sách thành viên hiện tại
 * @param {*} data list thành viên
 */
function getSalaryMembersAPI(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/projects/project/salary-members`,
      method: 'POST',
      data
    },
    false,
    true,
    'project'
  )
}

export const ProjectServices = {
  getProjects,
  createProject,
  editProject,
  deleteProject,
  getSalaryMembersAPI
}
