import { sendRequest } from '../../../../../helpers/requestHelper'

export const kpiMemberServices = {
  getEmployeeKPISets,
  getKpisByMonth,
  getKpisByKpiSetId,
  approveAllKpis,
  editKpi,
  editStatusKpi,
  getTaskById,
  getTaskByListKpis,
  setPointKPI,
  setPointAllKPI
}
/**
 *  Lấy tất cả kpi cá nhân của các cá nhân trong đơn vị
 */
function getEmployeeKPISets(infosearch) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets`,
      method: 'GET',
      params: {
        roleId: infosearch?.role,
        user: infosearch?.user,
        status: infosearch?.status,
        startDate: infosearch?.startDate,
        endDate: infosearch?.endDate,
        approver: infosearch?.approver,
        organizationalUnit: infosearch?.organizationalUnit,
        perPage: infosearch?.perPage,
        page: infosearch?.page
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}
/**
 * Lấy KPI cá nhân của nhân vien theo id của kpi
 */
function getKpisByKpiSetId(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets/${id}`,
      method: 'GET'
    },
    false,
    true,
    'kpi.evaluation'
  )
}
/**
 *  Lấy KPI cá nhân của nhân vien theo tháng
 */
function getKpisByMonth(userId, date) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets`,
      method: 'GET',
      params: {
        userId,
        date
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}
/**
 * Phê duyệt kpi cá nhân
 */
function approveAllKpis(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets/${id}`,
      method: 'PATCH'
    },
    true,
    true,
    'kpi.evaluation'
  )
}
/**
 *  Chỉnh sửa mục tiêu KPI cá nhân
 */
function editKpi(id, newTarget) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets/${id}`,
      method: 'PATCH',
      data: newTarget
    },
    true,
    true,
    'kpi.evaluation'
  )
}
/**
 *  chỉnh sửa trạng thái của kpi cá nhân
 */
function editStatusKpi(id, status) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpis/${id}`,
      method: 'PATCH',
      params: {
        status
      }
    },
    true,
    true,
    'kpi.evaluation'
  )
}
/**
 *  Lấy danh sách công việc theo id của kpi con
 */
function getTaskById(id, employeeId, date, kpiType) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpis/${id}/tasks`,
      method: 'GET',
      params: {
        id,
        employeeId,
        date,
        kpiType
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}
/**
 *  Lấy danh sách công việc theo list kpi con
 */
function getTaskByListKpis(listkpis) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpi-sets`,
      method: 'GET',
      params: {
        listkpis
      }
    },
    false,
    true,
    'kpi.evaluation'
  )
}
/**
 *  chỉnh sửa approvepoint
 */
function setPointKPI(employeeId, kpiType, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpis/${employeeId}/set-task-importance-level`,
      method: 'POST',
      data,
      params: {
        employeeId,
        kpiType
      }
    },
    true,
    true,
    'kpi.evaluation'
  )
}

function setPointAllKPI(employeeId, idKpiSet, date, kpis) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/evaluation/employee-evaluation/employee-kpis/${employeeId}/set-point-all-kpi`,
      method: 'POST',
      data: {
        kpis,
        date
      },
      params: {
        id: idKpiSet
      }
    },
    true,
    true,
    'kpi.evaluation'
  )
}
