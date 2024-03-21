import { sendRequest } from '../../../../helpers/requestHelper'

export const MajorService = {
  getListMajor,
  createMajor,
  editMajor,
  deleteMajor
}
/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm
 */
function getListMajor(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/majors/major`,
      method: 'GET',
      params: {
        name: data.name,
        page: data.page,
        limit: data.limit
      }
    },
    false,
    true,
    'human_resource.major'
  )
}

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu kỷ luật cần thêm
 */
function createMajor(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/majors/major`,
      method: 'POST',
      data: data
    },
    true,
    true,
    'human_resource.major'
  )
}

//=============EDIT===============

/**
 * Chỉnh sửa chuyên ngành
 * @data : Dữ liệu
 */
function editMajor(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/majors/major/${data.majorId}`,
      method: 'PATCH',
      data: data
    },
    true,
    true,
    'human_resource.major'
  )
}

// =============DELETE===============

/**
 * Xóa chuyên ngành
 * @data : Dữ liệu xóa
 */
function deleteMajor(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/majors/major/${data}`,
      method: 'DELETE',
      data: data
    },
    true,
    true,
    'human_resource.major'
  )
}
