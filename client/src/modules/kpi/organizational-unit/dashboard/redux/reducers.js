import { dashboardOrganizationalUnitKpiConstants } from "./constants";

const initState = {
    childTargets: null,
    tasks: null,
    organizationalUnitKpiSetsEachYear: null,
    employeeKpiSets: null,
    isLoading: false,
    error: null
}

export function dashboardOrganizationalUnitKpi (state = initState, action){
    switch (action.type) {
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_REQUEST:
            return {
                ...state,
                childTargets: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                childTargets: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_FAILURE:
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
                tasks: null,
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
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_REQUEST:
            return {
                ...state,
                organizationalUnitKpiSetsEachYear: null,
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                organizationalUnitKpiSetsEachYear: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_EACH_YEAR_FAILURE:
            return {
                ...state,
                loading: false,
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
        case dashboardOrganizationalUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
          return state
    }
}