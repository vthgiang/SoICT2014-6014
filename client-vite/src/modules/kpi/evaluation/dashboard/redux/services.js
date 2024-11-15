import { getStorage } from '../../../../../config'
import { sendRequest } from '../../../../../helpers/requestHelper'

export const dashboardEmployeeKpiService = {
  getAllEmployeeKpiSetOfUnitByRole,
  getAllEmployeeKpiSetOfUnitByIds,
  getChildrenOfOrganizationalUnitsAsTree,
  getEmployeeKpiPerformance,
  balanceEmployeeKpiSetAuto,
  createEmployeeKpiSetAuto
}

/**
 * Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị theo role
 * @param {*} role
 */
function getAllEmployeeKpiSetOfUnitByRole(role) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets`,
      method: 'GET',
      params: {
        roleId: role
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}

/**
 *  Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị theo mảng id đơn vị
 * @param {*} ids
 */
function getAllEmployeeKpiSetOfUnitByIds(ids) {
  const role = getStorage('currentRole')
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/dashboard/employee-kpis`,
      method: 'GET',
      params: {
        role,
        ids
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}

/**
 * Lấy các đơn vị con của một đơn vị và đơn vị đó
 * @param {*} role
 */
function getChildrenOfOrganizationalUnitsAsTree(role) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/organizational-unit/dashboard/organizational-units/get-children-of-organizational-unit-as-tree`,
      method: 'GET',
      params: {
        role
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}

/**
 * lay diem danh gia nhan vien
 * @param {*} role
 */
function getEmployeeKpiPerformance(ids) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/get-employee-kpi-performance`,
      method: 'GET',
      params: {
        ids
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}

/** Khởi tạo KPI cá nhân tu dong */
function createEmployeeKpiSetAuto(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpi-sets-auto`,
      method: 'POST',
      data
    },
    true,
    true,
    'kpi.employee.employee_kpi_set.messages_from_server'
  )
}

/** Can bang kpi nhan vien */
function balanceEmployeeKpiSetAuto(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/employee/creation/employee-kpis-balance`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'kpi.employee.employee_kpi_set.messages_from_server'
  )
}
