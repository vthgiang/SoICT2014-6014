import { sendRequest } from '../../../../../../helpers/requestHelper'

export const manufacturingQualityCriteriaServices = {
  getAllManufacturingQualityCriterias,
  getDetailManufacturingQualityCriteria
}

function getAllManufacturingQualityCriterias(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/criteria`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.quality-criterias'
  )
}

function getDetailManufacturingQualityCriteria(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-quality/criteria/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.quality-error'
  )
}
