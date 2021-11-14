const express = require("express");
const router = express.Router();
const SystemLinkControllers = require('./systemLink.controller');
const { auth } = require(`../../../middleware`);

router.get("/system-links", auth, SystemLinkControllers.getAllSystemLinks);
router.get("/system-links/:systemLinkId", auth, SystemLinkControllers.getSystemLink);

router.post("/system-links", auth, SystemLinkControllers.createSystemLink);

router.patch("/system-links/:systemLinkId", auth, SystemLinkControllers.editSystemLink);

router.delete("/system-links/:systemLinkId", auth, SystemLinkControllers.deleteSystemLink);


// Lấy tất cả các category link mặc định

router.get("/system-links-categories", auth, SystemLinkControllers.getAllSystemLinkCategories);

module.exports = router;
