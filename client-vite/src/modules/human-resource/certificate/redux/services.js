import { sendRequest } from '../../../../helpers/requestHelper'

/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm
 */
function getListCertificate(data = undefined) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/certificates`,
      method: 'GET',
      params: data !== undefined && {
        name: data.name,
        page: data.page,
        limit: data.limit
      }
    },
    false,
    true,
    'human_resource.certificate'
  )
}

/**
 * Thêm mới chuyên ngành
 * @data : Dữ liệu kỷ luật cần thêm
 */
function createCertificate(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/certificates`,
      method: 'POST',
      data
    },
    true,
    true,
    'human_resource.certificate'
  )
}

//= ============EDIT===============

/**
 * Chỉnh sửa chuyên ngành
 * @data : Dữ liệu
 */
function editCertificate(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/certificates/${data.certificateId}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'human_resource.certificate'
  )
}

// =============DELETE===============

/**
 * Xóa chuyên ngành
 * @data : Dữ liệu xóa
 */
function deleteCertificate(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/certificates/${data}`,
      method: 'DELETE',
      data
    },
    true,
    true,
    'human_resource.certificate'
  )
}

export const CertificateService = {
  getListCertificate,
  createCertificate,
  editCertificate,
  deleteCertificate
}
