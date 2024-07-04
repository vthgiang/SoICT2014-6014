import { sendRequest } from '@helpers/requestHelper.jsx'

export const RoutePickingServices = {
  getAllChemins,
  getChemin,
  createRoutePicking
  // deleteExamples,
  // createExample,
  // editExample
}

function getAllChemins(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/route-picking/`,
      method: 'GET',
      params: queryData
    },
    false,
    true,
    'manage_warehouse.route_picking_management'
  )
}

function getChemin(id) {
  // console.log(id)
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/route-picking/chemin-detail/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manage_warehouse.route_picking_management'
  )
}

function createRoutePicking(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/route-picking/simulate_wave`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_warehouse.simulate_wave'
  )
}

// function editExample(id, data) {
//   return sendRequest(
//     {
//       url: `${process.env.REACT_APP_SERVER}/examples/${id}`,
//       method: 'PATCH',
//       data
//     },
//     true,
//     true,
//     'manage_example'
//   )
// }
