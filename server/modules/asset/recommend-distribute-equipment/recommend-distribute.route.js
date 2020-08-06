const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const RecommendDistributeController = require("./recommend-distribute.controller");


router.get('/recommend-distributes', auth, RecommendDistributeController.searchRecommendDistributes);

router.post('/recommend-distributes', auth, RecommendDistributeController.createRecommendDistribute);
router.put('/recommend-distributes/:id',auth, RecommendDistributeController.updateRecommendDistribute);
router.delete('/recommend-distributes/:id', auth, RecommendDistributeController.deleteRecommendDistribute);



module.exports = router;