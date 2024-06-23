import { sendRequest } from '@helpers/requestHelper.jsx'

export const RoutePickingServices = {
  getAllChemins,
  getChemin
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
// function deleteExamples(data) {
//   return sendRequest(
//     {
//       url: `${process.env.REACT_APP_SERVER}/examples`,
//       method: 'DELETE',
//       data: {
//         exampleIds: data?.exampleIds
//       }
//     },
//     true,
//     true,
//     'manage_example'
//   )
// }

// function createExample(data) {
//   return sendRequest(
//     {
//       url: `${process.env.REACT_APP_SERVER}/examples`,
//       method: 'POST',
//       data
//     },
//     true,
//     true,
//     'manage_example'
//   )
// }

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
