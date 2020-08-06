const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const RecommendProcureController = require("./recommend-procurement.controller");


router.get('/recommend-procurements',auth, RecommendProcureController.searchRecommendProcures);


router.post('/recommend-procurements', auth, RecommendProcureController.createRecommendProcure);
router.put('/recommend-procurements/:id',auth, RecommendProcureController.updateRecommendProcure);
router.delete('/recommend-procurements/:id',auth, RecommendProcureController.deleteRecommendProcure);



module.exports = router;