const express = require("express");
const router = express.Router();
const { SystemApiControllers } = require('./systemApi.controller');
const { auth } = require(`../../../../middleware`);

/**
 * @swagger
 * /system-admin/system-api/system-apis:
 *  get:
 *    description: Get system apis
 */
router.get("/system-apis", auth, SystemApiControllers.getSystemApis);

/**
 * @swagger
 * /system-admin/system-api/system-apis:
 *  post:
 *    description: Create system apis
 */
router.post("/system-apis", auth, SystemApiControllers.createSystemApi);

/**
 * @swagger
 * /system-admin/system-api/system-apis/:id:
 *  patch:
 *    description: Edit system apis
 */
router.patch("/system-apis/:id", auth, SystemApiControllers.editSystemApi);

/**
 * @swagger
 * /system-admin/system-api/system-apis/:id:
 *  delete:
 *    description: Delete system apis
 */
router.delete("/system-apis/:id", auth, SystemApiControllers.deleteSystemApi);

module.exports = router;
