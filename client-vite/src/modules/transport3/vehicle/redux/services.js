import { sendRequest } from '@helpers/requestHelper'

const getAllVehicle = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/vehicles`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.vehicle'
  )
}

export { getAllVehicle }
