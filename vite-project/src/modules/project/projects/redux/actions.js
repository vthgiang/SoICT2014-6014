import { ProjectServices } from './services'
import { ProjectConstants } from './constants'

export const ProjectActions = {
  getProjectsDispatch,
  createProjectDispatch,
  editProjectDispatch,
  deleteProjectDispatch,
  getSalaryMembersDispatch
}

function getProjectsDispatch(data = undefined) {
  return (dispatch) => {
    dispatch({
      type: ProjectConstants.GET_PROJECTS_REQUEST,
      calledId: data.calledId ? data.calledId : ''
    })
    ProjectServices.getProjects(data)
      .then((res) => {
        dispatch({
          type: ProjectConstants.GET_PROJECTS_SUCCESS,
          payload: res.data.content,
          calledId: data.calledId
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectConstants.GET_PROJECTS_FAILE })
      })
  }
}

function createProjectDispatch(data) {
  return (dispatch) => {
    dispatch({
      type: ProjectConstants.CREATE_PROJECTS_REQUEST,
      calledId: data.calledId ? data.calledId : ''
    })
    ProjectServices.createProject(data)
      .then((res) => {
        dispatch({
          type: ProjectConstants.CREATE_PROJECTS_SUCCESS,
          payload: res.data.content,
          calledId: data.calledId
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectConstants.CREATE_PROJECTS_FAILE })
      })
  }
}

function editProjectDispatch(id, data) {
  return (dispatch) => {
    dispatch({ type: ProjectConstants.EDIT_PROJECTS_REQUEST })
    ProjectServices.editProject(id, data)
      .then((res) => {
        console.log('res.data.content', res.data.content)
        dispatch({
          type: ProjectConstants.EDIT_PROJECTS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ProjectConstants.EDIT_PROJECTS_FAILE
        })
      })
  }
}

function deleteProjectDispatch(id) {
  return (dispatch) => {
    dispatch({ type: ProjectConstants.DELETE_PROJECTS_REQUEST })
    ProjectServices.deleteProject(id)
      .then((res) => {
        dispatch({
          type: ProjectConstants.DELETE_PROJECTS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectConstants.DELETE_PROJECTS_FAILE })
      })
  }
}

function getSalaryMembersDispatch(data) {
  return (dispatch) => {
    dispatch({ type: ProjectConstants.GET_SALARY_MEMBER })
    ProjectServices.getSalaryMembersAPI(data)
      .then((res) => {
        dispatch({
          type: ProjectConstants.GET_SALARY_MEMBER_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectConstants.GET_SALARY_MEMBER_FAILE })
      })
  }
}
