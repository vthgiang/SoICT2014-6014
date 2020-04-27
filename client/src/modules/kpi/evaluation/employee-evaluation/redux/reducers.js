import { kpiMemberConstants } from "./constants";
 
export function kpimembers(state = {}, action) {
  switch (action.type) {
    case  kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_REQUEST:
      return {
        loading: true,
        isLoading: true
      };
    case kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        kpimembers: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  kpiMemberConstants.GETALL_KPIMEMBER_REQUEST:
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
        error: action.payload,
        isLoading: false
      };
 
    case  kpiMemberConstants.GET_KPIMEMBER_BYID_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYID_SUCCESS:
      return {
        ...state,
        loading: false,
        currentKPI: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYID_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  kpiMemberConstants.GET_KPIMEMBER_BYMONTH_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYMONTH_SUCCESS:
      return {
        ...state,
        loading: false,
        kpimember: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_KPIMEMBER_BYMONTH_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
 
    case  kpiMemberConstants.APPROVE_KPIMEMBER_REQUEST:
      return {
        ...state,
        confirming: true,
        isLoading: false
      };
    case kpiMemberConstants.APPROVE_KPIMEMBER_SUCCESS:
      return {
        ...state,
        currentKPI: action.payload.kpimember,
        kpimembers: state.kpimembers.map(item=>
          item._id===action.payload.kpimember._id?action.payload.kpimember:item),
        isLoading: false
      };
    case kpiMemberConstants.APPROVE_KPIMEMBER_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  kpiMemberConstants.EDITTARGET_KPIMEMBER_REQUEST:
      return {
        ...state,
        currentKPI: {
          ...state.currentKPI,
          listtarget: state.currentKPI.listtarget.map(target =>
            target._id === action.id
              ? { ...target, editing: true }
              : target)
        },
        isLoading: false
      };
    case kpiMemberConstants.EDITTARGET_KPIMEMBER_SUCCESS:
      return {
          ...state,
          currentKPI: {
            ...state.currentKPI,
            listtarget: state.currentKPI.listtarget.map(target =>
              target._id === action.payload.target._id
                ? action.payload.target : target)
          },
          isLoading: false
      };
    case kpiMemberConstants.EDITTARGET_KPIMEMBER_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case  kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_REQUEST:
      return {
        ...state,
        editing: true,
        isLoading: false
      };
    case kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_SUCCESS:
      return {
        ...state,
        editing: false,
        currentKPI: action.payload.newKPI,
        kpimembers: state.kpimembers.map(item=>
          item._id===action.payload.newKPI._id?action.payload.newKPI:item),
        isLoading: false
      };
    case kpiMemberConstants.EDITSTATUS_TARGET_KPIMEMBER_FAILURE:
      return { 
        error: action.payload,
        isLoading: false
      };
    case kpiMemberConstants.GET_TASK_BYID_FAILURE:
      return { 
        error: action.payload
        };
    case  kpiMemberConstants.GET_TASK_BYID_REQUEST: // đợi tí xem lại :))
      return {
        ...state,
        loading: true // hình như đang nhầm đoạn này :)) ok b
        };
    case  kpiMemberConstants.GET_TASK_BYID_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload.content, 
      };

    //----------------------------------------------
    case  kpiMemberConstants.SET_POINTKPI_REQUEST:
        return {
          ...state,
        editing: true
        };
      case kpiMemberConstants.SET_POINTKPI_SUCCESS:
        return {
            ...state,
            currentKPI : action.payload.content,
        };
      case kpiMemberConstants.SET_POINTKPI_FAILURE:
        return { 
          error: action.payload
        };
    //----------------------------------------------------------------



    default:
      return state
  }
}