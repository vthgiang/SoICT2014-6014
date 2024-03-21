import { sendRequest } from '../../../../helpers/requestHelper'

export const attributeServices = {
  getAttributes,
  deleteAttributes,
  createAttribute,
  editAttribute
}

function getAttributes(queryData) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/attribute/attributes`,
      method: 'GET',
      params: {
        attributeName: queryData?.attributeName ? queryData.attributeName : '',
        page: queryData?.page ? queryData.page : null,
        perPage: queryData?.perPage ? queryData.perPage : null
      }
    },
    false,
    true,
    'super_admin.attribute'
  )
}

function deleteAttributes(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/attribute/attributes`,
      method: 'DELETE',
      data: {
        attributeIds: data?.attributeIds
      }
    },
    true,
    true,
    'super_admin.attribute'
  )
}

function createAttribute(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/attribute/attributes`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'super_admin.attribute'
  )
}

function editAttribute(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/attribute/attributes/${id}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'super_admin.attribute'
  )
}
