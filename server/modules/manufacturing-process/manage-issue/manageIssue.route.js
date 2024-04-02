const express = require('express');
const router = express.Router();

const { auth } = require(`../../../middleware`);
const ManagerIssueControlller = require('./manageIssue.controller')

router.get('/', auth, ManagerIssueControlller.getAllIssuesList)
router.get('/:id', auth, ManagerIssueControlller.getIssueReportedById)
router.post('/', auth, ManagerIssueControlller.createIssueReported)
router.patch('/:id', auth, ManagerIssueControlller.editIssueReported)
router.delete('/:id', auth, ManagerIssueControlller.deleteIssueReported)

module.exports = router;