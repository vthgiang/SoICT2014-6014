import { createKpiConstants } from "./constants";

export function createKpiPersonal(state = {}, action) {
  switch (action.type) {
    case  createKpiConstants.GETCURRENT_KPIPERSONAL_REQUEST:
      return {
        loading: true,
        isLoading: true
      };
    case createKpiConstants.GETCURRENT_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        loading: false,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiConstants.GETCURRENT_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  createKpiConstants.EDIT_KPIPERSONAL_REQUEST:
      return {
        ...state,
        // adding: true
        editing: true,
        isLoading: false
      };
    case createKpiConstants.EDIT_KPIPERSONAL_SUCCESS:
    
      return {
        ...state,
        editing: false,
        currentKPI: action.payload,
        // items: [
        //   ...state.items,
        //   action.target.kpipersonal
        // ]
        isLoading: false
      };
    case createKpiConstants.EDIT_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  createKpiConstants.EDITSTATUS_KPIPERSONAL_REQUEST:
      return {
        ...state,
        editing: true,
        isLoading: false
      };
    case createKpiConstants.EDITSTATUS_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        editing: false,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiConstants.EDITSTATUS_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  createKpiConstants.DELETE_KPIPERSONAL_REQUEST:
      return {
        ...state,
        deleting: true,
        isLoading: false
      };
    case createKpiConstants.DELETE_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        deleting: false,
        currentKPI: null,
        isLoading: false
      };
    case createKpiConstants.DELETE_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
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
        },
        isLoading: false
      };
    case createKpiConstants.DELETETARGET_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiConstants.DELETETARGET_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    case  createKpiConstants.ADDTARGET_KPIPERSONAL_REQUEST:
      return {
        loading: true,
        isLoading: false
      };
    case createKpiConstants.ADDTARGET_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiConstants.ADDTARGET_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    case  createKpiConstants.EDITTARGET_KPIPERSONAL_REQUEST:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          listtarget: state.currentKPI.listtarget.map(target =>
            target._id === action.payload
              ? { ...target, editing: true }
              : target)
        },
        isLoading: false
      };
    case createKpiConstants.EDITTARGET_KPIPERSONAL_SUCCESS:
      return {
          ...state,
          currentKPI: {
            ...state.currentKPI,
            listtarget: state.currentKPI.listtarget.map(target =>
              target._id === action.payload._id
                ? action.payload : target)
          },
          isLoading: false
      };
    case createKpiConstants.EDITTARGET_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    case  createKpiConstants.ADD_KPIPERSONAL_REQUEST:
        return {
          adding: true,
          isLoading: false
        };
    case createKpiConstants.ADD_KPIPERSONAL_SUCCESS:
      return {
        ...state,
        adding: false,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiConstants.ADD_KPIPERSONAL_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    default:
      return state
  }
}