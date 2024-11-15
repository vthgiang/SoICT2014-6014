import { sendRequest } from '../../../../helpers/requestHelper'

export const FieldsService = {
  getListFields,
  createFields,
  deleteFields,
  updateFields
}

/**
 * Lấy danh sách thông tin lĩnh vực/ngành nghề
 */
function getListFields(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/field/fields`,
      method: 'GET',
      params: {
        name: data ? data.name : data,
        limit: data ? data.limit : data,
        page: data ? data.page : data
      }
    },
    false,
    true,
    'human_resource.field'
  )
}

/**
 * Thêm mới thông tin lĩnh vực/ngành nghề
 * @param {*} data : dữ liệu thông tin lĩnh vực/ngành nghề
 */
function createFields(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/field/fields`,
      method: 'POST',
      data
    },
    true,
    true,
    'human_resource.field'
  )
}

/**
 * Xoá thông tin lĩnh vực/ngành nghề
 * @param {*} id :id thông tin lĩnh vực/ngành nghề
 */
function deleteFields(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/field/fields/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'human_resource.field'
  )
}

/**
 * Chỉnh sửa thông tin lĩnh vực/ngành nghề
 * @param {*} id : id thông tin lĩnh vực/ngành nghề
 * @param {*} data : dữ liệu chỉnh sửa thông tin lĩnh vực/ngành nghề
 */
function updateFields(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/field/fields/${id}`,
      method: 'PUT',
      data
    },
    true,
    true,
    'human_resource.field'
  )
}
