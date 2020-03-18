const express = require("express");
const router = express.Router();
const DocumentController = require('./document.controller');
const { auth } = require('../../middleware');

router.get("/document", auth, DocumentController.get);
router.get("/document/:id", auth, DocumentController.show);
router.post("/document", auth, DocumentController.create);
router.patch("/document", auth, DocumentController.edit);
router.delete("/document", auth, DocumentController.delete);

module.exports = router;
