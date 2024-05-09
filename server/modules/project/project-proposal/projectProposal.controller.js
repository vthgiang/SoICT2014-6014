const ProjectProposalService = require('./projectProposal.service')
const Logger = require('../../../logs');

exports.proposalForProject = async (req, res) => {
  try {
    const projectId = req.params.id

    let tp = await ProjectProposalService.proposalForProject(req.portal, projectId, req.body)
    await Logger.info(req.user.email, 'proposal_project_success', req.portal)
    
    res.status(200).json({
      success: true,
      messages: ['proposal_project_success'],
      content: tp
    });
  } catch (error) {
    if (error[0] === 'project_not_found') {
      await Logger.error(req.user.email, 'project_not_found', req.portal)
      res.status(404).json({
        success: false,
        messages: ['project_not_found'],
        content: null
      })
    } else {
      await Logger.error(req.user.email, error[0], req.portal)
      res.status(400).json({
        success: false,
        messages: Array.isArray(error) ? error : ['proposal_project_fail'],
        content: null
      })
    }
  }
}