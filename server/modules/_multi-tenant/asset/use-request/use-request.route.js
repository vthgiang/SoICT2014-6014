const express = require("express");
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}/_multi-tenant`);

const RecommendDistributeController = require("./use-request.controller");


router.get('/use-requests', auth, RecommendDistributeController.searchRecommendDistributes);

router.post('/use-requests', auth, RecommendDistributeController.createRecommendDistribute);
router.put('/use-requests/:id',auth, RecommendDistributeController.updateRecommendDistribute);
router.delete('/use-requests/:id', auth, RecommendDistributeController.deleteRecommendDistribute);



module.exports = router;