import { sendRequest } from '../../../../helpers/requestHelper'

export const CrmUnitServices = {
  getCrmUnits,
  createCrmUnit,
  deleteCrmUnit
}

function getCrmUnits(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/crm/crmUnits`,
      method: 'GET',
      params
    },
    false,
    true,
    'crm.crmUnit'
  )
}

function createCrmUnit(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/crm/crmUnits`,
      method: 'POST',
      data
    },
    true,
    true,
    'crm.crmUnit'
  )
}

function deleteCrmUnit(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/crm/crmUnits/${id}`,
      method: 'DELETE'
    },
    false,
    true,
    'crm.crmUnit'
  )
}
