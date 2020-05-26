const express = require("express");
const router = express.Router();
const { auth } = require('../../../middleware');

const AnnualLeaveController = require("./annualLeave.controller");

/**
 * Lấy danh sách nghỉ phép
 */ 
router.get('/',auth, AnnualLeaveController.searchAnnualLeaves);

/**
 * thêm mới kỷ luật
 */ 
router.post('/',auth, AnnualLeaveController.createAnnualLeave);

/**
 * Xoá bẳng thông tin kỷ luật
 */
router.delete('/:id',auth, AnnualLeaveController.deleteAnnualLeave);

/**
 * Cập nhật thông tin nghỉ phép
 */
router.patch('/:id',auth, AnnualLeaveController.updateAnnualLeave);

module.exports = router;