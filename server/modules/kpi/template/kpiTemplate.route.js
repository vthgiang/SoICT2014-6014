const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const KpiTemplateController = require("./kpiTemplate.controller");

router.get('/', auth, KpiTemplateController.getAllKpiTemplates);
router.get('/:id', auth, KpiTemplateController.getKpiTemplate);

router.post('/', auth, KpiTemplateController.createKpiTemplate);

router.delete('/:id', auth, KpiTemplateController.deleteKpiTemplate);

router.patch('/:id', auth, KpiTemplateController.editKpiTemplate);

router.post('/import', auth, KpiTemplateController.importKpiTemplate);


module.exports = router;
