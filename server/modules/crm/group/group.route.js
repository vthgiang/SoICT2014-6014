const express = require("express");
const router = express.Router();
const { auth } = require(`../../../middleware`);

const GroupController = require('./group.controller');

router.get('/', auth, GroupController.getGroups);
router.get('/:id', auth, GroupController.getGroupById);
router.post('/', auth, GroupController.createGroup);
router.patch('/:id', auth, GroupController.editGroup);
router.delete('/:id', auth, GroupController.deleteGroup);

router.post('/:id/promotion', auth, GroupController.addGroupPromotion);
router.patch('/:id/promotion', auth, GroupController.editGroupPromotion);
router.delete('/:id/promotion', auth, GroupController.deleteGroupPromotion);

router.get('/:id/members', auth, GroupController.getMembersInGroup);

module.exports = router;