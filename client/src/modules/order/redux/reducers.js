import { orderConstants } from "./constants";

const initialState = {
  list: [],
  totalList: 0,
  totalPages: 0,
  limit: 0,
  prevPage: 0,
  newxtPage: 0,
  error: null,
  hasPrevPage: false,
  hasNextPage: false,
  isLoading: false,
};

export function order(state = initialState, action) {
  switch (action.type) {
    //request
    case orderConstants.GET_ALL_ORDER_REQUEST:
    case orderConstants.CREATE_ORDER_REQUEST:
    case orderConstants.UPDATE_ORDER_REQUEST:
    case orderConstants.DELETE_ORDER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    //fail
    case orderConstants.GET_ALL_ORDER_FAILURE:
    case orderConstants.CREATE_ORDER_FAILURE:
    case orderConstants.UPDATE_ORDER_REQUEST:
    case orderConstants.DELETE_ORDER_FAILURE:
      return {
        ...state,
        error: action.error,
      };

    //success
    case orderConstants.GET_ALL_ORDER_SUCCESS:
      return {
        ...state,
        list: action.payload,
        isLoading: false,
      };

    case orderConstants.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload.order],
        isLoading: false,
      };

    case orderConstants.UPDATE_ORDER_SUCCESS:
      state.list.data = state.list.data.map((item) =>
        item._id === action.payload.data._id ? action.payload : item
      );
      return {
        ...state,
        list: state.list,
      };

    case orderConstants.DELETE_ORDER_SUCCESS:
      state.list.data = state.list.data.map(
        (item) => item._id !== action.payload.data._id
      );
      return {
        ...state,
        list: state.list,
      };
    //default

    default:
      return state;
  }
}
