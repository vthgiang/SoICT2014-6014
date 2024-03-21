import { attributeConstants } from './constants'

var findIndex = (array, id) => {
  var result = -1
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index
    }
  })
  return result
}

const initialState = {
  lists: [],
  isLoading: false,
  error: null,
  totalList: 0
}

export function attribute(state = initialState, action) {
  let index = -1
  switch (action.type) {
    case attributeConstants.GET_ALL_ATTRIBUTES_REQUEST:
    case attributeConstants.DELETE_ATTRIBUTE_REQUEST:
    case attributeConstants.CREATE_ATTRIBUTE_REQUEST:
    case attributeConstants.EDIT_ATTRIBUTE_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case attributeConstants.GET_ALL_ATTRIBUTES_FAILURE:
    case attributeConstants.DELETE_ATTRIBUTE_FAILURE:
    case attributeConstants.CREATE_ATTRIBUTE_FAILURE:
    case attributeConstants.EDIT_ATTRIBUTE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    case attributeConstants.GET_ALL_ATTRIBUTES_SUCCESS:
      return {
        ...state,
        lists: action.payload.data,
        totalList: action.payload.totalList,
        isLoading: false
      }
    case attributeConstants.DELETE_ATTRIBUTE_SUCCESS:
      return {
        ...state,
        lists: state.lists.filter((attribute) => !action.attributeIds.includes(attribute?._id)),
        isLoading: false
      }
    case attributeConstants.CREATE_ATTRIBUTE_SUCCESS:
      return {
        ...state,
        lists: [...state.lists, action.payload],
        isLoading: false
      }
    case attributeConstants.EDIT_ATTRIBUTE_SUCCESS:
      index = findIndex(state.lists, action.payload._id)
      if (index !== -1) {
        state.lists[index] = action.payload
      }
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
