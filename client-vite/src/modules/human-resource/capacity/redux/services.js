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
    'capacity.get_list'
  )
}
// =============CREATE=================

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu
 */

//= ============EDIT===============

/**
 * Chỉnh sửa vị trí cv
 * @data : Dữ liệu
 */


// =============DELETE===============

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */


export const CapacityService = {
  getListCapacity,
}
