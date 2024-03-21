import { sendRequest } from '../../../../helpers/requestHelper'

export const CrmUnitKPIServices = {
  getCrmUnitKPI,
  editCrmUnitKPI
}

function getCrmUnitKPI(params) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/crm/crmUnitKPI`,
      method: 'GET',
      params
    },
    false,
    true,
    'crm.crmUnitKPI'
  )
}

function editCrmUnitKPI(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/crm/crmUnitKPI/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'crm.crmUnitKPI'
  )
}
