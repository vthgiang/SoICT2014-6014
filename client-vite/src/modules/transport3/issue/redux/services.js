import { sendRequest } from '@helpers/requestHelper'

const getIssues = () => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/issues`,
      method: 'GET'
    },
    false,
    true,
    ''
  )
}

const addTo3rd = (data) => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/3rdschedule`,
      method: 'POST',
      data
    },
    true,
    true,
    ''
  )
}

export const IssueServices = {
  getIssues,
  addTo3rd
}
