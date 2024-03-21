import { getStorage } from '../../../../../config'
import { sendRequest } from '../../../../../helpers/requestHelper'

export const kpiTemplateService = {
  getKpiTemplates,
  getById,
  getAllKpiTemplateByRole,
  getAllKpiTemplateByUser,
  addNewKpiTemplate,
  editKpiTemplate,
  deleteKpiTemplateById,
  importKpiTemplate
}

/** get kpi template */
function getKpiTemplates(unit, keyword, number, limit) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template`,
      method: 'GET',
      params: {
        unit,
        keyword,
        number,
        limit
      }
    },
    false,
    true,
    'kpi.kpi_template'
  )
}

/** get a kpi template by id */
function getById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template/${id}`,
      method: 'GET'
    },
    false,
    true,
    'kpi.kpi_template'
  )
}

/** get all kpi template by Role */
function getAllKpiTemplateByRole(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template`,
      params: {
        roleId: id
      },
      method: 'GET'
    },
    false,
    true,
    'kpi.kpi_template'
  )
}

/** get all kpi template by User
 *   Để lấy tất cả kết quả: cho pageNumber=1, noResultsPerPage = 0
 */
function getAllKpiTemplateByUser(pageNumber, noResultsPerPage, arrayUnit, name) {
  const id = getStorage('userId')

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template`,
      method: 'GET',
      params: {
        userId: id,
        pageNumber,
        noResultsPerPage,
        arrayUnit,
        name
      }
    },
    false,
    true,
    'kpi.kpi_template'
  )
}

/** add new kpi template */
function addNewKpiTemplate(newKpiTemplate) {
  const id = getStorage('userId')
  newKpiTemplate = { ...newKpiTemplate, creator: id }

  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template`,
      method: 'POST',
      data: newKpiTemplate
    },
    true,
    true,
    'kpi.kpi_template'
  )
}

function editKpiTemplate(id, newKpiTemplate) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template/${id}`,
      method: 'PATCH',
      data: newKpiTemplate
    },
    true,
    true,
    'kpi.kpi_template'
  )
}

/** delete a kpi template */
function deleteKpiTemplateById(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template/${id}`,
      method: 'DELETE'
    },
    true,
    true,
    'kpi.kpi_template'
  )
}

/** import a kpi Kpi Template  */
function importKpiTemplate(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/template/import`,
      method: 'POST',
      data
    },
    true,
    true,
    'kpi.kpi_template'
  )
}
