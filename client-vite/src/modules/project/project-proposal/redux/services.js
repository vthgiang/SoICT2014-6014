import { sendRequest } from "../../../../helpers/requestHelper";

function proposalForProject(id, data) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/projects/project-proposal/${id}`,
      method: 'PATCH',
      data
    },
    true,
    true,
    'project'
  )
}

function assignProjectFromProposalData(id) {
  return sendRequest(
    {
      url: `${process.env.REACT_APP_SERVER}/projects/project-proposal/assign/${id}`,
      method: 'PATCH'
    },
    true,
    true,
    'project'
  )
}

export const ProjectProposalServices = {
  proposalForProject,
  assignProjectFromProposalData
}
