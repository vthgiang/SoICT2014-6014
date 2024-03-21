import { kpiTemplateConstants } from './constants'
//import { alertActions } from "./AlertActions";
import { kpiTemplateService } from './services'
export const kpiTemplateActions = {
  getKpiTemplates,
  getAllKpiTemplateByRole,
  getAllKpiTemplateByUser,
  getKpiTemplateById,
  addKpiTemplate,
  editKpiTemplate,
  deleteKpiTemplateById,
  importKpiTemplate
}

/** Get all kpitemplate */
function getKpiTemplates(unit, keyword, number, limit) {
  return (dispatch) => {
    dispatch({ type: kpiTemplateConstants.GET_TEMPLATE_KPI_REQUEST })

    kpiTemplateService
      .getKpiTemplates(unit, keyword, number, limit)
      .then((res) => {
        console.log(22, res.data.content)
        dispatch({
          type: kpiTemplateConstants.GET_TEMPLATE_KPI_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) =>
        dispatch({
          type: kpiTemplateConstants.GET_TEMPLATE_KPI_FAILURE
        })
      )
  }
}

/** Get all kpi template by role */
function getAllKpiTemplateByRole(id) {
  return (dispatch) => {
    dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYROLE_REQUEST, id })

    kpiTemplateService.getAllKpiTemplateByRole(id).then(
      (res) => dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYROLE_SUCCESS, payload: res.data }),
      (error) => dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYROLE_FAILURE })
    )
  }
}

/** Get all kpi template by user */
function getAllKpiTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name = '') {
  return (dispatch) => {
    dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYUSER_REQUEST })

    kpiTemplateService
      .getAllKpiTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name)
      .then((res) =>
        dispatch({
          type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYUSER_SUCCESS,
          payload: res.data.content
        })
      )
      .catch((error) => dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYUSER_FAILURE }))
  }
}

/** Get kpi template by id */
function getKpiTemplateById(id) {
  return (dispatch) => {
    dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYID_REQUEST })

    kpiTemplateService.getById(id).then(
      (res) => dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYID_SUCCESS, payload: res.data }),
      (error) => dispatch({ type: kpiTemplateConstants.GET_KPI_TEMPLATE_BYID_FAILURE })
    )
  }
}

/** Add a new target of unit */
function addKpiTemplate(kpiTemplate) {
  return (dispatch) => {
    dispatch({ type: kpiTemplateConstants.ADD_KPI_TEMPLATE_REQUEST })

    kpiTemplateService.addNewKpiTemplate(kpiTemplate).then(
      (res) => dispatch({ type: kpiTemplateConstants.ADD_KPI_TEMPLATE_SUCCESS, payload: res.data }),
      (error) => dispatch({ type: kpiTemplateConstants.ADD_KPI_TEMPLATE_FAILURE })
    )
  }
}

/** Edit a kpi template */
function editKpiTemplate(id, kpiTemplate) {
  return (dispatch) => {
    dispatch({ type: kpiTemplateConstants.EDIT_KPI_TEMPLATE_REQUEST })

    kpiTemplateService.editKpiTemplate(id, kpiTemplate).then(
      (res) => dispatch({ type: kpiTemplateConstants.EDIT_KPI_TEMPLATE_SUCCESS, payload: res.data }),
      (error) => dispatch({ type: kpiTemplateConstants.EDIT_KPI_TEMPLATE_FAILURE })
    )
  }
}

/** prefixed function name with underscore because delete is a reserved word in javascript */
function deleteKpiTemplateById(id) {
  return (dispatch) => {
    dispatch({ type: kpiTemplateConstants.DELETE_KPI_TEMPLATE_REQUEST })

    kpiTemplateService.deleteKpiTemplateById(id).then(
      (res) => {
        console.log(105, res.data)
        dispatch({ type: kpiTemplateConstants.DELETE_KPI_TEMPLATE_SUCCESS, payload: res.data })
      },
      (error) => dispatch({ type: kpiTemplateConstants.DELETE_KPI_TEMPLATE_FAILURE })
    )
  }
}

/** Import mẫu công việc */
function importKpiTemplate(data) {
  return (dispatch) => {
    dispatch({
      type: kpiTemplateConstants.IMPORT_KPI_TEMPLATE_REQUEST
    })
    kpiTemplateService.importKpiTemplate(data).then(
      (res) => dispatch({ type: kpiTemplateConstants.IMPORT_KPI_TEMPLATE_SUCCESS, payload: res.data }),
      (error) => dispatch({ type: kpiTemplateConstants.IMPORT_KPI_TEMPLATE_FAILURE })
    )
  }
}
