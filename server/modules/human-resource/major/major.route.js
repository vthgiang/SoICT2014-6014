const express = require("express");
const router = express.Router();

const MajorController = require("./major.controller");
const { auth } = require(`../../../middleware`);


router.get('/major', auth, MajorController.searchMajor);


router.post('/major', auth, MajorController.crateNewMajor);

// router.patch('/major/:id', auth, MajorController.updateAnnualLeave);
// router.delete('/major/:id', auth, MajorController.deleteAnnualLeave);

module.exports = router;