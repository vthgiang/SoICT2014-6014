import { sendRequest } from '@helpers/requestHelper'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import { StockServices } from '@modules/production/warehouse/stock-management/redux/services'

const provider = new OpenStreetMapProvider({
  params: {
    countrycodes: 'vn',
    addressdetails: 1
  }
})

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

const getScheduleById = (scheduleId, query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule/${scheduleId}`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.schedule'
  )
}

const getAllStocksWithLatlng = async () => {
  const res = await StockServices.getAllStocks()
  // eslint-disable-next-line no-restricted-syntax
  for (const stock of res.data.content) {
    // eslint-disable-next-line no-await-in-loop
    const stockLocation = await provider.search({ query: stock.address })
    stock.lat = stockLocation[0].y
    stock.lng = stockLocation[0].x
  }
  return res
}

const createSchedule = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule`,
      method: 'POST',
      data
    },
    true,
    true,
    'transport3.schedule'
  )
}

const predictOntimeDelivery = (scheduleId) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/predict/${scheduleId}`,
      method: 'PUT'
    },
    true,
    true,
    'transport3.schedule'
  )
}

const hyperparamaterTuning = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/hyperparamaterTuning`,
      method: 'POST',
      params: query
    },
    false,
    true,
    'transport3.schedule'
  )
}

const getHyperparamter = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/hyperparameter`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.schedule'
  )
}

const getDraftSchedule = () => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule/draft`,
      method: 'GET'
    },
    false,
    true,
    'transport3.schedule'
  )
}

const setScheduleFromDraft = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule/draft`,
      method: 'POST',
      data
    },
    true,
    true,
    'transport3.schedule'
  )
}

const deleteSchedule = (scheduleId) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/schedule/${scheduleId}`,
      method: 'DELETE'
    },
    true,
    true,
    'transport3.schedule'
  )
}

const getAll3rdPartySchedule = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/3rdschedule`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.schedule'
  )
}

const create3rdPartySchedule = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/3rdschedule`,
      method: 'POST',
      data
    },
    true,
    true,
    'transport3.schedule'
  )
}

export {
  getAllSchedule,
  getScheduleById,
  getAllStocksWithLatlng,
  createSchedule,
  predictOntimeDelivery,
  hyperparamaterTuning,
  getHyperparamter,
  getDraftSchedule,
  setScheduleFromDraft,
  deleteSchedule,
  getAll3rdPartySchedule,
  create3rdPartySchedule
}
