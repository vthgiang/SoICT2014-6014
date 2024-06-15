const express = require('express');
const router = express.Router();
const {auth} = require(`../../../middleware`);
const IssueController = require('./issue.controller');

router.get('/issue', auth, IssueController.getIssues);
router.post('/issue', auth, IssueController.createIssue);

module.exports = router;
