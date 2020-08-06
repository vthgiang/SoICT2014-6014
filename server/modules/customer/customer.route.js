const express = require("express");
const router = express.Router();
const CustomerController = require('./customer.controller');
const { auth } = require('../../middleware');

router.get("/", auth, CustomerController.getCustomers);

// router.post("/", CustomerController.createCustomer);
// router.get("/:id", CustomerController.getCustomer);
// router.patch("/:id", CustomerController.editCustomer);
// router.delete("/:id", CustomerController.deleteCustomer);

router.get("/group", auth, CustomerController.getCustomerGroups);

router.get("/liability", auth, CustomerController.getCustomerLiabilities);

module.exports = router;
