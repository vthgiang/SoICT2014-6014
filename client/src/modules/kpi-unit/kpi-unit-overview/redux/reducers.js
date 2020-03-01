import { overviewConstants } from "./constants";

export function overviewKpiUnit (state = {}, action){
    switch (action.type) {
        case overviewConstants.GETALL_KPIUNIT_REQUEST:
          return {
            loading: true
          };
        case overviewConstants.GETALL_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            kpis: action.kpis.content
          };
        case overviewConstants.GETALL_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case overviewConstants.GETCURRENT_KPIUNIT_REQUEST:
          return {
            ...state,
            loading: true
          };
        case overviewConstants.GETCURRENT_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            currentKPI: action.currentKPI.content
          };
        case overviewConstants.GETCURRENT_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case overviewConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST:
          return {
            ...state,
            loading: true
          };
        case overviewConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS:
          return {
            ...state,
            loading: false,
            childtarget: action.childtarget.content
          };
        case overviewConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE:
          return {
            error: action.error
          };
        
        case overviewConstants.ADD_KPIUNIT_REQUEST:
          return {
            ...state,
            adding: true
          };
        case overviewConstants.ADD_KPIUNIT_SUCCESS:
          return {
            ...state,
            adding: false,
            currentKPI: action.newKPI.kpiunit
          };
        case overviewConstants.ADD_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        
        case overviewConstants.EVALUATE_KPIUNIT_REQUEST:
          return {
            ...state,
            kpis: state.kpis.map(kpiunit =>
              kpiunit._id === action.id
                ? {...kpiunit, evaluating: true} : kpiunit)
          };
        case overviewConstants.EVALUATE_KPIUNIT_SUCCESS:
          return {
            ...state,
            kpis: state.kpis.map(kpiunit =>
              kpiunit._id === action.newKPI.kpiunit._id
                ? action.newKPI.kpiunit : kpiunit)
          };
        case overviewConstants.EVALUATE_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        default:
          return state
    }
}