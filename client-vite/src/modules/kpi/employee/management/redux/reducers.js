import { managerKPIConstants } from './constants'

export function KPIPersonalManager(state = {}, action) {
  switch (action.type) {
    case managerKPIConstants.GETALL_KPIPERSONAL_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        loading: false,
        kpipersonals: action.payload,
        isLoading: false
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_FAILURE:
      return {
        error: action.error,
        isLoading: false
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS:
      return {
        ...state,
        loading: false,
        kpipersonals: action.payload,
        isLoading: false
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE:
      return {
        error: action.error,
        isLoading: false
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_SUCCESS:
      return {
        ...state,
        loading: false,
        kpiSets: action.payload,
        isLoading: false
      }
    case managerKPIConstants.GETALL_KPIPERSONAL_IN_ORGANIZATION_BY_MONTH_FAILURE:
      return {
        error: action.error,
        isLoading: false
      }
    case managerKPIConstants.GET_EMPLOYEE_KPI_SET_REQUEST:
      return {
        ...state,
        loading: true
      }
    case managerKPIConstants.GET_EMPLOYEE_KPI_SET_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSetLogs: action.payload
      }
    case managerKPIConstants.GET_EMPLOYEE_KPI_SET_FAILURE:
      return {
        error: action.error
      }
    default:
      return state
  }
}
