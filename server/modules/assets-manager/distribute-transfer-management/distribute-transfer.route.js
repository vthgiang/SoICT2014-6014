const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const DistributeTransferController = require("./distribute-transfer.controller");

/**
 * Lấy danh sách phiếu sửa chữa - thay thế - nâng cấp
 */ 
router.post('/paginate',auth, DistributeTransferController.searchDistributeTransfers);

/**
 * thêm mới phiếu sửa chữa - thay thế - nâng cấp
 */ 
router.post('/create',auth, DistributeTransferController.createDistributeTransfer);

/**
 * Xoá thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
router.delete('/:id',auth, DistributeTransferController.deleteDistributeTransfer);

/**
 * Cập nhật thông tin phiếu sửa chữa - thay thế - nâng cấp
 */
router.put('/:id',auth, DistributeTransferController.updateDistributeTransfer);

// Kiểm tra sự tồn tại của mã phiếu
router.get('/checkDistributeNumber/:distributeNumber', auth, DistributeTransferController.checkDistributeNumber);

module.exports = router;