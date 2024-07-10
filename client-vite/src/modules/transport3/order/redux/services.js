import { sendRequest } from '@helpers/requestHelper'

const getAddressFromLatLng = (lat, lng) => {
  return sendRequest(
    {
      url: `https://nominatim.openstreetmap.org/reverse`,
      method: 'GET',
      params: {
        format: 'json',
        lat,
        lon: lng,
        zoom: 13,
        addressdetails: 1
      }
    },
    false,
    false,
    ''
  )
}

const createNewOrder = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/create-order`,
      method: 'POST',
      data
    },
    true,
    true,
    ''
  )
}

const getAllOrder = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/orders`,
      method: 'GET',
      params: query
    },
    false,
    true,
    ''
  )
}

const retrainingModel = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/retrainingModel`,
      method: 'GET'
    },
    true,
    true,
    ''
  )
}

const approveOrder = (id) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/order/approve/${id}`,
      method: 'PUT'
    },
    true,
    true,
    ''
  )
}

const deleteOrder = (id) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/order/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    ''
  )
}
export { getAddressFromLatLng, createNewOrder, getAllOrder, retrainingModel, approveOrder, deleteOrder }
