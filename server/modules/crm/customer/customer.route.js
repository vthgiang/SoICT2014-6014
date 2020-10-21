const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`${SERVER_MIDDLEWARE_DIR}`);



const CustomerController = require('./customer.controller');

router.get('/', auth, CustomerController.getCustomers);

router.get('/:id', auth, CustomerController.getCustomerById);
router.post('/', auth, uploadFile([{name: 'file', path: '/crm/customer-files'}], 'array'), CustomerController.createCustomer);
router.patch('/:id', auth, uploadFile([{name: 'avatar', path:'/crm/customer-avatar'}], 'single'), CustomerController.editCustomer);
router.delete('/:id', auth, CustomerController.deleteCustomer);

module.exports = router;
