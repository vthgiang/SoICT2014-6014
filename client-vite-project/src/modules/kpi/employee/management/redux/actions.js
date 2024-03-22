import { managerKPIConstants } from './constants'
import { managerKPIPerService } from './services'

export const managerKpiActions = {
  getAllKpiSetsOrganizationalUnitByMonth,
  copyEmployeeKPI,
  getEmployeeKpiSetLogs
}

/**
 *
 * @param {*}
 */
function getAllKpiSetsOrganizationalUnitByMonth(user, department, date) {
  return (dispatch) => {
    dispatch({ type: managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_REQUEST })

    managerKPIPerService
      .getAllKpiSetsOrganizationalUnitByMonth(user, department, date)
      .then((res) => {
        dispatch({
          type: managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_FAILURE,
          payload: error
        })
      })
  }
}

function copyEmployeeKPI(id, idunit, newdate) {
  return (dispatch) => {
    dispatch({ type: managerKPIConstants.COPY_KPIPERSONALS_REQUEST })

    managerKPIPerService
      .copyEmployeeKPI(id, idunit, newdate)
      .then((res) => {
        dispatch({
          type: managerKPIConstants.COPY_KPIPERSONALS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: managerKPIConstants.COPY_KPIPERSONALS_FAILURE,
          payload: error
        })
      })
  }
}

function getEmployeeKpiSetLogs(id) {
  return (dispatch) => {
    dispatch({ type: managerKPIConstants.GET_EMPLOYEE_KPI_SET_REQUEST })

    managerKPIPerService
      .getEmployeeKpiSetLogs(id)
      .then((res) => {
        dispatch({
          type: managerKPIConstants.GET_EMPLOYEE_KPI_SET_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: managerKPIConstants.GET_EMPLOYEE_KPI_SET_FAILURE,
          payload: error
        })
      })
  }
}
