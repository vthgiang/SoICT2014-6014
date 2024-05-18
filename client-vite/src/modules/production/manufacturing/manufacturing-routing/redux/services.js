import { sendRequest } from '../../../../../helpers/requestHelper'

export const manufacturingRoutingServices = {
    getAllManufacturingRoutings,
    getDetailManufacturingRouting,
    createManufacturingRouting,
    getAllManufacturingRoutingsByGood
}

function getAllManufacturingRoutings(query) {
    return sendRequest(
        {
          url: `${process.env.REACT_APP_SERVER}/manufacturing-routing`,
          method: 'GET',
          params: query
        },
        false,
        true,
        'manufacturing.routings'
      )
}

function getDetailManufacturingRouting(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-routing/${id}`,
      method: 'GET',
    },
    false,
    true,
    'manufacturing.routing'
  )
}

function createManufacturingRouting(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-routing`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.routing'
  )
}

function getAllManufacturingRoutingsByGood(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-routing/good/${id}`,
      method: 'GET',
    },
    false,
    true,
    'manufacturing.routing.good'
  )
}
