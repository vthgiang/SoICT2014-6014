const express = require("express");
const router = express.Router();
const CrmCustomerController = require('./customer.controller');
const { auth } = require('../../../middleware');

router.post("/customer", auth, CrmCustomerController.getCustomers);

router.get("/customer", auth, CrmCustomerController.getCustomers);
router.get("/customer/:id", auth, CrmCustomerController.getCustomer);
router.patch("/customer/:id", auth, CrmCustomerController.editCustomer);
router.delete("/customer/:id", auth, CrmCustomerController.deleteCustomer);

module.exports = router;
