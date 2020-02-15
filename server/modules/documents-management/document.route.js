const express = require("express");
const router = express.Router();
const SampleController = require('./_sample.controller');

router.get("/item", SampleController.get);
router.get("/item/:id", SampleController.show);
router.post("/item", SampleController.create);
router.patch("/item", SampleController.edit);
router.delete("/item", SampleController.delete);

module.exports = router;
