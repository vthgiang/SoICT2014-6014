import { createKpiSetConstants } from "./constants";

export function createEmployeeKpiSet(state = {}, action) {
  switch (action.type) {
    case  createKpiSetConstants.GET_EMPLOYEE_KPI_SET_REQUEST:
      return {
        loading: true,
        isLoading: true
      };
    case createKpiSetConstants.GET_EMPLOYEE_KPI_SET_SUCCESS:
      return {
        ...state,
        loading: false,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiSetConstants.GET_EMPLOYEE_KPI_SET_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_REQUEST:
      return {
        employeeKpiSetByMonth: null,
        loading: true,
        isLoading: true
      };
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSetByMonth: action.payload,
        isLoading: false
      };
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    case  createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_REQUEST:
      return {
        ...state,
        // adding: true
        editing: true,
        isLoading: false
      };
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_SUCCESS:
    
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
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_REQUEST:
      return {
        ...state,
        editing: true,
        isLoading: false
      };
    case createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_SUCCESS:
      return {
        ...state,
        editing: false,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_REQUEST:
      return {
        ...state,
        deleting: true,
        isLoading: false
      };
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_SUCCESS:
      return {
        ...state,
        deleting: false,
        currentKPI: null,
        isLoading: false
      };
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
      case  createKpiSetConstants.DELETE_EMPLOYEE_KPI_REQUEST:
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
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    case  createKpiSetConstants.CREATE_EMPLOYEE_KPI_REQUEST:
      return {
        loading: true,
        isLoading: false
      };
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    case  createKpiSetConstants.EDIT_EMPLOYEE_KPI_REQUEST:
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
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_SUCCESS:
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
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    case  createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_REQUEST:
        return {
          adding: true,
          isLoading: false
        };
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_SUCCESS:
      return {
        ...state,
        adding: false,
        currentKPI: action.payload,
        isLoading: false
      };
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };

    default:
      return state
  }
}