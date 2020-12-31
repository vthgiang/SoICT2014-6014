const express = require("express");
const router = express.Router();

const MajorController = require("./major.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/major', auth, MajorController.searchMajor);


router.post('/major', auth, MajorController.crateNewMajor);

router.patch('/major/:id', auth, MajorController.updateMajor);

router.delete('/major', auth, MajorController.deleteMajor);

module.exports = router;