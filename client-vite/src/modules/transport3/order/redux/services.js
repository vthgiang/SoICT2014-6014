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
    'transport3.order'
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
    'transport3.order'
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
    'transport3.order'
  )
}

export { getAddressFromLatLng, createNewOrder, getAllOrder }
