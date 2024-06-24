import { sendRequest } from '@helpers/requestHelper'

const getIssues = () => {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/transport3/issues`,
      method: 'GET'
    },
    false,
    true,
    'transport3.issue'
  )
}

export const IssueServices = {
  getIssues
}
