import { sendRequest } from '../../../../../helpers/requestHelper'

export const managerKPIPerService = {
  getAllKpiSetsOrganizationalUnitByMonth,
  copyEmployeeKPI,
  getEmployeeKpiSetLogs
}

/**
 * get all kpi sets in organizational unit by month
 * @user : id người dùng
 * @department : id phòng ban
 * @date : ngày trong tháng muốn lấy kpi
 */
function getAllKpiSetsOrganizationalUnitByMonth(user, department, date) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets`,
      method: 'GET',
      params: {
        user,
        department,
        date,
        unitKpiSetByEmployeeKpiSetDate: true
      }
    },
    false,
    true,
    'kpi.employee.manager'
  )
}

/**
 * Tạo kpi tháng mới từ kpi tháng hiện tại
 * @param {*} id
 * @param {*} unitId
 * @param {*} dateOld
 * @param {*} dateNew
 */
function copyEmployeeKPI(id, unitId, dateNew) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/employee/management/employee-kpi-sets/${id}/copy`,
      method: 'POST',
      params: {
        unitId,
        dateNew
      }
    },
    true,
    true,
    'kpi.organizational_unit'
  )
}

/**
 * Lấy logs của 1 tập kpi cá nhân
 */
function getEmployeeKpiSetLogs(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/employee/management/employee-kpi-sets/${id}/logs`,
      method: 'GET'
    },
    false,
    false,
    'kpi.organizational_unit'
  )
}
