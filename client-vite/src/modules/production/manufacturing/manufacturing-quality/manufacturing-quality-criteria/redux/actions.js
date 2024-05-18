import { manufacturingQualityCriteriaConstants } from './constants'
import { manufacturingQualityCriteriaServices } from './services'

export const manufacturingQualityCriteriaActions = {
  getAllManufacturingQualityCriterias,
  getDetailManufacturingQualityCriteria
}

function getAllManufacturingQualityCriterias(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingQualityCriteriaConstants.GET_ALL_MANUFACTURING_QUALITY_CRITERIAS_REQUEST
    })
    manufacturingQualityCriteriaServices
      .getAllManufacturingQualityCriterias(query)
      .then((res) => {
        dispatch({
          type: manufacturingQualityCriteriaConstants.GET_ALL_MANUFACTURING_QUALITY_CRITERIAS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingQualityCriteriaConstants.GET_ALL_MANUFACTURING_QUALITY_CRITERIAS_FAILURE,
          error
        })
      })
  }
}

function getDetailManufacturingQualityCriteria(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingQualityCriteriaConstants.GET_DETAIL_MANUFACTURING_QUALITY_CRITERIA_REQUEST
    })
    manufacturingQualityCriteriaServices
      .getDetailManufacturingQualityCriteria(query)
      .then((res) => {
        dispatch({
          type: manufacturingQualityCriteriaConstants.GET_DETAIL_MANUFACTURING_QUALITY_CRITERIA_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingQualityCriteriaConstants.GET_DETAIL_MANUFACTURING_QUALITY_CRITERIA_FAILURE,
          error
        })
      })
  }
}

