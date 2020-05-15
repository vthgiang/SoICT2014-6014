const express = require("express");
const router = express.Router();
const DocumentController = require('./document.controller');
const { auth } = require('../../middleware');

router.get("/types", auth, DocumentController.getDocumentTypes);
router.get("/types/:id", auth, DocumentController.showDocumentType);
router.post("/types", auth, DocumentController.createDocumentType);
router.patch("/types/:id", auth, DocumentController.editDocumentType);
router.delete("/types/:id", auth, DocumentController.deleteDocumentType);

module.exports = router;
