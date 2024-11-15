import { sendRequest } from '../../../../helpers/requestHelper'

export const SalaryService = {
  searchSalary,
  createSalary,
  deleteSalary,
  updateSalary,
  importSalary,
  getAllSalaryChart
}

/**
 * Lấy danh sách bảng lương
 * @data dữ liệu key tìm kiếm
 */
function searchSalary(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/salary/salaries`,
      method: 'GET',
      params: {
        organizationalUnits: data.organizationalUnits,
        employeeName: data.employeeName,
        employeeNumber: data.employeeNumber,
        month: data.month,
        page: data.page,
        limit: data.limit
      }
    },
    false,
    true,
    'human_resource.salary'
  )
}

/**
 * Tạo mới một bảng lương
 * @data dữ liệu bảng lương mới
 */
function createSalary(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/salary/salaries`,
      method: 'POST',
      data
    },
    true,
    true,
    'human_resource.salary'
  )
}

/**
 * Xoá bảng lương  theo id
 * @id Id bảng lương cần xoá
 */
function deleteSalary(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/salary/salaries/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'human_resource.salary'
  )
}

/**
 * Cập nhật thông tin bảng lương
 * @id : Id bảng lương cần cập nhật
 * @data : Dữ liệu cập nhật bảng lương
 */
function updateSalary(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/salary/salaries/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'human_resource.salary'
  )
}

/**
 * Import dữ liệu bảng lương
 * @param {*} data : array thông tin bảng lương
 */
function importSalary(data) {
  console.log(data)
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/salary/salaries/import`,
      method: 'POST',
      data
    },
    true,
    false,
    'human_resource.salary'
  )
}

function getAllSalaryChart(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/salary/salaries-chart`,
      method: 'GET',
      params: {
        time: data
      }
    },
    false,
    true,
    'human_resource.salary'
  )
}
