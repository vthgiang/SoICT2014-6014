import { managerConstants } from "./constants";

export function managerKpiUnit (state = {}, action){
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
            kpis: action.kpis.content,
            isLoading: false
          };
        case managerConstants.GETALL_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        case managerConstants.GETCURRENT_KPIUNIT_REQUEST:
          return {
            ...state,
            loading: true,
            isLoading: true
          };
        case managerConstants.GETCURRENT_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            currentKPI: action.payload,
            isLoading: false
          };
        case managerConstants.GETCURRENT_KPIUNIT_FAILURE:
          return {
            error: action.error,
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
            childtarget: action.childtarget.content,
            isLoading: false
          };
        case managerConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        
        case managerConstants.ADD_KPIUNIT_REQUEST:
          return {
            ...state,
            adding: true,
            isLoading: false
          };
        case managerConstants.ADD_KPIUNIT_SUCCESS:
          return {
            ...state,
            adding: false,
            currentKPI: action.payload,
            isLoading: false
          };
        case managerConstants.ADD_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        
        case managerConstants.EVALUATE_KPIUNIT_REQUEST:
          return {
            ...state,
            kpis: state.kpis.map(kpiunit =>
              kpiunit._id === action.id
                ? {...kpiunit, evaluating: true} : kpiunit),
            isLoading: false
          };
        case managerConstants.EVALUATE_KPIUNIT_SUCCESS:
          return {
            ...state,
            kpis: state.kpis.map(kpiunit =>
              kpiunit._id === action.newKPI.kpiunit._id
                ? action.newKPI.kpiunit : kpiunit),
            isLoading: false
          };
        case managerConstants.EVALUATE_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        default:
          return state
    }
}