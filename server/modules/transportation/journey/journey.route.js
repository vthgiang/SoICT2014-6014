const express = require('express');
const router = express.Router();
const JourneyController = require('./journey.controller');
const { auth } = require(`../../../middleware`);

router.get('/', auth, JourneyController.getJourneys);
router.get('/cost', auth, JourneyController.getJourneysWithCost);
router.post('/create', auth, JourneyController.createJourney);
router.get('/search', auth, JourneyController.getJourneyByCondition);
router.patch('/:id/change-drivers', auth, JourneyController.changeDrivers);
router.patch('/update/:id', auth, JourneyController.updateJourney);
router.delete('/:id', auth, JourneyController.deleteJourney);

module.exports = router;