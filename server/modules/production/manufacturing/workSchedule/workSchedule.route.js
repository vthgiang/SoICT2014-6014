const express = require('express');
const router = express.Router();
const WorkScheduleController = require('./workSchedule.controller');
const { auth } = require(`../../../../middleware`);


// Lấy tất cả danh sách lịch sản xuất của tất cả các xưởng của một nhà máy sản xuất và theo thời gian truyền vào
router.get("/manufacturingMills", WorkScheduleController.getWorkSchedulesOfManufacturingWork);
router.post("/", auth, WorkScheduleController.createWorkSchedule);
router.get("/", auth, WorkScheduleController.getWorkSchedules);
// Lấy tất cả danh sách lịch sản xuất của một xưởng duy nhất;
router.get("/manufacturingMill/:id", auth, WorkScheduleController.getWorkSchedulesByMillId);

module.exports = router;