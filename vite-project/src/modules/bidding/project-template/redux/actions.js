import { ProjectTemplateServices } from './services'
import { ProjectTemplateConstants } from './constants'

export const ProjectTemplateActions = {
  getProjectTemplateDispatch,
  createProjectTemplateDispatch,
  editProjectTemplateDispatch,
  deleteProjectTemplateDispatch,

  createProjectByTemplateDispatch,
  getSalaryMembersOfProjectTemplateDispatch
}

function getProjectTemplateDispatch(data = undefined) {
  return (dispatch) => {
    dispatch({
      type: ProjectTemplateConstants.GET_PROJECTS_TEMPLATE_REQUEST,
      calledId: data.calledId ? data.calledId : ''
    })
    ProjectTemplateServices.getProjectTemplateAPI(data)
      .then((res) => {
        dispatch({
          type: ProjectTemplateConstants.GET_PROJECTS_TEMPLATE_SUCCESS,
          payload: res.data.content,
          calledId: data.calledId
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectTemplateConstants.GET_PROJECTS_TEMPLATE_FAILE })
      })
  }
}

function createProjectTemplateDispatch(data) {
  return (dispatch) => {
    dispatch({
      type: ProjectTemplateConstants.CREATE_PROJECTS_TEMPLATE_REQUEST,
      calledId: data.calledId ? data.calledId : ''
    })
    ProjectTemplateServices.createProjectTemplateAPI(data)
      .then((res) => {
        dispatch({
          type: ProjectTemplateConstants.CREATE_PROJECTS_TEMPLATE_SUCCESS,
          payload: res.data.content,
          calledId: data.calledId
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectTemplateConstants.CREATE_PROJECTS_TEMPLATE_FAILE })
      })
  }
}

function editProjectTemplateDispatch(id, data) {
  return (dispatch) => {
    dispatch({ type: ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_REQUEST })
    ProjectTemplateServices.editProjectTemplateAPI(id, data)
      .then((res) => {
        console.log('res.data.content', res.data.content)
        dispatch({
          type: ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ProjectTemplateConstants.EDIT_PROJECTS_TEMPLATE_FAILE
        })
      })
  }
}

function createProjectByTemplateDispatch(id, data) {
  return (dispatch) => {
    dispatch({ type: ProjectTemplateConstants.CREATE_PROJECT_BY_TEMPLATE_REQUEST })
    ProjectTemplateServices.createProjectByTemplateDispatch(id, data)
      .then((res) => {
        console.log('res.data.content', res.data.content)
        dispatch({
          type: ProjectTemplateConstants.CREATE_PROJECT_BY_TEMPLATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: ProjectTemplateConstants.CREATE_PROJECT_BY_TEMPLATE_FAILE
        })
      })
  }
}

function deleteProjectTemplateDispatch(id) {
  return (dispatch) => {
    dispatch({ type: ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_REQUEST })
    ProjectTemplateServices.deleteProjectTemplateAPI(id)
      .then((res) => {
        dispatch({
          type: ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectTemplateConstants.DELETE_PROJECTS_TEMPLATE_FAILE })
      })
  }
}

function getSalaryMembersOfProjectTemplateDispatch(data) {
  return (dispatch) => {
    dispatch({ type: ProjectTemplateConstants.GET_SALARY_MEMBER_PROJECTS_TEMPLATE })
    ProjectTemplateServices.getSalaryMembersOfProjectTemplateAPI(data)
      .then((res) => {
        dispatch({
          type: ProjectTemplateConstants.GET_SALARY_MEMBER_PROJECTS_TEMPLATE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: ProjectTemplateConstants.GET_SALARY_MEMBER_PROJECTS_TEMPLATE_FAILE })
      })
  }
}
