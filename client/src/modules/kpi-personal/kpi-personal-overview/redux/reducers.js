import { overviewKpiConstants } from "./constants";

export function overviewKpiPersonal(state = {}, action) {
  switch (action.type) {
    case  overviewKpiConstants.GETALL_KPIPERSONAL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case overviewKpiConstants.GETALL_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        loading: false,
        kpipersonals: action.kpipersonals.content
      };
    case overviewKpiConstants.GETALL_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };
    
    default:
      return state
  }
}
