const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const CareController = require('./care.controller');

router.get('/', auth, CareController.getCares);
router.get('/:id', auth, CareController.getCareById);
router.post('/', auth, CareController.createCare);
router.patch('/:id', auth, CareController.editCare);
router.delete('/:id', auth, CareController.deleteCare);

module.exports = router;
