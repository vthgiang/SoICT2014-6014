import { sendRequest } from '@helpers/requestHelper'

const getAllVehicleTransporting = async (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/vehicles/transporting`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.route'
  )
}

const getAllOrderTransporting = async (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule/transporting`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.route'
  )
}
export { getAllVehicleTransporting, getAllOrderTransporting }
