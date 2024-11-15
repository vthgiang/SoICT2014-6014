import { sendRequest } from '../../../../../../../helpers/requestHelper'

const getConfigSettingData = () => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/config-setting`,
      method: 'GET'
    },
    false,
    false,
    'kpi'
  )
}

const updateConfigSettingData = (_id, payload) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/config-setting/${_id}`,
      method: 'PATCH',
      data: payload
    },
    true,
    true,
    'kpi'
  )
}

const startAllocation = (payload) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/start`,
      method: 'POST',
      data: payload
    },
    true,
    true,
    'kpi'
  )
}

const startAssignAllocation = (payload) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/assign-allocation`,
      method: 'POST',
      data: payload
    },
    true,
    true,
    'kpi'
  )
}

export const ConfigParametersServices = {
  getConfigSettingData,
  updateConfigSettingData,
  startAllocation,
  startAssignAllocation
}
