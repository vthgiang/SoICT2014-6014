const express = require("express");
const router = express.Router();
const CrmCustomerController = require('./customer.controller');

router.post("/customer", CrmCustomerController.getCustomers);

router.get("/customer", CrmCustomerController.getCustomers);
router.get("/customer/:id", CrmCustomerController.getCustomer);
router.patch("/customer/:id", CrmCustomerController.editCustomer);
router.delete("/customer/:id", CrmCustomerController.deleteCustomer);

module.exports = router;
