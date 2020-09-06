const express = require("express");
const router = express.Router();
const GroupController = require('./group.controller');
const {auth} = require('../../../middleware');

router.post("/group", auth, GroupController.createGroup);

router.get("/group", auth, GroupController.getGroups);
router.get("/group/:id", auth, GroupController.getGroups);
router.patch("/group/:id", auth, GroupController.getGroups);
router.delete("/group/:id", auth, GroupController.deleteGroup);

module.exports = router;
