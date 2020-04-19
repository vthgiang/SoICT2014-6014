import { dashboardKpiConstants } from "./constants";

export function dashboardKPIPersonal(state = {}, action) {
  switch (action.type) {
    case  dashboardKpiConstants.GETALL_KPIPERSONAL_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case dashboardKpiConstants.GETALL_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        loading: false,
        kpipersonals: action.kpipersonals.content,
        isLoading: false
      };
    case dashboardKpiConstants.GETALL_KPIPERSONAL_FAILURE:
      return { 
        error: action.error,
        isLoading: false
      };
    case  dashboardKpiConstants.GETALL_KPIPERSONAL_OFTASK_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case dashboardKpiConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS:
      return {
        ...state,
        loading: false,
        kpipersonals: action.kpipersonals.content,
        isLoading: false
      };
    case dashboardKpiConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE:
      return { 
        error: action.error,
        isLoading: false
      };
    default:
      return state
  }
}
