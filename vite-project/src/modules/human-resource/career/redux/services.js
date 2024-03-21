import { sendRequest } from '../../../../helpers/requestHelper'

export const CareerService = {
  getListCareerPosition,
  createCareerPosition,
  editCareerPosition,
  deleteCareerPosition
}

// =============GET=================

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm
 */
function getListCareerPosition(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/career-positions/career-positions`,
      method: 'GET',
      params: {
        name: data.name,
        page: data.page,
        limit: data.limit
      }
    },
    false,
    true,
    'human_resource.career-position'
  )
}
// =============CREATE=================

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu
 */
function createCareerPosition(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/career-positions/career-positions`,
      method: 'POST',
      data
    },
    true,
    true,
    'human_resource.career-position'
  )
}

//= ============EDIT===============

/**
 * Chỉnh sửa vị trí cv
 * @data : Dữ liệu
 */
function editCareerPosition(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/career-positions/career-positions/${data.careerPositionId}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'human_resource.career-position'
  )
}

// =============DELETE===============

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteCareerField(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/career-positions/career-fields`,
      method: 'DELETE',
      data
    },
    true,
    true,
    'human_resource.career-position'
  )
}

/**
 * Xóa lĩnh vực cv
 * @data : Dữ liệu xóa
 */
function deleteCareerPosition(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/career-positions/career-positions/${data}`,
      method: 'DELETE',
      data
    },
    true,
    true,
    'human_resource.career-position'
  )
}
