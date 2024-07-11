import { manufacturingMetricConstants } from './constants'
import { manufacturingMetricServices } from './services'

export const manufacturingMetricActions = {
  getAllManufacturingKpis,
  createManufacturingKpi,
  editManufacturingKpis,
  getManufacturingKpiById,
  editManufacturingKpi,


  getAllReportElements
}

function getAllManufacturingKpis(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingMetricConstants.GET_MANUFACTURING_KPI_BY_ID_FAILURE
    })
    manufacturingMetricServices
      .getAllManufacturingKpis(query)
      .then((res) => {
        dispatch({
          type: manufacturingMetricConstants.GET_ALL_MANUFACTURING_KPIS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingMetricConstants.GET_ALL_MANUFACTURING_KPIS_FAILURE,
          error
        })
      })
  }
}

function createManufacturingKpi(data) {
  return (dispatch) => {
    dispatch({
      type: manufacturingMetricConstants.CREATE_MANUFACTURING_KPI_REQUEST
    })
    manufacturingMetricServices
      .createManufacturingKpi(data)
      .then((res) => {
        dispatch({
          type: manufacturingMetricConstants.CREATE_MANUFACTURING_KPI_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingMetricConstants.CREATE_MANUFACTURING_KPI_FAILURE,
          error
        })
      })
  }
}

function editManufacturingKpis(data) {
  return (dispatch) => {
    dispatch({
      type: manufacturingMetricConstants.EDIT_MANUFACTURING_KPIS_REQUEST
    })
    manufacturingMetricServices
      .editManufacturingKpis(data)
      .then((res) => {
        dispatch({
          type: manufacturingMetricConstants.EDIT_MANUFACTURING_KPIS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingMetricConstants.EDIT_MANUFACTURING_KPIS_FAILURE,
          error
        })
      })
  }
}

function getManufacturingKpiById(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingMetricConstants.GET_MANUFACTURING_KPI_BY_ID_REQUEST
    })
    manufacturingMetricServices
      .getManufacturingKpiById(query)
      .then((res) => {
        dispatch({
          type: manufacturingMetricConstants.GET_MANUFACTURING_KPI_BY_ID_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingMetricConstants.GET_MANUFACTURING_KPI_BY_ID_FAILURE,
          error
        })
      })
  }
}

function editManufacturingKpi(id, data) {
  return (dispatch) => {
    dispatch({
      type: manufacturingMetricConstants.CREATE_MANUFACTURING_KPI_REQUEST
    })
    manufacturingMetricServices
      .editManufacturingKpi(id, data)
      .then((res) => {
        dispatch({
          type: manufacturingMetricConstants.EDIT_MANUFACTURING_KPI_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingMetricConstants.EDIT_MANUFACTURING_KPI_FAILURE,
          error
        })
      })
  }
}

function getAllReportElements(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingMetricConstants.GET_ALL_REPORT_ELEMENTS_REQUEST
    })
    manufacturingMetricServices
      .getAllReportElements(query)
      .then((res) => {
        dispatch({
          type: manufacturingMetricConstants.GET_ALL_REPORT_ELEMENTS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingMetricConstants.GET_ALL_REPORT_ELEMENTS_FAILURE,
          error
        })
      })
  }
}
