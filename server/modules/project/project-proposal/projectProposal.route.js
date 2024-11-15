const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware')

const ProjectProposalController = require('./projectProposal.controller')

// router.get('/project-proposal/', auth, () => {
//   console.log("test API")
//   // return
// })
router.patch('/project-proposal/:id', auth, ProjectProposalController.proposalForProject)
router.patch('/project-proposal/assign/:id', auth, ProjectProposalController.assignForProjectFromProposal)

module.exports = router
