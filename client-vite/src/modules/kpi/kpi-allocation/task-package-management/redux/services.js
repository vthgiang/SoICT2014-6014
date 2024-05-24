import { sendRequest } from '../../../../../helpers/requestHelper'

const getTaskPackagesData = () => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/task-package`,
      method: 'GET'
    },
    false,
    false,
    'kpi'
  )
}

const getTaskTypeData = () => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/task-package/task-type`,
      method: 'GET'
    },
    false,
    false,
    'kpi'
  )
}

const addTaskTypeData = (payload) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/task-package/task-type`,
      method: 'POST',
      data: payload
    },
    true,
    true,
    'kpi'
  )
}

const addTaskData = (payload) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/kpi/allocation/task-package`,
      method: 'POST',
      data: payload
    },
    true,
    true,
    'kpi'
  )
}

export const TaskPackageManagementService = {
  getTaskPackagesData,
  getTaskTypeData,
  addTaskTypeData,
  addTaskData
}
