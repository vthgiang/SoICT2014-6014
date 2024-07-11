import { sendRequest } from '../../../../../helpers/requestHelper'

export const manufacturingMetricServices = {
  getAllManufacturingKpis,
  createManufacturingKpi,
  editManufacturingKpis,
  getManufacturingKpiById,
  editManufacturingKpi,


  getAllReportElements
}

function getAllManufacturingKpis(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-metric`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.metric.kpi'
  )
}

function createManufacturingKpi(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-metric`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.metric.kpi'
  )
}

function editManufacturingKpis(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-metric/bulk`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manufacturing.metric.kpis'
  )
}

function getManufacturingKpiById(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-metric/detail`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.metric.kpi'
  )
}

function editManufacturingKpi(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-metric/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manufacturing.metric.kpi'
  )
}

function getAllReportElements(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-metric/report-elements`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.metric.reportElement'
  )
}
