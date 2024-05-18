import { sendRequest } from '../../../../../../helpers/requestHelper'

export const manufacturingQualityErrorServices = {
  getAllManufacturingQualityErrors,
  getDetailManufacturingQualityError,
}

function getAllManufacturingQualityErrors(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/error`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.quality-errors'
  )
}


function getDetailManufacturingQualityError(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/error/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.quality-error'
  )
}
