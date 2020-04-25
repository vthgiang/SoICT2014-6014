import { dashboardKpiConstants } from "./constants";

export function dashboardKPIPersonal(state = {}, action) {
  switch (action.type) {
    case  dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSet: action.payload,
        isLoading: false
      };
    case dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  dashboardKpiConstants.GET_EMPLOYEE_KPI_SET_OF_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case dashboardKpiConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSet: action.payload,
        isLoading: false
      };
    case dashboardKpiConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    default:
      return state
  }
}
