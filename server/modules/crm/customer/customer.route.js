const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`../../../middleware`);
const CustomerController = require('./customer.controller');

const data = [
    { name: 'avatar', path: '/crm/customer-avatar' },
    { name: 'fileAttachment', path: '/crm/customer-files' }
]

router.get('/', auth, CustomerController.getCustomers);

router.get('/:id', auth, CustomerController.getCustomerById);
router.get('/:id/point', auth, CustomerController.getCustomerPoint);

router.post('/', auth, uploadFile([{ name: 'file', path: '/crm/customer-files' }], 'array'), CustomerController.createCustomer);
router.post('/imports', auth, CustomerController.importCustomers);
router.patch('/:id', auth, uploadFile(data, 'fields'), CustomerController.editCustomer);
router.patch('/:id/point', auth, CustomerController.editCustomerPoint);
router.delete('/:id', auth, CustomerController.deleteCustomer);

module.exports = router;
