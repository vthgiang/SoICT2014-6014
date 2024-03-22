import { RecommendDistributeConstants } from './constants'
import { RecommendDistributeService } from './services'
import { AssetManagerActions } from '../../asset-information/redux/actions'

export const UseRequestActions = {
  createUsage,
  updateUsage,
  deleteUsage,
  recallAsset
}

function createUsage(id, data) {
  return async (dispatch) => {
    try {
      dispatch({
        type: RecommendDistributeConstants.CREATE_USAGE_REQUEST
      })
      const response = await RecommendDistributeService.createUsage(id, data)
      dispatch({
        type: RecommendDistributeConstants.CREATE_USAGE_SUCCESS,
        payload: response.data.content
      })
      return {
        response
      }
    } catch (err) {
      dispatch({
        type: RecommendDistributeConstants.CREATE_USAGE_FAILURE,
        error: err
      })
    }
  }
}

function updateUsage(id, data) {
  return (dispatch) => {
    dispatch({
      type: RecommendDistributeConstants.UPDATE_USAGE_REQUEST
    })

    RecommendDistributeService.updateUsage(id, data)
      .then((res) => {
        dispatch(
          AssetManagerActions.getAllAsset({
            code: '',
            assetName: '',
            assetType: null,
            month: null,
            status: '',
            page: 0,
            limit: 5
          })
        )
        dispatch({
          type: RecommendDistributeConstants.UPDATE_USAGE_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((err) => {
        dispatch({
          type: RecommendDistributeConstants.UPDATE_USAGE_FAILURE,
          error: err
        })
      })
  }
}

function deleteUsage(assetId, usageId) {
  return async (dispatch) => {
    try {
      dispatch({
        type: RecommendDistributeConstants.DELETE_USAGE_REQUEST
      })
      const response = await RecommendDistributeService.deleteUsage(assetId, usageId)
      dispatch({
        type: RecommendDistributeConstants.DELETE_USAGE_SUCCESS,
        payload: response.data.content
      })
      return {
        response
      }
    } catch (err) {
      dispatch({
        type: RecommendDistributeConstants.DELETE_USAGE_FAILURE,
        error: err
      })
    }
  }
}

function recallAsset(id, data) {
  return (dispatch) => {
    dispatch({ type: RecommendDistributeConstants.RECALL_ASSET_REQUEST })
    RecommendDistributeService.recallAsset(id, data)
      .then((res) => {
        dispatch({
          type: RecommendDistributeConstants.RECALL_ASSET_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: RecommendDistributeConstants.RECALL_ASSET_FAILURE,
          payload: error
        })
      })
  }
}
