const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const CommendationController = require("./commendation.controller");


router.get('/commendations', auth, CommendationController.searchCommendations);

router.post('/commendations', auth, CommendationController.createCommendation);

router.patch('/commendations/:id', auth, CommendationController.updateCommendation);
router.delete('/commendations/:id', auth, CommendationController.deleteCommendation);

module.exports = router;