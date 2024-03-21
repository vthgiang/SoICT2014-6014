import { sendRequest } from '../../../../helpers/requestHelper'

export const CertificateService = {
  getListCertificate,
  createCertificate,
  editCertificate,
  deleteCertificate
}
/**
 * Lấy danh sách kỷ luật
 * @data : Dữ liệu key tìm kiếm
 */
function getListCertificate(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/certificates`,
      method: 'GET',
      params: {
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
      data: data
    },
    true,
    true,
    'human_resource.certificate'
  )
}

//=============EDIT===============

/**
 * Chỉnh sửa chuyên ngành
 * @data : Dữ liệu
 */
function editCertificate(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/certificates/${data.certificateId}`,
      method: 'PATCH',
      data: data
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
      data: data
    },
    true,
    true,
    'human_resource.certificate'
  )
}
