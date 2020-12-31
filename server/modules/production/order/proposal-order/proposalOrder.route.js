const express = require('express');
const router = express.Router();
const ProposalOrderController = require('./proposalOrder.controller');
const { auth } = require(`../../../../middleware`);

module.exports = router;