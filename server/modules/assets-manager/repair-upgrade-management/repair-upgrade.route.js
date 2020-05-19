const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const RepairUpgradeController = require("./repair-upgrade.controller");

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */ 
router.post('/paginate',auth, RepairUpgradeController.searchRepairUpgrades);

/**
 * thêm mới phiếu sửa chữa - thay thế - nâng cấp
 */ 
router.post('/create',auth, RepairUpgradeController.createRepairUpgrade);

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
router.delete('/:id',auth, RepairUpgradeController.deleteRepairUpgrade);

/**
 * Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
router.put('/:id',auth, RepairUpgradeController.updateRepairUpgrade);

// Kiểm tra sự tồn tại của mã phiếu
router.get('/checkRepairNumber/:repairNumber', auth, RepairUpgradeController.checkRepairNumber);

module.exports = router;