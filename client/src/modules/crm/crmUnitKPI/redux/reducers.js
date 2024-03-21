import { CrmUnitKPIConstants } from './constants'

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initState = {
  list: [],
  totalDocs: 0,
  isLoading: true
}
export function crmUnitKPI(state = initState, action) {
  switch (action.type) {
    case CrmUnitKPIConstants.GET_CRM_CRMUNITKPI_REQUEST:
    case CrmUnitKPIConstants.EDIT_CRM_CRMUNITKPI_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case CrmUnitKPIConstants.GET_CRM_CRMUNITKPI_FAILE:
    case CrmUnitKPIConstants.EDIT_CRM_CRMUNITKPI_FAILE:
      return {
        ...state,
        isLoading: false
      }

    case CrmUnitKPIConstants.GET_CRM_CRMUNITKPI_SUCCESS:
      return {
        ...state,
        list: [action.payload.crmUnitKPI],
        totalDocs: action.payload.listDocsTotal,
        isLoading: false
      }
    case CrmUnitKPIConstants.EDIT_CRM_CRMUNITKPI_SUCCESS:
      return {
        ...state,
        list: [action.payload],
        isLoading: false
      }

    default:
      return state
  }
}
