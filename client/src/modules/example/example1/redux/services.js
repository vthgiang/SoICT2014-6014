import { sendRequest } from '../../../../helpers/requestHelper'

export const exampleServices = {
  getExamples,
  deleteExamples,
  createExample,
  editExample
}

function getExamples(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/examples`,
      method: 'GET',
      params: {
        exampleName: queryData?.exampleName ? queryData.exampleName : '',
        page: queryData?.page ? queryData.page : null,
        perPage: queryData?.perPage ? queryData.perPage : null
      }
    },
    false,
    true,
    'manage_example'
  )
}

function deleteExamples(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/examples`,
      method: 'DELETE',
      data: {
        exampleIds: data?.exampleIds
      }
    },
    true,
    true,
    'manage_example'
  )
}

function createExample(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/examples`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'manage_example'
  )
}

function editExample(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/examples/${id}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'manage_example'
  )
}
