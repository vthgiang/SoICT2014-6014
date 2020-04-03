import { overviewConstants } from "./constants";

export function overviewKpiUnit (state = {}, action){
    switch (action.type) {
        case overviewConstants.GETALL_KPIUNIT_REQUEST:
          return {
            loading: true,
            isLoading: true
          };
        case overviewConstants.GETALL_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            kpis: action.kpis.content,
            isLoading: false
          };
        case overviewConstants.GETALL_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        case overviewConstants.GETCURRENT_KPIUNIT_REQUEST:
          return {
            ...state,
            loading: true,
            isLoading: true
          };
        case overviewConstants.GETCURRENT_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            currentKPI: action.currentKPI.content,
            isLoading: false
          };
        case overviewConstants.GETCURRENT_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        case overviewConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST:
          return {
            ...state,
            loading: true,
            isLoading: true
          };
        case overviewConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS:
          return {
            ...state,
            loading: false,
            childtarget: action.childtarget.content,
            isLoading: false
          };
        case overviewConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        
        case overviewConstants.ADD_KPIUNIT_REQUEST:
          return {
            ...state,
            adding: true,
            isLoading: false
          };
        case overviewConstants.ADD_KPIUNIT_SUCCESS:
          return {
            ...state,
            adding: false,
            currentKPI: action.newKPI.kpiunit,
            isLoading: false
          };
        case overviewConstants.ADD_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        
        case overviewConstants.EVALUATE_KPIUNIT_REQUEST:
          return {
            ...state,
            kpis: state.kpis.map(kpiunit =>
              kpiunit._id === action.id
                ? {...kpiunit, evaluating: true} : kpiunit),
            isLoading: false
          };
        case overviewConstants.EVALUATE_KPIUNIT_SUCCESS:
          return {
            ...state,
            kpis: state.kpis.map(kpiunit =>
              kpiunit._id === action.newKPI.kpiunit._id
                ? action.newKPI.kpiunit : kpiunit),
            isLoading: false
          };
        case overviewConstants.EVALUATE_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        default:
          return state
    }
}