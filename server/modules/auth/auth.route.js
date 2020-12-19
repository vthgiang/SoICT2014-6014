const express = require("express");
const router = express.Router();
const AuthController = require('./auth.controller');
const { authCUIP, auth, authFunc, uploadFile } = require("../../middleware");

router.post("/login", AuthController.login);
router.get("/logout", auth, AuthController.logout);
router.get("/logout-all-account", auth, AuthController.logoutAllAccount);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", AuthController.resetPassword);
router.get("/get-profile/:id", authFunc(false), AuthController.getProfile);
router.patch("/profile/:id/change-information", auth, authCUIP, uploadFile([{name:'avatar', path:'/avatars'}], 'single'), AuthController.changeInformation);
router.patch("/profile/:id/change-password", auth, authCUIP, AuthController.changePassword);
router.get("/get-links-that-role-can-access/:id", authFunc(false), AuthController.getLinksThatRoleCanAccess);
router.get("/download-file", auth, AuthController.downloadFile);
router.patch("/answer-questions", auth, AuthController.answerAuthQuestions);

module.exports = router;
