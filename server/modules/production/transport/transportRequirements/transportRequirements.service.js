const express = require('express');
const router = express.Router();
const TransportRequirementsController = require('./transportRequirements.controller');
const { auth } = require(`../../../../middleware`);

router.get('/', auth, TransportRequirementsController.getAll);
