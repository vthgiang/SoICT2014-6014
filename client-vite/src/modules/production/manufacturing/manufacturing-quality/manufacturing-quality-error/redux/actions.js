import { manufacturingQualityErrorConstants } from './constants'
import { manufacturingQualityErrorServices } from './services'

export const manufacturingQualityErrorActions = {
  getAllManufacturingQualityErrors,
  getDetailManufacturingQualityError
}

function getAllManufacturingQualityErrors(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingQualityErrorConstants.GET_ALL_MANUFACTURING_QUALITY_ERRORS_REQUEST
    })
    manufacturingQualityErrorServices
      .getAllManufacturingQualityErrors(query)
      .then((res) => {
        dispatch({
          type: manufacturingQualityErrorConstants.GET_ALL_MANUFACTURING_QUALITY_ERRORS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingQualityErrorConstants.GET_ALL_MANUFACTURING_QUALITY_ERRORS_FAILURE,
          error
        })
      })
  }
}

function getDetailManufacturingQualityError(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingQualityErrorConstants.GET_DETAIL_MANUFACTURING_QUALITY_ERROR_REQUEST
    })
    manufacturingQualityErrorServices
      .getDetailManufacturingQualityError(query)
      .then((res) => {
        dispatch({
          type: manufacturingQualityErrorConstants.GET_DETAIL_MANUFACTURING_QUALITY_ERROR_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingQualityErrorConstants.GET_DETAIL_MANUFACTURING_QUALITY_ERROR_FAILURE,
          error
        })
      })
  }
}

