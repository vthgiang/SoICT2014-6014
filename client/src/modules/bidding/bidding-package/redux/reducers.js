import { BiddingPackageConstant } from './constants'

const initState = {
  isLoading: false,
  totalList: 0,
  error: ''
}

export function biddingPackageInfo(state = initState, action) {
  switch (action.type) {
    case BiddingPackageConstant.GET_DOCUMENT_REQUEST:
    case BiddingPackageConstant.GET_DOCUMENT_SUCCESS:
    case BiddingPackageConstant.GET_DOCUMENT_FAILURE:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state
  }
}
