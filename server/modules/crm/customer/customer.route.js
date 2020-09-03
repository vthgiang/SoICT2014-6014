const express = require("express");
const router = express.Router();
const CrmCustomerController = require('./customer.controller');

router.post("/customer", CrmCustomerController.getCustomers);

router.get("/customer", CrmCustomerController.getCustomers);
router.get("/customer/:id", CrmCustomerController.getCustomers);
router.patch("/customer/:id", CrmCustomerController.getCustomers);
router.delete("/customer/:id", CrmCustomerController.getCustomers);

module.exports = router;
