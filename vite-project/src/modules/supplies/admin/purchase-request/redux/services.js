import { sendRequest } from '../../../../../helpers/requestHelper'

export const PurchaseRequestService = {
  searchPurchaseRequests,
  createPurchaseRequest,
  updatePurchaseRequest,
  deletePurchaseRequest,
  getUserApprover
}

function getUserApprover() {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/supplies-request/use-approver`,
      method: 'GET'
    },
    false,
    true,
    'supplies.purchase_request'
  )
}

// Lấy danh sách phiếu đề nghị mua sắm thiết bị
function searchPurchaseRequests(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/supplies-request/purchase-request`,
      method: 'GET',
      params: {
        recommendNumber: data.recommendNumber,
        proposalDate: data.proposalDate,
        proponent: data.proponent,
        approver: data.approver,
        status: data.status,
        page: data.page,
        limit: data.limit,
        month: data.month
      }
    },
    false,
    true,
    'supplies.purchase_request'
  )
}

// Tạo mới thông tin phiếu đề nghị mua sắm thiết bị
function createPurchaseRequest(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/supplies-request/purchase-request`,
      method: 'POST',
      data
    },
    true,
    true,
    'supplies.purchase_request'
  )
}

// Cập nhật thông tin phiếu đề nghị mua sắm thiết bị
function updatePurchaseRequest(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/supplies-request/purchase-request/${id}`,
      method: 'PUT',
      data
    },
    true,
    true,
    'supplies.purchase_request'
  )
}

// Xoá thông tin phiếu đề nghị mua sắm thiết bị
function deletePurchaseRequest(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/supplies-request/purchase-request/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'supplies.purchase_request'
  )
}
