import { dashboardOrganizationalUnitKpiConstants } from "./constants";

export function dashboardOrganizationalUnitKpi (state = {}, action){
    switch (action.type) {
        case dashboardOrganizationalUnitKpiConstants.GET_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_REQUEST:
            return {
                loading: true,
                isLoading: false
            }
        case dashboardOrganizationalUnitKpiConstants.GET_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoading: false,
                childTargets: action.payload
            }
        case dashboardOrganizationalUnitKpiConstants.GET_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_FAILURE:
            return {
                ...state,
                loading: false,
                isLoading: false,
                error: action.payload
            }
        default:
          return state
    }
}