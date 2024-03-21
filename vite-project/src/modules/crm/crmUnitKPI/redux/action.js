import { CrmUnitKPIServices } from './services'
import { CrmUnitKPIConstants } from './constants'

export const CrmUnitKPIActions = {
  getCrmUnitKPI,
  editCrmUnitKPI
}

function getCrmUnitKPI(data) {
  return (dispatch) => {
    dispatch({ type: CrmUnitKPIConstants.GET_CRM_CRMUNITKPI_REQUEST })
    CrmUnitKPIServices.getCrmUnitKPI(data)
      .then((res) => {
        dispatch({
          type: CrmUnitKPIConstants.GET_CRM_CRMUNITKPI_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmUnitKPIConstants.GET_CRM_CRMUNITKPI_FAILE })
      })
  }
}

function editCrmUnitKPI(id, data) {
  return (dispatch) => {
    dispatch({ type: CrmUnitKPIConstants.EDIT_CRM_CRMUNITKPI_REQUEST })
    CrmUnitKPIServices.editCrmUnitKPI(id, data)
      .then((res) => {
        dispatch({
          type: CrmUnitKPIConstants.EDIT_CRM_CRMUNITKPI_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({ type: CrmUnitKPIConstants.EDIT_CRM_CRMUNITKPI_FAILE })
      })
  }
}
