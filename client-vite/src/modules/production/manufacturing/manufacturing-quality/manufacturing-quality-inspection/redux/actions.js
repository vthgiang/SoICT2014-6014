import { manufacturingQualityInspectionConstants } from './constants'
import { manufacturingQualityInspectionServices } from './services'

export const manufacturingQualityInspectionActions = {
  getAllManufacturingQualityInspections,
  createManufacturingQualityInspection
}

function getAllManufacturingQualityInspections(query) {
  return (dispatch) => {
    dispatch({
      type: manufacturingQualityInspectionConstants.GET_ALL_MANUFACTURING_QUALITY_INSPECTIONS_REQUEST
    })
    manufacturingQualityInspectionServices
      .getAllManufacturingQualityInspections(query)
      .then((res) => {
        dispatch({
          type: manufacturingQualityInspectionConstants.GET_ALL_MANUFACTURING_QUALITY_INSPECTIONS_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingQualityInspectionConstants.GET_ALL_MANUFACTURING_QUALITY_INSPECTIONS_FAILURE,
          error
        })
      })
  }
}

function createManufacturingQualityInspection(data) {
  return (dispatch) => {
    dispatch({
      type: manufacturingQualityInspectionConstants.CREATE_MANFACTURING_QUALITY_INSPECTION_REQUEST
    })
    manufacturingQualityInspectionServices
      .createManufacturingQualityInspection(data)
      .then((res) => {
        dispatch({
          type: manufacturingQualityInspectionConstants.CREATE_MANUFACTURING_QUALITY_INSPECTION_SUCCESS,
          payload: res.data.content
        })
      })
      .catch((error) => {
        dispatch({
          type: manufacturingQualityInspectionConstants.CREATE_MANUFACTURING_QUALITY_INSPECTION_FAILURE,
          error
        })
      })
  }
}
