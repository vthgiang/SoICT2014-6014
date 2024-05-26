const express = require('express');
const router = express.Router();
const InternalServiceIdentitiesController = require('./internal-service-identities.controller');
const { auth } = require(`../../../middleware`);

router.post('/internal-service-identities', auth, InternalServiceIdentitiesController.create);
router.get('/internal-service-identities', auth, InternalServiceIdentitiesController.findAll);
router.get('/internal-service-identities/:id', auth, InternalServiceIdentitiesController.findOne);
router.get('/internal-service-identities/get-api-service-can-access/:id', auth, InternalServiceIdentitiesController.getApiServiceCanAccess);
router.patch('/internal-service-identities/:id', auth, InternalServiceIdentitiesController.update);
router.delete('/internal-service-identities/:id', auth, InternalServiceIdentitiesController.remove);

module.exports = router;
