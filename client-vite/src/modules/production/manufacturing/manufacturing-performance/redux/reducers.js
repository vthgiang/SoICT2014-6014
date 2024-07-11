import { manufacturingMetricConstants } from './constants'

const initState = {
  isLoading: false,
  listKpis: [],
  listReportElements: [],
  currentKpi: null,
  totalDocs: 0
}

export function manufacturingMetric(state = initState, action) {
  switch (action.type) {
    case manufacturingMetricConstants.GET_ALL_MANUFACTURING_KPIS_REQUEST:
    case manufacturingMetricConstants.GET_MANUFACTURING_KPI_BY_ID_REQUEST:
    case manufacturingMetricConstants.CREATE_MANUFACTURING_KPI_REQUEST:
    case manufacturingMetricConstants.EDIT_MANUFACTURING_KPIS_REQUEST:
    case manufacturingMetricConstants.EDIT_MANUFACTURING_KPI_REQUEST:
    case manufacturingMetricConstants.GET_ALL_REPORT_ELEMENTS_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case manufacturingMetricConstants.GET_ALL_MANUFACTURING_KPIS_FAILURE:
    case manufacturingMetricConstants.GET_MANUFACTURING_KPI_BY_ID_FAILURE:
    case manufacturingMetricConstants.CREATE_MANUFACTURING_KPI_FAILURE:
    case manufacturingMetricConstants.EDIT_MANUFACTURING_KPIS_FAILURE:
    case manufacturingMetricConstants.EDIT_MANUFACTURING_KPI_FAILURE:
    case manufacturingMetricConstants.GET_ALL_REPORT_ELEMENTS_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case manufacturingMetricConstants.GET_ALL_MANUFACTURING_KPIS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listKpis: action.payload.manufacturingMetrics.docs,
        totalDocs: action.payload.manufacturingMetrics.totalDocs,
      }
    case manufacturingMetricConstants.GET_MANUFACTURING_KPI_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentKpi: action.payload.manufacturingMetric
      }
    case manufacturingMetricConstants.CREATE_MANUFACTURING_KPI_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listKpis: [...state.listKpis, action.payload.manufacturingMetric]
      }
    case manufacturingMetricConstants.GET_ALL_MANUFACTURING_KPIS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentKpi: action.payload.manufacturingMetric
        }
    case manufacturingMetricConstants.EDIT_MANUFACTURING_KPIS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listKpis: action.payload.manufacturingMetrics
      }
    case manufacturingMetricConstants.EDIT_MANUFACTURING_KPI_SUCCESS:
      const { actions, failureCauses } = action.payload.manufacturingMetric
      const newCurrentKpi = {...state.currentKpi }
      if (actions) {
        newCurrentKpi.actions = actions
      }
      if (failureCauses) {
        newCurrentKpi.failureCauses = failureCauses
      }

      return {
        ...state,
        isLoading: false,
        currentKpi: newCurrentKpi
      }
    case manufacturingMetricConstants.GET_ALL_REPORT_ELEMENTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listReportElements: action.payload.reportElements
      }
    default:
      return state
  }
}
