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

export const ProjectProposalServices = {
  proposalForProject
}