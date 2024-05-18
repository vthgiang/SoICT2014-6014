import { sendRequest } from '../../../../../../helpers/requestHelper'

export const manufacturingQualityInspectionServices = {
  getAllManufacturingQualityInspections,
  createManufacturingQualityInspection
}

function getAllManufacturingQualityInspections(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/inspection`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.quality-inspections'
  )
}

function createManufacturingQualityInspection(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/inspection`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.quality-inspections'
  )
}
