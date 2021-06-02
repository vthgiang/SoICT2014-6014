const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');
const { authCUIP, auth, authFunc, uploadFile, rateLimitRequest} = require("../../middleware");

router.post("/login", AuthController.login);
router.get("/logout", auth, AuthController.logout);
router.get("/logout-all-account", auth, AuthController.logoutAllAccount);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", rateLimitRequest(10,20), AuthController.resetPassword);
router.get("/reset-password", AuthController.checkLinkValid);
router.get("/get-profile/:id", authFunc(false), AuthController.getProfile);
router.patch("/profile/:id/change-information", auth, authCUIP, uploadFile([{name:'avatar', path:'/avatars'}], 'single'), AuthController.changeInformation);
router.patch("/profile/:id/change-password", auth, authCUIP, AuthController.changePassword);
router.get("/get-links-that-role-can-access/:id", authFunc(false), AuthController.getLinksThatRoleCanAccess);
router.get("/download-file", auth, AuthController.downloadFile);
router.patch("/profile/create-password2", authFunc(false), AuthController.createPassword2);
router.delete("/profile/:id/delete-password2", authFunc(false), AuthController.deletePassword2);
router.get("/profile/check-user-exists-password2", authFunc(false), AuthController.checkPassword2Exists);

module.exports = router;
