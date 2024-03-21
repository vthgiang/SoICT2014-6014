import { sendRequest } from '../../../../../helpers/requestHelper'

export const AllocationHistoryService = {
  searchAllocation,
  createAllocations,
  updateAllocation,
  deleteAllocations,
  getAllocationById
}

function searchAllocation(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/allocation-supplies/allocation`,
      method: 'GET',
      params: {
        supplies: data.codeInvoice,
        date: data.date,
        allocationToOrganizationalUnit: data.allocationToOrganizationalUnit,
        allocationToUser: data.allocationToUser,
        page: data.page,
        limit: data.limit
      }
    },
    false,
    true,
    'supplies.allocation_management'
  )
}

function createAllocations(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/allocation-supplies/allocation`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'supplies.allocation_management'
  )
}

function updateAllocation(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/allocation-supplies/allocation/${id}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'supplies.allocation_management'
  )
}

function deleteAllocations(ids) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/allocation-supplies/allocation`,
      method: 'DELETE',
      data: ids
    },
    true,
    true,
    'supplies.allocation_management'
  )
}

function getAllocationById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/allocation-supplies/allocation/${id}`,
      method: 'GET'
    },
    false,
    true,
    'supplies.allocation_management'
  )
}
