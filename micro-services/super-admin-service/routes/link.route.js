const express = require("express");
const router = express.Router();
const LinkController = require('../controllers/link.controller');
const {auth} = require('../middleware/index');


router.get("/links", auth, LinkController.getLinks);

router.post("/links", auth, LinkController.createLink);
router.get("/links/:id", auth, LinkController.getLink);
router.patch("/links/:id", auth, LinkController.editLink);
router.delete("/links/:id", auth, LinkController.deleteLink);
// router.post('/links/importPrivileges', auth, LinkController.importPrivilegess);
router.patch("/links/company/update", auth, LinkController.updateCompanyLinks);
router.post("/links/attributes", auth, LinkController.createLinkAttribute);

module.exports = router;
