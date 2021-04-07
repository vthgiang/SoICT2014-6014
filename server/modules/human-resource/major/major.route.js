const express = require("express");
const router = express.Router();

const MajorController = require("./major.controller");
const { auth } = require(`../../../middleware`);


router.get('/major', auth, MajorController.searchMajor);


router.post('/major', auth, MajorController.createNewMajor);

router.patch('/major/:id', auth, MajorController.updateMajor);

router.delete('/major', auth, MajorController.deleteMajor);

module.exports = router;