import { createKpiConstants } from "./constants";

export function createKpiPersonal(state = {}, action) {
  switch (action.type) {
    case  createKpiConstants.GETCURRENT_KPIPERSONAL_REQUEST:
      return {
        loading: true
      };
    case createKpiConstants.GETCURRENT_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        loading: false,
        currentKPI: action.kpipersonal.content
      };
    case createKpiConstants.GETCURRENT_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };
    case  createKpiConstants.EDIT_KPIPERSONAL_REQUEST:
      return {
        ...state,
        adding: true
      };
    case createKpiConstants.EDIT_KPIPERSONAL_SUCCESS:
      return {
          ...state,
          items: [
            ...state.items,
            action.target.kpipersonal
          ]
      };
    case createKpiConstants.EDIT_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };
    case  createKpiConstants.EDITSTATUS_KPIPERSONAL_REQUEST:
      return {
        ...state,
        editing: true
      };
    case createKpiConstants.EDITSTATUS_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        editing: false,
        currentKPI: action.newKPI.kpipersonal
      };
    case createKpiConstants.EDITSTATUS_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };
    case  createKpiConstants.DELETE_KPIPERSONAL_REQUEST:
      return {
        ...state,
        deleting: true
      };
    case createKpiConstants.DELETE_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        deleting: false,
        currentKPI: null
      };
    case createKpiConstants.DELETE_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };
      case  createKpiConstants.DELETETARGET_KPIPERSONAL_REQUEST:
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
    case createKpiConstants.DELETETARGET_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        currentKPI: action.newKPI.kpipersonal
      };
    case createKpiConstants.DELETETARGET_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };

    case  createKpiConstants.ADDTARGET_KPIPERSONAL_REQUEST:
      return {
        loading: true
      };
    case createKpiConstants.ADDTARGET_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        currentKPI: action.newKPI.kpipersonal
      };
    case createKpiConstants.ADDTARGET_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };

    case  createKpiConstants.EDITTARGET_KPIPERSONAL_REQUEST:
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
    case createKpiConstants.EDITTARGET_KPIPERSONAL_SUCCESS:
      return {
          ...state,
          currentKPI: {
            ...state.currentKPI,
            listtarget: state.currentKPI.listtarget.map(target =>
              target._id === action.newTarget.target._id
                ? action.newTarget.target : target)
          }
      };
    case createKpiConstants.EDITTARGET_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };

    case  createKpiConstants.ADD_KPIPERSONAL_REQUEST:
        return {
          adding: true
        };
    case createKpiConstants.ADD_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        adding: false,
        currentKPI: action.newKPI.kpipersonal
      };
    case createKpiConstants.ADD_KPIPERSONAL_FAILURE:
      return { 
        error: action.error
      };

    default:
      return state
  }
}