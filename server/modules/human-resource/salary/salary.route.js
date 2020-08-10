const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const SalaryController = require("./salary.controller");

router.get('/salaries', auth, SalaryController.searchSalaries);

router.post('/salaries', auth, SalaryController.createSalary);

router.patch('/salaries/:id', auth, SalaryController.updateSalary);
router.delete('/salaries/:id', auth, SalaryController.deleteSalary);

// Import lương nhân viên
router.post('/salaries/import', auth, SalaryController.importSalaries);

module.exports = router;