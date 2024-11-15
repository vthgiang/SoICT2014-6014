const express = require('express');
const router = express.Router();
const { auth } = require(`../../../../middleware`);
const CategoryController = require('./category.controller');

router.get('/', auth, CategoryController.getCategories);
router.get('/category-tree', auth, CategoryController.getCategoryToTree);
router.get('/by-type', auth, CategoryController.getCategoriesByType);
router.post('/', auth, CategoryController.createCategory);
router.post('/imports', auth, CategoryController.importCategory);
router.post('/delete-many', auth, CategoryController.deleteManyCategories);
router.get('/:id', auth, CategoryController.getCategory);
router.patch('/:id', auth, CategoryController.editCategory);
router.delete('/:id', auth, CategoryController.deleteCategory);

module.exports = router;
