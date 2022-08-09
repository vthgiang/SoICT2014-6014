const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const KpiTemplateController = require("./template.controller");

router.get('/', auth, KpiTemplateController.getPaginatedKpiTemplates);
router.get('/:id', auth, KpiTemplateController.getKpiTemplate);

router.post('/', auth, KpiTemplateController.createKpiTemplate);

router.delete('/:id', auth, KpiTemplateController.deleteKpiTemplate);

router.patch('/:id', auth, KpiTemplateController.editKpiTemplate);



module.exports = router;
