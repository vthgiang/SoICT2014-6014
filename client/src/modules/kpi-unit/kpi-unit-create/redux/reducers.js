import { createUnitKpiConstants } from "./constants";

export function createKpiUnit (state = {}, action){
    switch (action.type) {
        case createUnitKpiConstants.GETCURRENT_KPIUNIT_REQUEST:
          return {
            ...state,
            loading: true
          };
        case createUnitKpiConstants.GETCURRENT_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            currentKPI: action.currentKPI.content
          };
        case createUnitKpiConstants.GETCURRENT_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case createUnitKpiConstants.GETPARENT_KPIUNIT_REQUEST:
          return {
            ...state,
            loading: true
          };
        case createUnitKpiConstants.GETPARENT_KPIUNIT_SUCCESS:
          return {
            ...state,
            loading: false,
            parent: action.parentKPI.content
          };
        case createUnitKpiConstants.GETPARENT_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case createUnitKpiConstants.ADD_KPIUNIT_REQUEST:
          return {
            ...state,
            adding: true
          };
        case createUnitKpiConstants.ADD_KPIUNIT_SUCCESS:
          return {
            ...state,
            adding: false,
            currentKPI: action.newKPI.kpiunit
          };
        case createUnitKpiConstants.ADD_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case createUnitKpiConstants.EDIT_KPIUNIT_REQUEST:
          return {
            ...state,
            editing: true
          };
        case createUnitKpiConstants.EDIT_KPIUNIT_SUCCESS:
          return {
            ...state,
            editing: false,
            currentKPI: action.newKPI.kpiunit
          };
        case createUnitKpiConstants.EDIT_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case createUnitKpiConstants.EDITSTATUS_KPIUNIT_REQUEST:
          return {
            ...state,
            editing: true
          };
        case createUnitKpiConstants.EDITSTATUS_KPIUNIT_SUCCESS:
          return {
            ...state,
            editing: false,
            currentKPI: action.newKPI.kpiunit
          };
        case createUnitKpiConstants.EDITSTATUS_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        
        case createUnitKpiConstants.DELETE_KPIUNIT_REQUEST:
          return {
            ...state,
            deleting: true
          };
        case createUnitKpiConstants.DELETE_KPIUNIT_SUCCESS:
          return {
            ...state,
            deleting: false,
            currentKPI: null
          };
        case createUnitKpiConstants.DELETE_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case createUnitKpiConstants.ADDTARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            adding: true
          };
        case createUnitKpiConstants.ADDTARGET_KPIUNIT_SUCCESS:
          return {
            ...state,
            currentKPI: action.newKPI.kpiunit
          };
        case createUnitKpiConstants.ADDTARGET_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              listtarget: state.currentKPI.listtarget.map(target =>
                target._id === action.id
                  ? { ...target, editing: true }
                  : target)
            }
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_SUCCESS:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              listtarget: state.currentKPI.listtarget.map(target =>
                target._id === action.newTarget.target._id
                  ? action.newTarget.target : target)
            }
          };
        case createUnitKpiConstants.EDITTARGET_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_REQUEST:
          return {
            ...state,
            currentKPI: {
              ...state.currentKPI,
              listtarget: state.currentKPI.listtarget.map(target =>
                target._id === action.id
                  ? { ...target, deleting: true }
                  : target)
            }
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_SUCCESS:
          return {
            ...state,
            currentKPI: action.newKPI.kpiunit
          };
        case createUnitKpiConstants.DELETETARGET_KPIUNIT_FAILURE:
          return {
            error: action.error
          };
        default:
          return state
      }
}