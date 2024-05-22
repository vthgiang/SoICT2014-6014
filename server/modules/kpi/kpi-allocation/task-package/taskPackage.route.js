const express = require('express');
const router = express.Router();
const { getListTaskPackage } = require('./taskPackage.controller');
const { auth } = require(`../../../../middleware`);

// Lấy thông tin tập nhiệm vụ
router.get('/', auth, getListTaskPackage);

// // Update thông tin cấu hình giải thuật phân bổ KPI
// router.patch('/config-setting/:id', auth, updateConfigSettingData);

// // Tạo mới thông tin cấu hình giải thuật phân bổ KPI
// router.put('/config-setting/:id', auth, createConfigSettingData);

module.exports = router;
