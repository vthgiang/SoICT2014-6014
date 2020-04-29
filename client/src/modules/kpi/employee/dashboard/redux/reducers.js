import { dashboardEmployeeKpiSetConstants } from "./constants";

export function dashboardEmployeeKpiSet(state = {}, action) {
  switch (action.type) {
    case  dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSet: action.payload,
        isLoading: false
      };
    case dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_BY_MEMBER_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_OF_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_OF_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSet: action.payload,
        isLoading: false
      };
    case dashboardEmployeeKpiSetConstants.GET_EMPLOYEE_KPI_SET_OF_TASK_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    default:
      return state
  }
}
