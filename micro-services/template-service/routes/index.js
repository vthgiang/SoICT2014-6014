const express = require('express');
const router = express.Router();
// const AuthController = require('../controllers');
// const { auth, authFunc, authTrueOwner, uploadFile, rateLimitRequest } = require('../middleware/index');

// router.post('/login', AuthController.login);
// router.get('/logout', auth, AuthController.logout);
// router.get('/logout-all-account', auth, AuthController.logoutAllAccount);
// router.post('/forget-password', AuthController.forgetPassword);
// router.post('/reset-password', rateLimitRequest(10, 20), AuthController.resetPassword);
// router.get('/reset-password', AuthController.checkLinkValid);
// router.get('/get-profile/:userId', authFunc(false), authTrueOwner, AuthController.getProfile);
// router.patch('/profile/:userId/change-information', auth, authTrueOwner, uploadFile([{ name: 'avatar', path: '/avatars' }], 'single'), AuthController.changeInformation);
// router.patch('/profile/:userId/change-password', auth, authTrueOwner, AuthController.changePassword);
// router.get('/get-links-that-role-can-access/:roleId', authFunc(false), AuthController.getLinksThatRoleCanAccess);
// router.get('/download-file', auth, AuthController.downloadFile);
// router.patch('/profile/create-password2', authFunc(false), AuthController.createPassword2);
// router.delete('/profile/:userId/delete-password2', authFunc(false), authTrueOwner, AuthController.deletePassword2);
// router.get('/profile/check-user-exists-password2', authFunc(false), AuthController.checkPassword2Exists);

module.exports = router;
