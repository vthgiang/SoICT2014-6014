import { sendRequest } from '../../../../helpers/requestHelper'
import { getStorage } from '../../../../config'

function getDelegations(queryData, delegateType) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-receive`,
      method: 'GET',
      params: {
        userId,
        name: queryData?.name ? queryData.name : '',
        page: queryData?.page ? queryData.page : null,
        perPage: queryData?.perPage ? queryData.perPage : null,
        delegateType: delegateType ? delegateType : queryData.delegateType
      }
    },
    false,
    true,
    'manage_delegation'
  )
}

function rejectDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-reject`,
      method: 'PATCH',
      data: {
        delegationId: data?.delegationId,
        reason: data?.reason
      },
      params: {
        delegateType: data.delegateType
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function confirmDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-confirm`,
      method: 'PATCH',
      data: {
        delegationId: data?.delegationId
      },
      params: {
        delegateType: data.delegateType
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

export const delegationServices = {
  getDelegations,
  rejectDelegation,
  confirmDelegation
}
