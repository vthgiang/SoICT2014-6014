import { LinkConstants } from './constants'

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
  list: [],
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
  error: null,
  isLoading: false,
  item: null
}

export function link(state = initState, action) {
  var index = -1
  var indexPaginate = -1
  switch (action.type) {
    case LinkConstants.GET_LINKS_REQUEST:
    case LinkConstants.GET_LINKS_PAGINATE_REQUEST:
    case LinkConstants.SHOW_LINK_REQUEST:
    case LinkConstants.CREATE_LINK_REQUEST:
    case LinkConstants.EDIT_LINK_REQUEST:
    case LinkConstants.DELETE_LINK_REQUEST:
    case LinkConstants.CREATE_LINK_ATTRIBUTE_REQUEST:
      // case LinkConstants.IMPORT_LINK_PRIVILEGE_REQUEST:

      return {
        ...state,
        isLoading: true
      }
    case LinkConstants.CREATE_LINK_ATTRIBUTE_FAILE:
      return {
        ...state,
        isLoading: false
      }
    case LinkConstants.GET_LINKS_SUCCESS:
      return {
        ...state,
        list: action.payload,
        isLoading: false
      }

    case LinkConstants.GET_LINKS_PAGINATE_SUCCESS:
      return {
        ...state,
        listPaginate: action.payload.docs,
        totalDocs: action.payload.totalDocs,
        limit: action.payload.limit,
        totalPages: action.payload.totalPages,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        hasPrevPage: action.payload.hasPrevPage,
        hasNextPage: action.payload.hasNextPage,
        prevPage: action.payload.prevPage,
        nextPage: action.payload.nextPage,
        isLoading: false
      }

    case LinkConstants.SHOW_LINK_SUCCESS:
      return {
        ...state,
        item: action.payload,
        isLoading: false
      }

    case LinkConstants.CREATE_LINK_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
        listPaginate: [...state.listPaginate, action.payload],
        isLoading: false
      }

    case LinkConstants.EDIT_LINK_SUCCESS:
      console.log('Linkmoi: ', action.payload)
      index = findIndex(state.list, action.payload._id)
      indexPaginate = findIndex(state.listPaginate, action.payload._id)

      if (index !== -1) {
        state.list[index] = action.payload
      }

      if (indexPaginate !== -1) {
        state.listPaginate[indexPaginate] = action.payload
      }

      return {
        ...state,
        isLoading: false
      }

    case LinkConstants.DELETE_LINK_SUCCESS:
      index = findIndex(state.list, action.payload)
      indexPaginate = findIndex(state.listPaginate, action.payload)

      if (index !== -1) {
        state.list.splice(index, 1)
      }

      if (indexPaginate !== -1) {
        state.listPaginate.splice(indexPaginate, 1)
      }

      return {
        ...state,
        isLoading: false
      }

    case LinkConstants.CREATE_LINK_ATTRIBUTE_SUCCESS:
      console.log(action.payload)
      action.payload.forEach((x) => {
        index = findIndex(state.list, x._id)
        indexPaginate = findIndex(state.listPaginate, x._id)
        console.log(index)
        console.log(indexPaginate)
        if (index !== -1) {
          state.list[index] = x
        }

        if (indexPaginate !== -1) {
          state.listPaginate[indexPaginate] = x
        }
      })
      console.log('done')
      return {
        ...state,
        isLoading: false
      }

    // case LinkConstants.IMPORT_LINK_PRIVILEGE_SUCCESS:
    //     console.log("Linkmoi: ", action.payload)
    //     index = findIndex(state.list, action.payload._id);
    //     indexPaginate = findIndex(state.listPaginate, action.payload._id);

    //     if (index !== -1) {
    //         state.list[index] = action.payload;
    //     }

    //     if (indexPaginate !== -1) {
    //         state.listPaginate[indexPaginate] = action.payload;
    //     }

    //     return {
    //         ...state,
    //         isLoading: false
    //     };

    // case LinkConstants.IMPORT_LINK_PRIVILEGE_FAILE:
    //     return {
    //         ...state,
    //         error: action.error,
    //         isLoading: false,
    //     }

    case 'LOGOUT':
      return initState

    default:
      return state
  }
}
