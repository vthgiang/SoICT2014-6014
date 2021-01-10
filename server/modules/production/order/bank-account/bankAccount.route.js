const express = require('express');
const router = express.Router();
const bankAccountController = require('./bankAccount.controller');
const { auth } = require(`../../../../middleware`);

router.post('/', auth, bankAccountController.createBankAccount);
router.patch('/:id', auth, bankAccountController.editBankAccount);
router.get('/', auth, bankAccountController.getAllBankAccounts);

module.exports = router;