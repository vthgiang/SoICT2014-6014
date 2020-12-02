const express = require("express");
const router = express.Router();

const FieldController = require("./field.controller");
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);


router.get('/fields', auth, FieldController.getAllFields);

router.post('/fields', auth, FieldController.createFields);

router.put('/fields/:id', auth, FieldController.updateFields);
router.delete('/fields/:id', auth, FieldController.deleteFields);


module.exports = router;