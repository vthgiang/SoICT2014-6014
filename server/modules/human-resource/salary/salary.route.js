const express = require("express");
const router = express.Router();

const SalaryController = require("./salary.controller");
const { auth } = require(`../../../middleware`);


router.get('/salaries', auth, SalaryController.searchSalaries);
router.get('/salaries-chart', auth, SalaryController.getSalaryChart);

router.post('/salaries', auth, SalaryController.createSalary);

router.patch('/salaries/:id', auth, SalaryController.updateSalary);
router.delete('/salaries/:id', auth, SalaryController.deleteSalary);

// Import lương nhân viên
router.post('/salaries/import', auth, SalaryController.importSalaries);

module.exports = router;