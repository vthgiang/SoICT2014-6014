const express = require("express");

const { SystemPageControllers } = require('./systemPage.controller');
const { auth } = require(`../../../middleware`);

const router = express.Router();

router.get("/apis", auth, SystemPageControllers.getPageApis);

// Thêm 1 trang mới cho system admin
router.post("/addSystemAdminPage", auth, SystemPageControllers.addSystemAdminPage);

// Lấy danh sách tất cả các trang mà system admin có quyền truy cập
router.get("/getSystemAdminPage", auth, SystemPageControllers.getSystemAdminPage);

// Xóa 1 hoặc nhiều trang của system admin
router.delete("/deleteSystemAdminPage", auth, SystemPageControllers.deleteSystemAdminPage);

module.exports = router;
