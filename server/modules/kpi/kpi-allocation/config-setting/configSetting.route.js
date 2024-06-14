const express = require('express');
const router = express.Router();
const { getConfigSettingData, updateConfigSettingData, createConfigSettingData, handleStartAllocation } = require('./configSetting.controller');
const { auth } = require(`../../../../middleware`);

// Lấy thông tin cấu hình giải thuật phân bổ KPI
router.get('/config-setting', auth, getConfigSettingData);

// Update thông tin cấu hình giải thuật phân bổ KPI
router.patch('/config-setting/:id', auth, updateConfigSettingData);

// Tạo mới thông tin cấu hình giải thuật phân bổ KPI
router.put('/config-setting/:id', auth, createConfigSettingData);

router.post('/start', auth, handleStartAllocation);

module.exports = router;
