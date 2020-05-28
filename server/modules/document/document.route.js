const express = require("express");
const router = express.Router();
const DocumentController = require('./document.controller');
const { auth, uploadFile } = require('../../middleware');

// Danh mục văn bản - domain
router.get("/domains", auth, DocumentController.getDocumentDomains);
router.get("/domains/:id", auth, DocumentController.showDocumentDomain);
router.post("/domains", auth, DocumentController.createDocumentDomain);
router.patch("/domains/:id", auth, DocumentController.editDocumentDomain);
router.delete("/domains/:id", auth, DocumentController.deleteDocumentDomain);


// Loại văn bản - category
router.get("/categories", auth, DocumentController.getDocumentCategories);
router.get("/categories/:id", auth, DocumentController.showDocumentCategory);
router.post("/categories", auth, DocumentController.createDocumentCategory);
router.patch("/categories/:id", auth, DocumentController.editDocumentCategory);
router.delete("/categories/:id", auth, DocumentController.deleteDocumentCategory);

// Văn bản tài liệu
router.get("/", auth, DocumentController.getDocuments);
router.get("/:id", auth, DocumentController.showDocument);
router.post("/", auth, uploadFile([{name:'file', path:'/files'}, {name:'fileScan', path:'/files'}], 'fields'), DocumentController.createDocument);
router.patch("/:id", auth, uploadFile([{name:'file', path:'/files'}, {name:'fileScan', path:'/files'}], 'fields'), DocumentController.editDocument);
router.delete("/:id", auth, DocumentController.deleteDocument);

router.get("/download-file/:id/:numberVersion", auth, DocumentController.downloadDocumentFile);
router.get("/download-file-scan/:id/:numberVersion", auth, DocumentController.downloadDocumentFileScan);

module.exports = router;
