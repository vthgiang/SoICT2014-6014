import { sendRequest } from '../../../../helpers/requestHelper'

export const AnnualLeaveService = {
  searchAnnualLeaves,
  getAnnualLeave,
  createAnnualLeave,
  deleteAnnualLeave,
  updateAnnualLeave,
  importAnnualLeave,
  requestToChangeAnnuaLeave
}

/**
 * Lấy danh sách nghỉ phép
 * @data : Dữ liệu key tìm kiếm
 */
function searchAnnualLeaves(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/annualLeave/annualLeaves`,
      method: 'GET',
      params: {
        beforAndAfterOneWeek: data.beforAndAfterOneWeek,
        numberAnnulLeave: data.numberAnnulLeave,
        email: data.email,
        startDate: data.startDate,
        endDate: data.endDate,
        organizationalUnits: data.organizationalUnits,
        year: data.year,
        employeeNumber: data.employeeNumber,
        employeeName: data.employeeName,
        month: data.month,
        page: data.page,
        status: data.status,
        limit: data.limit
      }
    },
    false,
    true,
    'human_resource.annual_leave'
  )
}

function getAnnualLeave(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/annualLeave/annualLeaves/${id}`,
      method: 'GET'
    },
    false,
    true,
    'human_resource.annual_leave'
  )
}
/**
 * Tạo mới thông tin nghỉ phép
 * @data : Dữ liệu tạo mới thông tin nghỉ phép
 */
function createAnnualLeave(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/annualLeave/annualLeaves`,
      method: 'POST',
      data
    },
    true,
    true,
    'human_resource.annual_leave'
  )
}

/**
 * Xoá thông tin nghỉ phép
 * @id : Id nghỉ phép cần xoá
 */
function deleteAnnualLeave(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/annualLeave/annualLeaves/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'human_resource.annual_leave'
  )
}
/**
 * Cập nhật thông tin nghỉ phép
 * @id : Id nghỉ phép cần cập nhật
 * @data  : Dữ liệu cập nhật nghỉ phép
 */
function updateAnnualLeave(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/annualLeave/annualLeaves/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'human_resource.annual_leave'
  )
}

/**
 * Import dữ liệu nghỉ phép
 * @param {*} data : Array thông tin nghỉ phép
 */
function importAnnualLeave(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/annualLeave/annualLeaves/import`,
      method: 'POST',
      data
    },
    true,
    false,
    'human_resource.annual_leave'
  )
}

function requestToChangeAnnuaLeave(id, data) {
  console.log('id, data', id, data)
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/annualLeave/annualLeaves/${id}/request-to-change`,
      method: 'POST',
      data
    },
    true,
    false,
    'human_resource.annual_leave'
  )
}
