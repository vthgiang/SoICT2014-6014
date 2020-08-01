import { dashboardOrganizationalUnitKpiConstants } from "./constants";

const initState = {
    employeeKpis: null,
    tasks: null,
    organizationalUnitKpiSets: null,
    employeeKpiSets: null,
    organizationalUnitKpiSetsOfChildUnit: null,
    isLoading: false,
    error: null
}

export function dashboardOrganizationalUnitKpi(state = initState, action) {
    switch (action.type) {
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                employeeKpis: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                employeeKpis: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEEKPI_IN_ORGANIZATIONALUNIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                tasks: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                tasks: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_TASK_OF_ORGANIZATIONALUNIT_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload
            }
        
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_REQUEST:
            return {
                ...state,
                employeeKpiSets: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNIT_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                employeeKpiSets: action.payload
            }
        
        default:
            return state
    }
}