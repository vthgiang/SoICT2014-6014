const express = require('express');
const router = express.Router();
const { auth } = require('../middleware');

const controllers = require('../controllers');


router.get('/use-requests', auth, controllers.USE_REQUEST.searchUseRequests);

router.post('/use-requests', auth, controllers.USE_REQUEST.createUseRequest);
router.put('/use-requests/:id',auth, controllers.USE_REQUEST.updateUseRequest);
router.delete('/use-requests/:id', auth, controllers.USE_REQUEST.deleteUseRequest);



module.exports = router;
