import { RoutePickingConstants } from './constants'


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
};

export function routes(state = initState, action) {
  switch (action.type) {
    case RoutePickingConstants.GET_ALL_ROUTES_REQUEST:
    case RoutePickingConstants.CREATE_ROUTE_REQUEST:
    case RoutePickingConstants.GET_DETAIL_ROUTE_REQUEST:
      return {
        ...state,
        isLoading: false
      };

    case RoutePickingConstants.CREATE_ROUTE_SUCCESS:
      return {
        ...state,
        listChemins: [...state.listChemins, action.payload], // cập nhật danh sách mới
        isLoading: false
      };

    case RoutePickingConstants.GET_ALL_ROUTES_SUCCESS:
      return {
        ...state,
        listChemins: action.payload,
        isLoading: false
      };

    case RoutePickingConstants.GET_DETAIL_ROUTE_SUCCESS:
      return {
        ...state,
        routeDetail: action.payload,
        isLoading: false
      };

    case RoutePickingConstants.GET_ALL_ROUTES_FAILURE:
    case RoutePickingConstants.GET_DETAIL_ROUTE_FAILURE:
    case RoutePickingConstants.CREATE_ROUTE_FAILURE:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
}
