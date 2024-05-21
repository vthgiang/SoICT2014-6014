import { sendRequest } from '@helpers/requestHelper'

const getAllSchedule = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.schedule'
  )
}

const getNearestDepot = (lat, lng) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule/nearest-depot`,
      method: 'GET',
      params: { lat, lng }
    },
    false,
    true,
    'transport3.schedule'
  )
}

export { getAllSchedule, getNearestDepot }
