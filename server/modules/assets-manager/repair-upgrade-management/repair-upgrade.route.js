const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const RepairUpgradeController = require("./repair-upgrade.controller");

/**
 * Lấy danh sách nghỉ phép
 */ 
router.post('/paginate',auth, RepairUpgradeController.searchRepairUpgrades);

/**
 * thêm mới nghỉ phép
 */ 
router.post('/create',auth, RepairUpgradeController.createRepairUpgrade);

/**
 * Xoá thông tin nghỉ phép
 */
router.delete('/:id',auth, RepairUpgradeController.deleteRepairUpgrade);

/**
 * Cập nhật thông tin nghỉ phép
 */
router.put('/:id',auth, RepairUpgradeController.updateRepairUpgrade);

module.exports = router;