import { sendRequest } from '../../../../helpers/requestHelper'

// =============GET=================

/**
 * Lấy danh sách capacities
 * @data : Dữ liệu key, name tìm kiếm
 */
function getListCapacity(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/capacities`,
      method: 'GET',
      params: {
        name: data?.name,
        key: data?.key,
        limit: data?.limit,
        page: data?.page
      }
    },
    false,
    true,
    'human_resource.capacity'
  )
}
// =============CREATE=================

/**
 * Thêm mới năng lực
 * @data : Dữ liệu
 */
function addNewCapacity(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/capacities`,
      method: 'POST',
      data
    },
    true,
    true,
    'human_resource.capacity'
  )
}

//= ============EDIT===============

/**
 * Chỉnh sửa bộ năng lực
 * @data : Dữ liệu
 */
function editCapacity(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/capacities/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'human_resource.capacity'
  )
}


// =============DELETE===============

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteCapacity(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/capacities/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'human_resource.capacity'
  )
}


export const CapacityService = {
  getListCapacity,
  addNewCapacity,
  deleteCapacity,
  editCapacity
}
