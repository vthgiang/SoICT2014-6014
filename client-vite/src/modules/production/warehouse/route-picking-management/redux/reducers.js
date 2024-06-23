import { RoutePickingConstants } from './constants'

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initState = {
  isLoading: false,
  listChemins: [],
  listPaginate: [],
  totalDocs: 0,
  limit: 0,
  totalPages: 0,
  page: 0,
  pagingCounter: 0,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: 0,
  nextPage: 0,
  type: ''
}

export function routes(state = initState, action) {
  var index = -1
  var indexPaginate = -1

  switch (action.type) {
    case RoutePickingConstants.GET_ALL_ROUTES_REQUEST:
    // case RoutePickingConstants.DELETE_DELETE_ROUTE_REQUEST:
    // case RoutePickingConstants.CREATE_ROUTE_REQUEST:
    // case RoutePickingConstants.EDIT_ROUTE_REQUEST:
    case RoutePickingConstants.GET_DETAIL_ROUTE_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case RoutePickingConstants.GET_ALL_ROUTES_SUCCESS:
      return {
        ...state,
        listChemins: action.payload,
        isLoading: false
      }

    case RoutePickingConstants.GET_DETAIL_ROUTE_SUCCESS:
      return {
        ...state,
        routeDetail: action.payload,
        isLoading: false
      }

    // case RoutePickingConstants.PAGINATE_STOCK_SUCCESS:
    //   return {
    //     ...state,
    //     listPaginate: action.payload.docs,
    //     totalDocs: action.payload.totalDocs,
    //     limit: action.payload.limit,
    //     totalPages: action.payload.totalPages,
    //     page: action.payload.page,
    //     pagingCounter: action.payload.pagingCounter,
    //     hasPrevPage: action.payload.hasPrevPage,
    //     hasNextPage: action.payload.hasNextPage,
    //     prevPage: action.payload.prevPage,
    //     nextPage: action.payload.nextPage,
    //     isLoading: false
    //   }

    // case RoutePickingConstants.CREATE_STOCK_SUCCESS:
    //   return {
    //     ...state,
    //     listStocks: [...state.listStocks, action.payload],
    //     listPaginate: [...state.listPaginate, action.payload],
    //     isLoading: false
    //   }
    // case RoutePickingConstants.IMPORT_STOCK_SUCCESS:
    //   return {
    //     ...state,
    //     listStocks: [...state.listStocks, action.payload],
    //     listPaginate: [...state.listPaginate, action.payload],
    //     isLoading: false
    //   }

    // case RoutePickingConstants.UPDATE_STOCK_SUCCESS:
    //   index = findIndex(state.listStocks, action.payload._id)
    //   indexPaginate = findIndex(state.listPaginate, action.payload._id)

    //   if (index !== -1) {
    //     state.listStocks[index] = action.payload
    //   }

    //   if (indexPaginate !== -1) {
    //     state.listPaginate[indexPaginate] = action.payload
    //   }
    //   return {
    //     ...state,
    //     isLoading: false
    //   }

    // case RoutePickingConstants.DELETE_STOCK_SUCCESS:
    //   index = findIndex(state.listStocks, action.payload)
    //   indexPaginate = findIndex(state.listPaginate, action.payload)

    //   if (index !== -1) {
    //     state.listStocks.splice(index, 1)
    //   }

    //   if (indexPaginate !== -1) {
    //     state.listPaginate.splice(indexPaginate, 1)
    //   }
    //   return {
    //     ...state,
    //     isLoading: false
    //   }

    case RoutePickingConstants.GET_ALL_ROUTES_FAILURE:
    case RoutePickingConstants.GET_DETAIL_ROUTE_FAILURE:
    // case RoutePickingConstants.PAGINATE_STOCK_FAILURE:
    // case RoutePickingConstants.CREATE_STOCK_FAILURE:
    // case RoutePickingConstants.IMPORT_STOCK_FAILURE:
    // case RoutePickingConstants.UPDATE_STOCK_FAILURE:
    // case RoutePickingConstants.DELETE_STOCK_FAILURE:
      return {
        ...state,
        isLoading: false
      }

    default:
      return state
  }
}
