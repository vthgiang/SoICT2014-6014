const express = require("express");
const router = express.Router();
const { auth, uploadFile } = require(`../../../middleware`);
const CustomerController = require('./customer.controller');

const data = [
    { name: 'avatar', path: '/crm/customer-avatar' },
    { name: 'fileAttachment', path: '/crm/customer-files' }
]

router.get('/', auth, CustomerController.getCustomers);

// router.get('/:id', auth, CustomerController.getCustomerById);
router.get('/:id/point', auth, CustomerController.getCustomerPoint);

router.post('/', auth, uploadFile([{ name: 'file', path: '/crm/customer-files' }], 'array'), CustomerController.createCustomer);
router.post('/imports', auth, CustomerController.importCustomers);
router.patch('/:id', auth, uploadFile(data, 'fields'), CustomerController.editCustomer);
router.patch('/:id/point', auth, CustomerController.editCustomerPoint);

router.post('/:id/promotion', auth, CustomerController.addPromotion);
router.patch('/:id/promotion', auth, CustomerController.editPromotion);
router.patch('/:id/promotion/use', auth, CustomerController.usePromotion);
router.get('/:id/promotions', auth, CustomerController.getCustomerPromotions);
router.delete('/:id/promotion', auth, CustomerController.deletePromotion);

router.post("/forecast", auth, CustomerController.createCustomerForecast);
router.get("/forecast-response/:idToPredict", auth, CustomerController.predictResponseCustomer);
router.get("/forecase-revenue", auth, CustomerController.predictRevenueCustomer)

router.delete('/:id', auth, CustomerController.deleteCustomer);

module.exports = router;
