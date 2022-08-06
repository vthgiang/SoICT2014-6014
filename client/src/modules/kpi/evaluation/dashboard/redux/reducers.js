import { dashboardEmployeeKpiConstants } from "./constants";

export function dashboardEvaluationEmployeeKpiSet(state = { isLoading: false, reload: false }, action) {
  switch (action.type) {
    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSets: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ROLE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSets: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_OF_UNIT_BY_ID_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_REQUEST:
      return {
        ...state,
        childrenOrganizationalUnitLoading: false,
        childrenOrganizationalUnit: null,
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_SUCCESS:
      return {
        ...state,
        childrenOrganizationalUnitLoading: true,
        loading: false,
        childrenOrganizationalUnit: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_ALL_CHILDREN_OF_UNIT_FAILURE:
      return {
        ...state,
        childrenOrganizationalUnitLoading: true,
        error: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_EMPLOYEE_KPI_PERFORMANCE_REQUEST:
      return {
        ...state,
        employeeKpiPerformanceLoading: false,
        employeeKpiPerformance: null,
        loading: true,
        isLoading: true
      };

    case dashboardEmployeeKpiConstants.GET_EMPLOYEE_KPI_PERFORMANCE_SUCCESS:
      return {
        ...state,
        employeeKpiPerformanceLoading: true,
        loading: false,
        employeeKpiPerformance: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.GET_EMPLOYEE_KPI_PERFORMANCE_FAILURE:
      return {
        ...state,
        employeeKpiPerformanceLoading: true,
        error: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.CREATE_EMPLOYEE_KPI_SET_AUTO_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: true
      };
    case dashboardEmployeeKpiConstants.CREATE_EMPLOYEE_KPI_SET_AUTO_SUCCESS:
      return {
        ...state,
        adding: false,
        employeeKpiSets: action.payload,
        isLoading: false
      };
    case dashboardEmployeeKpiConstants.CREATE_EMPLOYEE_KPI_SET_AUTO_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.BALANCE_EMPLOYEE_KPI_SET_AUTO_REQUEST:
      return {
        ...state,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.BALANCE_EMPLOYEE_KPI_SET_AUTO_SUCCESS:
      const kpiSet = {};
      const employeeKpiSets = state.employeeKpiSets;

      for (let item of action.payload) {
        kpiSet[item._id] = item.kpis;
      }

      for (let item of employeeKpiSets) {
        if (kpiSet[item._id]) {
          item.kpis = kpiSet[item._id]
        }
      }

      return {
        ...state,
        employeeKpiSets: employeeKpiSets,
        reload: !state.reload,
        isLoading: false
      };

    case dashboardEmployeeKpiConstants.BALANCE_EMPLOYEE_KPI_SET_AUTO_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state
  }
}