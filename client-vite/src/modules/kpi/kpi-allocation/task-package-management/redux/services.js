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

export const TaskPackageManagementService = {
  getTaskPackagesData
}
