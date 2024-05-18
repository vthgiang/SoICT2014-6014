import { manufacturingQualityErrorConstants } from './constants'

const initState = {
  isLoading: false,
  listErrors: [],
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

export function manufacturingQualityError(state = initState, action) {
  switch (action.type) {
    case manufacturingQualityErrorConstants.GET_ALL_MANUFACTURING_QUALITY_ERRORS_REQUEST:
    case manufacturingQualityErrorConstants.GET_MANUFACTURING_QUALITY_ERROR_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case manufacturingQualityErrorConstants.GET_ALL_MANUFACTURING_QUALITY_ERRORS_FAILURE:
    case manufacturingQualityErrorConstants.GET_MANUFACTURING_QUALITY_ERROR_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case manufacturingQualityErrorConstants.GET_ALL_MANUFACTURING_QUALITY_ERRORS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listErrors: action.payload.manufacturingQualityErrors.docs,
        totalDocs: action.payload.manufacturingQualityErrors.totalDocs,
        limit: action.payload.manufacturingQualityErrors.limit,
        totalPages: action.payload.manufacturingQualityErrors.totalPages,
        page: action.payload.manufacturingQualityErrors.page,
        pagingCounter: action.payload.manufacturingQualityErrors.pagingCounter,
        hasPrevPage: action.payload.manufacturingQualityErrors.hasPrevPage,
        hasNextPage: action.payload.manufacturingQualityErrors.hasNextPage,
        prevPage: action.payload.manufacturingQualityErrors.prevPage,
        nextPage: action.payload.manufacturingQualityErrors.nextPage
      }
    case manufacturingQualityErrorConstants.GET_DETAIL_MANUFACTURING_QUALITY_ERROR_SUCCESS:
      return {
        ...state,
        currentError: action.payload.manufacturingQualityError,
        isLoading: false
      }
    default:
      return state
  }
}
