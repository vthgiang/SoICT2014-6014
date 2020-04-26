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
            currentKPI: action.currentKPI.content,
            isLoading: false
          };
        case createUnitKpiConstants.GETCURRENT_KPIUNIT_FAILURE:
          return {
            error: action.error,
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
            parent: action.parentKPI.content,
            isLoading: false
          };
        case createUnitKpiConstants.GETPARENT_KPIUNIT_FAILURE:
          return {
            error: action.error,
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
            currentKPI: action.newKPI.organizationalUnitKpi,
            isLoading: false
          };
        case createUnitKpiConstants.ADD_KPIUNIT_FAILURE:
          return {
            error: action.error,
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
            currentKPI: action.newKPI.organizationalUnitKpiSet,
            isLoading: false
          };
        case createUnitKpiConstants.EDIT_KPIUNIT_FAILURE:
          return {
            error: action.error,
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
            currentKPI: action.newKPI.kpiunit,
            isLoading: false
          };
        case createUnitKpiConstants.EDITSTATUS_KPIUNIT_FAILURE:
          return {
            error: action.error,
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
            error: action.error,
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
            currentKPI: action.newKPI.organizationalUnitKpiSet,
            isLoading: false
          };
        case createUnitKpiConstants.ADDTARGET_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              kpis: state.currentKPI.kpis.map(target =>
                target._id === action.id
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
                target._id === action.newTarget.target._id
                  ? action.newTarget.target : target)
            },
            isLoading: false
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              kpis: state.currentKPI.kpis.map(target =>
                target._id === action.id
                  ? { ...target, deleting: true }
                  : target)
            },
            isLoading: false
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_SUCCESS:
          return {
            ...state,
            currentKPI: action.newKPI.organizationalUnitKpiSet,
            isLoading: false
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_FAILURE:
          return {
            error: action.error,
            isLoading: false
          };
        default:
          return state
      }
}