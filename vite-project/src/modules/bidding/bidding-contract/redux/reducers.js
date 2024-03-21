import { BiddingContractConstant } from './constants'

const initState = {
  isLoading: false,
  totalList: 0,
  listBiddingContract: [],
  listBiddingContractStatistic: [],
  error: ''
}

export function biddingContract(state = initState, action) {
  switch (action.type) {
    case BiddingContractConstant.GET_BIDDING_CONTRACT_REQUEST:
    case BiddingContractConstant.CREATE_BIDDING_CONTRACT_REQUEST:
    case BiddingContractConstant.DELETE_BIDDING_CONTRACT_REQUEST:
    case BiddingContractConstant.UPDATE_BIDDING_CONTRACT_REQUEST:
    case BiddingContractConstant.CREATE_PROJECT_BY_BIDDING_CONTRACT_REQUEST:
      return {
        ...state,
        isLoading: true
      }
    case BiddingContractConstant.GET_BIDDING_CONTRACT_SUCCESS:
      if (!action.callId) {
        return {
          ...state,
          isLoading: false,
          listBiddingContract: action.payload.listBiddingContract !== undefined ? action.payload.listBiddingContract : [],
          totalList: action.payload.totalList
        }
      } else if (action.callId === 'statistic') {
        return {
          ...state,
          listBiddingContractStatistic: action.payload.listBiddingContract ?? [],
          isLoading: false
        }
      }
    case BiddingContractConstant.CREATE_BIDDING_CONTRACT_SUCCESS:
      state.listBiddingContract = [action.payload, ...state.listBiddingContract]
      return {
        ...state,
        isLoading: false
      }
    case BiddingContractConstant.DELETE_BIDDING_CONTRACT_SUCCESS:
      return {
        ...state,
        isLoading: false
      }
    case BiddingContractConstant.CREATE_PROJECT_BY_BIDDING_CONTRACT_SUCCESS:
      state.listBiddingContract = state.listBiddingContract.map((x) => {
        if (String(x._id) === String(action.payload?.newContract?._id)) {
          return action.payload?.newContract
        }
        return x
      })
      return {
        ...state,
        isLoading: false,
        listBiddingContractStatistic: action.payload?.contracts?.listBiddingContract ? action.payload?.contracts?.listBiddingContract : []
        // totalList: action.payload?.contracts?.totalList,
      }
    case BiddingContractConstant.UPDATE_BIDDING_CONTRACT_SUCCESS:
      state.listBiddingContract = state.listBiddingContract.map((x) => {
        if (String(x._id) === String(action.payload?._id)) {
          return action.payload
        }
        return x
      })
      return {
        ...state,
        isLoading: false
      }
    case BiddingContractConstant.GET_BIDDING_CONTRACT_FAILURE:
    case BiddingContractConstant.CREATE_BIDDING_CONTRACT_FAILURE:
    case BiddingContractConstant.DELETE_BIDDING_CONTRACT_FAILURE:
    case BiddingContractConstant.UPDATE_BIDDING_CONTRACT_FAILURE:
    case BiddingContractConstant.CREATE_PROJECT_BY_BIDDING_CONTRACT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      }
    default:
      return state
  }
}
