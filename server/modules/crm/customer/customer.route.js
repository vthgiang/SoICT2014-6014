const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);

const CustomerController = require('./customer.controller');

router.get('/', auth, CustomerController.getCustomers);
router.get('/:id', auth, CustomerController.getCustomerById);
router.post('/', auth, CustomerController.createCustomer);
router.patch('/:id', auth, CustomerController.editCustomer);
router.delete('/:id', auth, CustomerController.deleteCustomer);

module.exports = router;
