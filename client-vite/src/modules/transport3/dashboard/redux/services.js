import { sendRequest } from '@helpers/requestHelper'

const getOntimeDeliveryRate = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/ontimeRate`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.ontime'
  )
}

const getOnTimeDeliveryRatesPerMonth = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/ontimeRatePerMonth`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.ontime'
  )
}

const getEstimatedOnTimeDeliveryRatesPerMonth = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/estimatedOntimeRatePerMonth`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.ontime'
  )
}

const getDeliveryLateDayAveragePerMonth = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/deliveryLateDayAveragePerMonth`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.ontime'
  )
}

const getTopLateDeliveryDay = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/topLateDeliveryDay`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.ontime'
  )
}

const getTopLateProducts = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/topLateProducts`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.ontime'
  )
}

const getTopLateStocks = (query) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/topLateStocks`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'transport3.ontime'
  )
}

export const DashboardService = {
  getOntimeDeliveryRate,
  getOnTimeDeliveryRatesPerMonth,
  getEstimatedOnTimeDeliveryRatesPerMonth,
  getDeliveryLateDayAveragePerMonth,
  getTopLateDeliveryDay,
  getTopLateProducts,
  getTopLateStocks
}
