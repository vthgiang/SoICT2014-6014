import { managerConstants } from '../../../organizational-unit/management/redux/constants'
import { createKpiSetConstants } from './constants'

export function createEmployeeKpiSet(state = { reload: false }, action) {
  switch (action.type) {
    case createKpiSetConstants.GET_EMPLOYEE_KPI_SET_REQUEST:
      return {
        ...state,
        currentKPI: null,
        currentKPILoading: false,
        isLoading: true
      }
    case createKpiSetConstants.GET_EMPLOYEE_KPI_SET_SUCCESS:
      return {
        ...state,
        loading: false,
        currentKPI: action.payload,
        currentKPILoading: true,
        isLoading: false
      }
    case createKpiSetConstants.GET_EMPLOYEE_KPI_SET_FAILURE:
      return {
        ...state,
        error: action.payload,
        currentKPILoading: true,
        isLoading: false
      }
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_REQUEST:
      return {
        ...state,
        employeeKpiSetByMonth: null,
        isLoading: true
      }
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_SUCCESS:
      return {
        ...state,
        loading: false,
        employeeKpiSetByMonth: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_BY_MONTH_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_REQUEST:
      return {
        ...state,
        // adding: true
        editing: true,
        isLoading: false
      }
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
      }
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_SET_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_REQUEST:
      return {
        ...state,
        editing: true,
        isLoading: false
      }
    case createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_SUCCESS:
      return {
        ...state,
        editing: false,
        currentKPI: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.UPDATE_EMPLOYEE_KPI_SET_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_REQUEST:
      return {
        ...state,
        deleting: true,
        isLoading: false
      }
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_SUCCESS:
      return {
        ...state,
        deleting: false,
        currentKPI: null,
        isLoading: false
      }
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_SET_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNITS_BY_MONTH_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: false,
        employeeKpiSetsInOrganizationalUnitByMonth: null
      }
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNITS_BY_MONTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoading: false,
        employeeKpiSetsInOrganizationalUnitByMonth: action.payload
      }
    case createKpiSetConstants.GET_ALL_EMPLOYEE_KPI_SET_IN_ORGANIZATIONALUNITS_BY_MONTH_FAILURE:
      return {
        ...state,
        loading: false,
        isLoading: false,
        error: action.payload
      }
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_REQUEST:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI.kpis.map((target) => (target._id === action.id ? { ...target, deleting: true } : target))
        },
        isLoading: false
      }
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.DELETE_EMPLOYEE_KPI_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: false
      }
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_REQUEST:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI?.kpis?.map((target) => (target?._id === action.payload ? { ...target, editing: true } : target))
        },
        isLoading: false
      }
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI?.kpis?.map((target) => (target?._id === action.payload._id ? action.payload : target))
        },
        isLoading: false
      }
    case createKpiSetConstants.EDIT_EMPLOYEE_KPI_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: false
      }
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_SUCCESS:
      return {
        ...state,
        adding: false,
        currentKPI: action.payload,
        isLoading: false
      }
    case createKpiSetConstants.CREATE_EMPLOYEE_KPI_SET_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case createKpiSetConstants.CREATE_COMMENT_REQUEST:
      return {
        ...state,
        adding: true
      }
    case createKpiSetConstants.CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_REQUEST:
      return {
        ...state,
        adding: true
      }
    case createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.CREATE_COMMENT_OF_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createKpiSetConstants.EDIT_COMMENT_REQUEST:
      return {
        ...state,
        editing: true
      }
    case createKpiSetConstants.EDIT_COMMENT_SUCCESS:
      return {
        ...state,
        idLoading: false,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.EDIT_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createKpiSetConstants.DELETE_COMMENT_REQUEST:
      return {
        ...state,
        editing: true
      }
    case createKpiSetConstants.DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.DELETE_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_REQUEST:
      return {
        ...state,
        editing: true
      }
    case createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.EDIT_COMMENT_OF_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_REQUEST:
      return {
        ...state,
        deleting: true
      }
    case createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.DELETE_COMMENT_OF_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createKpiSetConstants.DELETE_FILE_COMMENT_REQUEST:
      return {
        ...state,
        deleting: true
      }
    case createKpiSetConstants.DELETE_FILE_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.DELETE_FILE_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createKpiSetConstants.DELETE_FILE_CHILD_COMMENT_REQUEST:
      return {
        ...state,
        deleting: true
      }
    case createKpiSetConstants.DELETE_FILE_CHILD_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createKpiSetConstants.DELETE_FILE_CHILD_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }

    case managerConstants.COPY_KPIUNIT_REQUEST:
      if (action.typeService === 'copy-parent-kpi-to-employee') {
        return {
          ...state,
          currentKPI: null,
          isLoading: false
        }
      }
    case managerConstants.COPY_KPIUNIT_SUCCESS:
      if (action.typeService === 'copy-parent-kpi-to-employee') {
        return {
          ...state,
          currentKPI: action.payload,
          isLoading: false
        }
      }
    case managerConstants.COPY_KPIUNIT_FAILURE:
      if (action.typeService === 'copy-parent-kpi-to-employee') {
        return {
          ...state,
          error: action.payload,
          isLoading: false
        }
      }
    default:
      return state
  }
}
