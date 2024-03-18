const express = require('express');
const router = express.Router();

const controllers = require('../controllers');
const {auth} = require('../middleware');

router.get('/tag', auth, controllers.TAG.searchTag);
router.post('/tag', auth, controllers.TAG.createNewTag);
router.patch('/tag/:id', auth, controllers.TAG.editTag);
router.delete('/tag/:id', auth, controllers.TAG.deleteTag);

module.exports = router;
