import { sendRequest } from '../../../../helpers/requestHelper'
import { getStorage } from '../../../../config'

function getDelegations(queryData, delegateType) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'GET',
      params: {
        userId,
        name: queryData?.name ? queryData.name : '',
        page: queryData?.page ? queryData.page : null,
        perPage: queryData?.perPage ? queryData.perPage : null,
        delegateType
      }
    },
    false,
    true,
    'manage_delegation'
  )
}

function deleteDelegations(data, delegateType) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'DELETE',
      data: {
        delegationIds: data?.delegationIds
      },
      params: {
        delegateType
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function revokeDelegation(data, delegateType) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'PATCH',
      data: {
        delegationIds: data?.delegationIds,
        reason: data?.reason
      },
      params: {
        delegateType
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function createDelegation(data, delegateType) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'POST',
      data,
      params: {
        delegateType
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function editDelegation(id, data, delegateType) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations/${id}`,
      method: 'PATCH',
      data,
      params: {
        delegateType
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

export const delegationServices = {
  getDelegations,
  deleteDelegations,
  createDelegation,
  editDelegation,
  revokeDelegation
}
