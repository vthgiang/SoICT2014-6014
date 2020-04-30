import { createUnitKpiConstants } from "./constants";

export function createKpiUnit (state = {}, action){
    switch (action.type) {
        case createUnitKpiConstants.GETCURRENT_KPIUNIT_REQUEST:
          return {
            ...state,
            loading: true,
            isLoading: true
          };
        case createUnitKpiConstants.GETCURRENT_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            currentKPI: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.GETCURRENT_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.GETPARENT_KPIUNIT_REQUEST:
          return {
            ...state,
            loading: true,
            isLoading: true
          };
        case createUnitKpiConstants.GETPARENT_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            parent: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.GETPARENT_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.ADD_KPIUNIT_REQUEST:
          return {
            ...state,
            adding: true,
            isLoading: false
          };
        case createUnitKpiConstants.ADD_KPIUNIT_SUCCESS:
          return {
            ...state,
            adding: false,
            currentKPI: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.ADD_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.EDIT_KPIUNIT_REQUEST:
          return {
            ...state,
            editing: true,
            isLoading: false
          };
        case createUnitKpiConstants.EDIT_KPIUNIT_SUCCESS:
          return {
            ...state,
            editing: false,
            currentKPI: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.EDIT_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.EDITSTATUS_KPIUNIT_REQUEST:
          return {
            ...state,
            editing: true,
            isLoading: false
          };
        case createUnitKpiConstants.EDITSTATUS_KPIUNIT_SUCCESS:
          return {
            ...state,
            editing: false,
            currentKPI: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.EDITSTATUS_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        
        case createUnitKpiConstants.DELETE_KPIUNIT_REQUEST:
          return {
            ...state,
            deleting: true,
            isLoading: false
          };
        case createUnitKpiConstants.DELETE_KPIUNIT_SUCCESS:
          return {
            ...state,
            deleting: false,
            currentKPI: null,
            isLoading: false
          };
        case createUnitKpiConstants.DELETE_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.ADDTARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            adding: true,
            isLoading: false
          };
        case createUnitKpiConstants.ADDTARGET_KPIUNIT_SUCCESS:
          return {
            ...state,
            currentKPI: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.ADDTARGET_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              kpis: state.currentKPI.kpis.map(target =>
                target._id === action.payload
                  ? { ...target, editing: true }
                  : target)
            },
            isLoading: false
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_SUCCESS:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              kpis: state.currentKPI.kpis.map(target =>
                target._id === action.payload._id
                  ? action.payload : target)
            },
            isLoading: false
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              kpis: state.currentKPI.kpis.map(target =>
                target._id === action.payload
                  ? { ...target, deleting: true }
                  : target)
            },
            isLoading: false
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_SUCCESS:
          return {
            ...state,
            currentKPI: action.payload,
            isLoading: false
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_FAILURE:
          return {
            error: action.payload,
            isLoading: false
          };
        default:
          return state
      }
}