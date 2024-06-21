import { createUnitKpiConstants } from './constants'
import { managerConstants } from '../../management/redux/constants'

export function createKpiUnit(state = {}, action) {
  switch (action.type) {
    case createUnitKpiConstants.GETCURRENT_KPIUNIT_REQUEST:
      return {
        ...state,
        organizationalUnitKpiLoading: action.typeState === 'default' ? false : state.organizationalUnitKpiLoading,
        copyKPILoading: action.typeState === 'copy' ? true : state.copyKPILoading,
        loading: action.typeState === 'default' ? true : state.loading,
        isLoading: action.typeState === 'default' ? true : state.isLoading,
        currentKPI: action.typeState === 'default' ? null : state.currentKPI,
        copyKPI: action.typeState === 'copy' ? null : state.copyKPI
      }
    case createUnitKpiConstants.GETCURRENT_KPIUNIT_SUCCESS:
      return {
        ...state,
        organizationalUnitKpiLoading: action.typeState === 'default' ? true : state.organizationalUnitKpiLoading,
        copyKPILoading: action.typeState === 'copy' ? false : state.copyKPILoading,
        loading: action.typeState === 'default' ? false : state.loading,
        currentKPI: action.typeState === 'default' ? action.payload : state.currentKPI,
        copyKPI: action.typeState === 'copy' ? action.payload : state.copyKPI,
        isLoading: action.typeState === 'default' ? false : state.idLoading
      }
    case createUnitKpiConstants.GETCURRENT_KPIUNIT_FAILURE:
      return {
        ...state,
        copyKPILoading: action.typeState === 'copy' ? false : state.copyKPILoading,
        organizationUnitKpiLoading: true,
        error: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.GETPARENT_KPIUNIT_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      }
    case createUnitKpiConstants.GETPARENT_KPIUNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        parent: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.GETPARENT_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_REQUEST:
      return {
        ...state,
        organizationalUnitKpiSets: null,
        loading: true,
        isLoading: false
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoading: false,
        organizationalUnitKpiSets: action.payload
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_REQUEST:
      return {
        ...state,
        organizationalUnitKpiSets: null,
        loading: true,
        isLoading: false
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_SUCCESS: 
      return {
        ...state,
        loading: false,
        isLoading: false,
        organizationalUnitKpiSets: action.payload
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_OF_CHILDUNIT_REQUEST:
      return {
        ...state,
        organizationalUnitKpiSetsOfChildUnit: null,
        loading: true,
        isLoading: false
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_OF_CHILDUNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        isLoading: false,
        organizationalUnitKpiSetsOfChildUnit: action.payload
      }
    case createUnitKpiConstants.GET_ALL_ORGANIZATIONALUNIT_KPI_SET_BY_TIME_OF_CHILDUNIT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case createUnitKpiConstants.GET_ALL_CHILDTARGET_OF_ORGANIZATIONALUNITKPIS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      }
    case createUnitKpiConstants.ADD_KPIUNIT_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: false
      }
    case createUnitKpiConstants.ADD_KPIUNIT_SUCCESS:
      return {
        ...state,
        adding: false,
        currentKPI: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.ADD_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.EDIT_KPIUNIT_REQUEST:
      return {
        ...state,
        editing: true,
        isLoading: false
      }
    case createUnitKpiConstants.EDIT_KPIUNIT_SUCCESS:
      return {
        ...state,
        editing: false,
        currentKPI: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.EDIT_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case createUnitKpiConstants.DELETE_KPIUNIT_REQUEST:
      return {
        ...state,
        deleting: true,
        isLoading: false
      }
    case createUnitKpiConstants.DELETE_KPIUNIT_SUCCESS:
      return {
        ...state,
        deleting: false,
        currentKPI: null,
        isLoading: false
      }
    case createUnitKpiConstants.DELETE_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.ADDTARGET_KPIUNIT_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: false
      }
    case createUnitKpiConstants.ADDTARGET_KPIUNIT_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.ADDTARGET_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.EDITTARGET_KPIUNIT_REQUEST:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI.kpis.map((target) => (target._id === action.payload ? { ...target, editing: true } : target))
        },
        isLoading: false
      }
    case createUnitKpiConstants.EDITTARGET_KPIUNIT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI.kpis.map((target) => (target._id === action.payload._id ? action.payload : target))
        },
        isLoading: false
      }
    case createUnitKpiConstants.EDITTARGET_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.DELETETARGET_KPIUNIT_REQUEST:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI.kpis.map((target) => (target._id === action.payload ? { ...target, deleting: true } : target))
        },
        isLoading: false
      }
    case createUnitKpiConstants.DELETETARGET_KPIUNIT_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      }
    case createUnitKpiConstants.DELETETARGET_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case managerConstants.COPY_KPIUNIT_REQUEST:
      if (action.typeService === 'copy-parent-kpi-to-unit') {
        return {
          ...state,
          adding: true,
          isLoading: false,
          currentKPI: null
        }
      }
    case managerConstants.COPY_KPIUNIT_SUCCESS:
      if (action.typeService === 'copy-parent-kpi-to-unit') {
        return {
          ...state,
          adding: false,
          currentKPI: action.payload,
          isLoading: false
        }
      }
    case managerConstants.COPY_KPIUNIT_FAILURE:
      if (action.typeService === 'copy-parent-kpi-to-unit') {
        return {
          ...state,
          adding: false,
          error: action.payload,
          isLoading: false
        }
      }
    case createUnitKpiConstants.CREATE_COMMENT_REQUEST:
      return {
        ...state,
        adding: true
      }
    case createUnitKpiConstants.CREATE_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.CREATE_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createUnitKpiConstants.CREATE_COMMENT_OF_COMMENT_REQUEST:
      return {
        ...state,
        adding: true
      }
    case createUnitKpiConstants.CREATE_COMMENT_OF_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.CREATE_COMMENT_OF_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createUnitKpiConstants.EDIT_COMMENT_REQUEST:
      return {
        ...state,
        editing: true
      }
    case createUnitKpiConstants.EDIT_COMMENT_SUCCESS:
      return {
        ...state,
        idLoading: false,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.EDIT_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createUnitKpiConstants.DELETE_COMMENT_REQUEST:
      return {
        ...state,
        editing: true
      }
    case createUnitKpiConstants.DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.DELETE_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createUnitKpiConstants.EDIT_COMMENT_OF_COMMENT_REQUEST:
      return {
        ...state,
        editing: true
      }
    case createUnitKpiConstants.EDIT_COMMENT_OF_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.EDIT_COMMENT_OF_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createUnitKpiConstants.DELETE_COMMENT_OF_COMMENT_REQUEST:
      return {
        ...state,
        deleting: true
      }
    case createUnitKpiConstants.DELETE_COMMENT_OF_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.DELETE_COMMENT_OF_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createUnitKpiConstants.DELETE_FILE_COMMENT_REQUEST:
      return {
        ...state,
        deleting: true
      }
    case createUnitKpiConstants.DELETE_FILE_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.DELETE_FILE_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    case createUnitKpiConstants.DELETE_FILE_CHILD_COMMENT_REQUEST:
      return {
        ...state,
        deleting: true
      }
    case createUnitKpiConstants.DELETE_FILE_CHILD_COMMENT_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          comments: action.payload
        }
      }
    case createUnitKpiConstants.DELETE_FILE_CHILD_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}
