import { sendRequest } from '../../../../helpers/requestHelper'
import { getStorage } from '../../../../config'

function getDelegations(queryData) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'GET',
      params: {
        userId,
        delegationName: queryData?.delegationName ? queryData.delegationName : '',
        page: queryData?.page ? queryData.page : null,
        perPage: queryData?.perPage ? queryData.perPage : null,
        delegateType: queryData?.delegateType ? queryData.delegateType : null
      }
    },
    false,
    true,
    'manage_delegation'
  )
}

function deleteDelegations(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'DELETE',
      data: {
        delegationIds: data?.delegationIds
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function revokeDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'PATCH',
      data: {
        delegationIds: data?.delegationIds,
        reason: data?.reason
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function createDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_delegation'
  )
}

function editDelegation(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_delegation'
  )
}

function getDelegationsTask(queryData) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks`,
      method: 'GET',
      params: {
        userId,
        delegationName: queryData?.delegationName ? queryData.delegationName : '',
        page: queryData?.pageTask ? queryData.pageTask : null,
        perPage: queryData?.perPageTask ? queryData.perPageTask : null,
        delegateType: queryData?.delegateType ? queryData.delegateType : null
      }
    },
    false,
    true,
    'manage_delegation'
  )
}

function deleteTaskDelegations(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks`,
      method: 'DELETE',
      data: {
        delegationIds: data?.delegationIds
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function revokeTaskDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks`,
      method: 'PATCH',
      data: {
        delegationIds: data?.delegationIds,
        reason: data?.reason
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function createTaskDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_delegation'
  )
}

function editTaskDelegation(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-tasks/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manage_delegation'
  )
}

function getDelegationsService(queryData) {
  const userId = getStorage('userId')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-services`,
      method: 'GET',
      params: {
        userId,
        delegationName: queryData?.delegationName ? queryData.delegationName : '',
        page: queryData?.pageService ? queryData.pageService : null,
        perPage: queryData?.perPageService ? queryData.perPageService : null,
        delegateType: queryData?.delegateType ? queryData.delegateType : null
      }
    },
    false,
    true,
    'manage_delegation'
  )
}

function deleteServiceDelegations(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-services`,
      method: 'DELETE',
      data: {
        delegationIds: data?.delegationIds
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function revokeServiceDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-services`,
      method: 'PATCH',
      data: {
        delegationId: data?.delegationId,
        reason: data?.reason
      }
    },
    true,
    true,
    'manage_delegation'
  )
}

function createServiceDelegation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-services`,
      method: 'POST',
      data
    },
    true,
    true,
    'manage_delegation'
  )
}

function editServiceDelegation(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/delegation/delegations-services/${id}`,
      method: 'PATCH',
      data
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
  revokeDelegation,
  getDelegationsTask,
  deleteTaskDelegations,
  createTaskDelegation,
  editTaskDelegation,
  revokeTaskDelegation,
  getDelegationsService,
  deleteServiceDelegations,
  createServiceDelegation,
  editServiceDelegation,
  revokeServiceDelegation
}
