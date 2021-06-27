import { managerConstants } from "./constants";
var findIndex = (array, id) => {
  var result = -1;
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index;
    }
  });
  return result;
}
export function managerKpiUnit(state = {}, action) {
  switch (action.type) {
    case managerConstants.GETALL_KPIUNIT_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true,
        totalCountUnitKpiSet: null,
        totalPageUnitKpiSet: null,
      };
    case managerConstants.GETALL_KPIUNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        kpis: action.payload.kpiUnitSets,
        totalCountUnitKpiSet: action.payload.totalCount,
        totalPageUnitKpiSet: action.payload.totalPages,
        isLoading: false
      };
    case managerConstants.GETALL_KPIUNIT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS:
      return {
        ...state,
        loading: false,
        childtarget: action.payload,
        isLoading: false
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_SUCCESS:
      return {
        ...state,
        adding: false,
        kpis: state.kpis ? [action.payload, ...state.kpis] : [action.payload],
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_FAILURE:
      return {
        ...state,
        adding: true,
        error: action.payload,
        isLoading: false
      };
    case managerConstants.CALCULATE_KPIUNIT_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case managerConstants.CALCULATE_KPIUNIT_SUCCESS:
      // let index = findIndex(state.kpis, action.payload.kpiUnitSet.id)
      // state.kpis[index] = action.payload.kpiUnitSet;

      return {
        ...state,
        isLoading: false,
        childtarget: action.payload?.[0]?.childrenKpi,
        kpis: state.kpis.map(kpi => {
          let kpiUnit = action.payload?.filter(item => kpi._id === item.kpiUnitSet._id)

          if (kpiUnit?.length > 0) {
            return kpiUnit?.[0]?.kpiUnitSet
          } else {
            return kpi
          }
        })
      }
    case managerConstants.CALCULATE_KPIUNIT_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    default:
      return state
  }
}