const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);

const RecommendProcureController = require("./purchase-request.controller");


router.get('/purchase-request',auth, RecommendProcureController.searchRecommendProcures);


router.post('/purchase-request', auth, RecommendProcureController.createRecommendProcure);
router.put('/purchase-request/:id',auth, RecommendProcureController.updateRecommendProcure);
router.delete('/purchase-request/:id',auth, RecommendProcureController.deleteRecommendProcure);



module.exports = router;