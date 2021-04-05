import { kpiMemberConstants } from "./constants";
import { createKpiSetConstants } from '../../../employee/creation/redux/constants';
import { managerKPIConstants } from '../../../employee/management/redux/constants';

export function kpimembers(state = {}, action) {
  switch (action.type) {
    case kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true,
        totalCountEmployeeKpiSet: null,
        totalPageEmployeeKpiSet: null
      };
    case kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        kpimembers: action.payload.employeeKpiSets,
        totalCountEmployeeKpiSet: action.payload.totalCount,
        totalPageEmployeeKpiSet: action.payload.totalPages,
        isLoading: false
      };
    case kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case kpiMemberConstants.GETALL_KPIMEMBER_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case kpiMemberConstants.GETALL_KPIMEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        kpimembers: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GETALL_KPIMEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYID_REQUEST:
      return {
        ...state,
        isLoading: true,
        currentKPI: null,
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYID_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYID_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYMONTH_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYMONTH_SUCCESS:
      return {
        ...state,
        kpimember: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYMONTH_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.APPROVE_KPIMEMBER_REQUEST:
      return {
        ...state,
        confirming: true,
        isLoading: false
      };
    case kpiMemberConstants.APPROVE_KPIMEMBER_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,
        kpimembers: state.kpimembers.map(item =>
          item._id === action.payload._id ? action.payload : item),
        isLoading: false
      };
    case kpiMemberConstants.APPROVE_KPIMEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.EDITTARGET_KPIMEMBER_REQUEST:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI.kpis.map(target =>
            target._id === action.id ? { ...target, editing: true } : target)
        },
        isLoading: false
      };
    case kpiMemberConstants.EDITTARGET_KPIMEMBER_SUCCESS:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI.kpis.map(target =>
            target._id === action.payload._id
              ? action.payload : target)
        },
        target: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.EDITTARGET_KPIMEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_REQUEST:
      return {
        ...state,
        editing: true,
        isLoading: false
      };
    case kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_SUCCESS:
      return {
        ...state,
        editing: false,
        currentKPI: action.payload,
        kpimembers: state.kpimembers.map(item =>
          item._id === action.payload._id ? action.payload : item),
        isLoading: false
      };
    case kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_TASK_BYID_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case kpiMemberConstants.GET_TASK_BYID_REQUEST:
      return {
        ...state,
        loading: true,
        taskLoading: true,
        tasks: null
      };
    case kpiMemberConstants.GET_TASK_BYID_SUCCESS:
      return {
        ...state,
        loading: false,
        taskLoading: false,
        tasks: action.payload,
      };
    case kpiMemberConstants.GET_TASK_BY_LIST_KPI_FAILURE:
      return {
        ...state,
        error: action.payload,
        taskLoading: false
      };
    case kpiMemberConstants.GET_TASK_BY_LIST_KPI_REQUEST:
      return {
        ...state,
        loading: true,
        tasksList: null
      };
    case kpiMemberConstants.GET_TASK_BY_LIST_KPI_SUCCESS:
      return {
        ...state,
        loading: false,
        tasksList: action.payload,
      };
    case kpiMemberConstants.SET_POINTKPI_REQUEST:
      return {
        ...state,
        editing: true
      };
    case kpiMemberConstants.SET_POINTKPI_SUCCESS:
      // Cập nhật điểm cho tập kpi
      let updateKpiSet = action.payload.updateKpiSet;
      let kpimembers = state.kpimembers;

      if (kpimembers && kpimembers.length !== 0) {
        kpimembers.filter(item => {
          if (updateKpiSet) {
            return item._id === updateKpiSet._id;
          }
          return false;
        }).forEach(element => {
          element.automaticPoint = updateKpiSet.automaticPoint;
          element.employeePoint = updateKpiSet.employeePoint;
          element.approvedPoint = updateKpiSet.approvedPoint;
        });
      }

      return {
        ...state,
        tasks: action.payload.task,
        currentKPI: {
          ...state.currentKPI,
          kpis: state.currentKPI.kpis.map(kpi =>
            (kpi._id === action.payload.result._id) ? action.payload.result : kpi)
        },
        kpimembers: kpimembers
      };
    case kpiMemberConstants.SET_POINTKPI_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case kpiMemberConstants.TASK_IMPORTANT_LEVEL_REQUEST:
      return {
        ...state,
        editing: true
      };
    case kpiMemberConstants.TASK_IMPORTANT_LEVEL_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload,

      };
    case kpiMemberConstants.TASK_IMPORTANT_LEVEL_FAILURE:
      return {
        ...state,
        error: action.payload
      };
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
        error: action.payload,
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
        error: action.payload,
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
          comments: action.payload,

        }
      }
    case createKpiSetConstants.EDIT_COMMENT_FAILURE:
      return {
        ...state,
        error: action.payload,
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
        error: action.payload,
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
        error: action.payload,
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
        error: action.payload,
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
        error: action.payload,
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
        error: action.payload,
      }

    case managerKPIConstants.COPY_KPIPERSONALS_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: false
      }
    case managerKPIConstants.COPY_KPIPERSONALS_SUCCESS:
      return {
        ...state,
        adding: false,
        isLoading: false,
        kpimembers: state.kpimembers ? [action.payload, ...state.kpimembers] : [action.payload]
      }
    case managerKPIConstants.COPY_KPIPERSONALS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case kpiMemberConstants.SET_POINT_ALL_KPI_REQUEST:
      return {
        ...state,
        editing: true
      };
    case kpiMemberConstants.SET_POINT_ALL_KPI_SUCCESS:
      return {
        ...state,
        employeeKpiSet: action.payload,
        currentKPI: action.payload,
        kpimembers: state.kpimembers.map(kpi =>
          (kpi._id === action.payload._id) ? action.payload : kpi),

      }
    case kpiMemberConstants.SET_POINT_ALL_KPI_FAILURE:
      return {
        error: action.payload
      };

    default:
      return state
  }
}