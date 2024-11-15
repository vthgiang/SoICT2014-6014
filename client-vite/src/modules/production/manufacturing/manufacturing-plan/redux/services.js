import { sendRequest } from '../../../../../helpers/requestHelper'

export const manufacturingPlanServices = {
  getAllManufacturingPlans,
  getAllApproversOfPlan,
  createManufacturingPlan,
  getDetailManufacturingPlan,
  handleEditManufacturingPlan,
  getNumberPlans,
  getNumberPlansByStatus,
  createAutomaticSchedule
}

function getAllManufacturingPlans(query) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan`,
      method: 'GET',
      params: query
    },
    false,
    true,
    'manufacturing.plan'
  )
}

function getAllApproversOfPlan(currentRole) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/get-approvers-of-plan/${currentRole}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.plan'
  )
}

function createManufacturingPlan(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.plan'
  )
}

function getDetailManufacturingPlan(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/${id}`,
      method: 'GET'
    },
    false,
    true,
    'manufacturing.plan'
  )
}

function handleEditManufacturingPlan(data, id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'manufacturing.plan'
  )
}

function getNumberPlans(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/get-number-plans`,
      method: 'GET',
      params: data
    },
    false,
    true,
    'manufacturing.plan'
  )
}

function getNumberPlansByStatus(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/get-number-plans-by-status`,
      method: 'GET',
      params: data
    },
    false,
    true,
    'manufacturing.plan'
  )
}

function createAutomaticSchedule(data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/manufacturing-plan/automatic-schedule`,
      method: 'POST',
      data
    },
    true,
    true,
    'manufacturing.plan'
  )
}
