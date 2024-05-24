const express = require('express');
const router = express.Router();
const { getListTaskPackage, getListTaskType, addTaskType, addTask } = require('./taskPackage.controller');
const { auth } = require(`../../../../middleware`);

// Lấy thông tin tập nhiệm vụ
router.get('/', auth, getListTaskPackage);
router.post('/', auth, addTask)

router.get('/task-type', auth, getListTaskType);
router.post('/task-type', auth, addTaskType);

module.exports = router;
