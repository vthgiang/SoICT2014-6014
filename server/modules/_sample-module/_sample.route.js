const express = require("express");
const router = express.Router();
const SampleController = require('./_sample.controller');

router.get("/item", SampleController.getItem);
router.post("/item", SampleController.createItem);

module.exports = router;
