const express = require("express");
const router = express.Router();
const CustomerController = require('./customer.controller');
const { auth } = require('../../middleware');


// Customer group
router.get("/group", auth, CustomerController.getCustomerGroups);

// Customer liability
router.get("/liability", auth, CustomerController.getCustomerLiabilities);

// Get location
router.get('/location', CustomerController.getLocations);

// Customer
router.get("/", auth, CustomerController.getCustomers);

router.post("/", auth, CustomerController.createCustomer);
router.get("/:id", auth, CustomerController.getCustomer);
router.patch("/:id", auth, CustomerController.editCustomer);
router.delete("/:id", auth, CustomerController.deleteCustomer);

module.exports = router;
