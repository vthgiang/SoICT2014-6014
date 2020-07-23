import { managerConstants } from "./constants";

export function managerKpiUnit(state = {}, action) {
  switch (action.type) {
    case managerConstants.GETALL_KPIUNIT_REQUEST:
      return {
        loading: true,
        isLoading: true
      };
    case managerConstants.GETALL_KPIUNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        kpis: action.payload,
        isLoading: false
      };
    case managerConstants.GETALL_KPIUNIT_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS:
      return {
        ...state,
        loading: false,
        childtarget: action.payload,
        isLoading: false
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_SUCCESS:
      return {
        ...state,
        adding: false,
        kpis: action.payload,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    default:
      return state
  }
}