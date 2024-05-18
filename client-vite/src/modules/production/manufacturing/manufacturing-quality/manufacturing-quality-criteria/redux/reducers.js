import { manufacturingQualityCriteriaConstants } from './constants'

const initState = {
  isLoading: false,
  listCriterias: [],
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  page: 0,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: 0,
  nextPage: 0,
}

export function manufacturingQualityCriteria(state = initState, action) {
  switch (action.type) {
    case manufacturingQualityCriteriaConstants.GET_ALL_MANUFACTURING_QUALITY_CRITERIAS_REQUEST:
    case manufacturingQualityCriteriaConstants.GET_DETAIL_MANUFACTURING_QUALITY_CRITERIA_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case manufacturingQualityCriteriaConstants.GET_ALL_MANUFACTURING_QUALITY_CRITERIAS_FAILURE:
    case manufacturingQualityCriteriaConstants.GET_DETAIL_MANUFACTURING_QUALITY_CRITERIA_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case manufacturingQualityCriteriaConstants.GET_ALL_MANUFACTURING_QUALITY_CRITERIAS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listCriterias: action.payload.manufacturingQualityCriterias.docs,
        totalDocs: action.payload.manufacturingQualityCriterias.totalDocs,
        limit: action.payload.manufacturingQualityCriterias.limit,
        totalPages: action.payload.manufacturingQualityCriterias.totalPages,
        page: action.payload.manufacturingQualityCriterias.page,
        pagingCounter: action.payload.manufacturingQualityCriterias.pagingCounter,
        hasPrevPage: action.payload.manufacturingQualityCriterias.hasPrevPage,
        hasNextPage: action.payload.manufacturingQualityCriterias.hasNextPage,
        prevPage: action.payload.manufacturingQualityCriterias.prevPage,
        nextPage: action.payload.manufacturingQualityCriterias.nextPage
      }
    case manufacturingQualityCriteriaConstants.GET_DETAIL_MANUFACTURING_QUALITY_CRITERIA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        currentCriteria: action.payload.manufacturingQualityCriteria
      }
    default:
      return state
  }
}
