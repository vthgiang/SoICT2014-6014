import { manufacturingQualityInspectionConstants } from './constants'

const initState = {
  isLoading: false,
  listInspections: [],
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

export function manufacturingQualityInspection(state = initState, action) {
  switch (action.type) {
    case manufacturingQualityInspectionConstants.GET_ALL_MANUFACTURING_QUALITY_INSPECTIONS_REQUEST:
    case manufacturingQualityInspectionConstants.CREATE_MANFACTURING_QUALITY_INSPECTION_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case manufacturingQualityInspectionConstants.GET_ALL_MANUFACTURING_QUALITY_INSPECTIONS_FAILURE:
    case manufacturingQualityInspectionConstants.CREATE_MANUFACTURING_QUALITY_INSPECTION_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case manufacturingQualityInspectionConstants.GET_ALL_MANUFACTURING_QUALITY_INSPECTIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listInspections: action.payload.manufacturingQualityInspections.docs,
        totalDocs: action.payload.manufacturingQualityInspections.totalDocs,
        limit: action.payload.manufacturingQualityInspections.limit,
        totalPages: action.payload.manufacturingQualityInspections.totalPages,
        page: action.payload.manufacturingQualityInspections.page,
        pagingCounter: action.payload.manufacturingQualityInspections.pagingCounter,
        hasPrevPage: action.payload.manufacturingQualityInspections.hasPrevPage,
        hasNextPage: action.payload.manufacturingQualityInspections.hasNextPage,
        prevPage: action.payload.manufacturingQualityInspections.prevPage,
        nextPage: action.payload.manufacturingQualityInspections.nextPage
      }
    case manufacturingQualityInspectionConstants.CREATE_MANUFACTURING_QUALITY_INSPECTION_SUCCESS:
      return {
        ...state, 
        isLoading: false,
        listInspections: [...state.listInspections, action.payload.manufacturingQualityInspection]
      }
    default:
      return state
  }
}
