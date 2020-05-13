import { dashboardEmployeeKpiConstants } from "./constants";
 
export function dashboardEvaluationEmployeeKpiSet(state = {}, action) {
  switch (action.type) {
    case  dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_REQUEST:
      return {
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_SUCCESS:      
      return {
        ...state,
        loading: false,
        employeeKpiSets: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    default:
      return state
  }
}