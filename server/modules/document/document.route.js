const express = require("express");
const router = express.Router();
const DocumentController = require('./document.controller');
const { auth } = require('../../middleware');

router.get("/categories", auth, DocumentController.getDocumentCategories);
router.get("/categories/:id", auth, DocumentController.showDocumentCategory);
router.post("/categories", auth, DocumentController.createDocumentCategory);
router.patch("/categories/:id", auth, DocumentController.editDocumentCategory);
router.delete("/categories/:id", auth, DocumentController.deleteDocumentCategory);

module.exports = router;
