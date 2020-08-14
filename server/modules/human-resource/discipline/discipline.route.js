const express = require("express");
const router = express.Router();
const {
    auth
} = require('../../../middleware');

const DisciplineController = require("./discipline.controller");


router.get('/disciplines', auth, DisciplineController.searchDisciplines);

router.post('/disciplines', auth, DisciplineController.createDiscipline);

router.patch('/disciplines/:id', auth, DisciplineController.updateDiscipline);
router.delete('/disciplines/:id', auth, DisciplineController.deleteDiscipline);



module.exports = router;