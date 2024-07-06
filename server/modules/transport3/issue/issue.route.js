const express = require('express');
const router = express.Router();
const {auth} = require(`../../../middleware`);
const IssueController = require('./issue.controller');

router.get('/issues', auth, IssueController.getIssues);
router.post('/issue', auth, IssueController.createIssue);
router.get('/issues/me', auth, IssueController.getMyIssues);

module.exports = router;
