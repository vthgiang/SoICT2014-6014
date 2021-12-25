const express = require("express");
const router = express.Router();
const { SystemApiControllers } = require('./systemApi.controller');
const { auth } = require(`../../../../middleware`);

/**
 * @swagger
 * /system-apis:
 *  get:
 *    description: Get system apis
 *    tags: [system-apis]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */
router.get("/system-apis", auth, SystemApiControllers.getSystemApis);

router.post("/system-apis", auth, SystemApiControllers.createSystemApi);

router.patch("/system-apis/:id", auth, SystemApiControllers.editSystemApi);

router.delete("/system-apis/:id", auth, SystemApiControllers.deleteSystemApi);

module.exports = router;
