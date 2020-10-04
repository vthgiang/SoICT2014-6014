const express = require('express');
const router = express.Router();
const { auth } = require(`${SERVER_MIDDLEWARE_DIR}`);
const CategoryController = require('./category.controller');

router.get('/', auth, CategoryController.getCategories);
router.get('/by-type', auth, CategoryController.getCategoriesByType);
router.post('/', auth, CategoryController.createCategory);
router.get('/:id', auth, CategoryController.getCategory);
router.patch('/:id', auth, CategoryController.editCategory);
router.delete('/:id', auth, CategoryController.deleteCategory);

module.exports = router;