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
export { getAllSchedule, getAllStocksWithLatlng }