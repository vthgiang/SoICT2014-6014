import { manufacturingRoutingConstants } from './constants'

const initState = {
  isLoading: false,
  listRoutings: [],
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

export function manufacturingRouting(state = initState, action) {
  switch (action.type) {
    case manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_REQUEST:
    case manufacturingRoutingConstants.GET_DETAIL_MANUFACTURING_ROUTING_REQUEST:
    case manufacturingRoutingConstants.CREATE_MANUFACTURING_ROUTING_REQUEST:
    case manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_BY_GOOD_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_FAILURE:
    case manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_FAILURE:
    case manufacturingRoutingConstants.CREATE_MANUFACTURING_ROUTING_FAILURE:
    case manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_BY_GOOD_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    case manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRoutings: action.payload.manufacturingRoutings.docs,
        totalDocs: action.payload.manufacturingRoutings.totalDocs,
        limit: action.payload.manufacturingRoutings.limit,
        totalPages: action.payload.manufacturingRoutings.totalPages,
        page: action.payload.manufacturingRoutings.page,
        pagingCounter: action.payload.manufacturingRoutings.pagingCounter,
        hasPrevPage: action.payload.manufacturingRoutings.hasPrevPage,
        hasNextPage: action.payload.manufacturingRoutings.hasNextPage,
        prevPage: action.payload.manufacturingRoutings.prevPage,
        nextPage: action.payload.manufacturingRoutings.nextPage
      }
    case manufacturingRoutingConstants.GET_DETAIL_MANUFACTURING_ROUTING_SUCCESS:
      return {
        ...state,
        currentRouting: action.payload.manufacturingRouting,
        isLoading: false
      }
    case manufacturingRoutingConstants.CREATE_MANUFACTURING_ROUTING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRoutings: [...state.listRoutings, action.payload.manufacturingRouting],
      }
      case manufacturingRoutingConstants.GET_ALL_MANUFACTURING_ROUTINGS_BY_GOOD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRoutings: action.payload.manufacturingRoutings,
      }
    default:
      return state
  }
}
