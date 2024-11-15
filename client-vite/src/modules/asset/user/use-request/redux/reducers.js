import { RecommendDistributeConstants } from './constants'
const initState = {
  isLoading: false,
  listRecommendDistributes: [],
  totalList: '',
  error: ''
}
export function recommendDistribute(state = initState, action) {
  switch (action.type) {
    case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_REQUEST:
    case RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_REQUEST:
    case RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_REQUEST:
    case RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_REQUEST:
      return {
        ...state,
        isLoading: true
      }

    case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRecommendDistributes: action.payload.listRecommendDistributes,
        totalList: action.payload.totalList
      }

    case RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRecommendDistributes: [...state.listRecommendDistributes, action.payload]
      }

    case RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRecommendDistributes: [action.payload, ...state.listRecommendDistributes.filter((item) => item._id !== action.payload._id)]
      }

    case RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRecommendDistributes: state.listRecommendDistributes.filter(
          (recommendDistribute) => recommendDistribute._id !== action.payload._id
        )
      }

    case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_BY_ASSET_SUCCESS:
      return {
        ...state,
        isLoading: false,
        listRecommendDistributesByAsset: action.payload
      }
    case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_BY_ASSET_FAILURE:
    case RecommendDistributeConstants.GET_RECOMMEND_DISTRIBUTE_FAILURE:
    case RecommendDistributeConstants.CREATE_RECOMMEND_DISTRIBUTE_FAILURE:
    case RecommendDistributeConstants.UPDATE_RECOMMEND_DISTRIBUTE_FAILURE:
    case RecommendDistributeConstants.DELETE_RECOMMEND_DISTRIBUTE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error.message
      }

    default:
      return state
  }
}
