const express = require("express");
const router = express.Router();
const ServiceController = require('./service.controller');
const { auth } = require('../../../middleware');

router.get("/services", auth, ServiceController.getServices);
router.post("/services", auth, ServiceController.createService);
router.get("/services/:id", auth, ServiceController.getService);
router.patch('/services/send-email-reset-password', auth, ServiceController.sendEmailResetPasswordService);
router.patch("/services/:id", auth, ServiceController.editService);
router.delete("/services/:id", auth, ServiceController.deleteService);
router.post('/services/import', auth, ServiceController.importServices);

module.exports = router;
