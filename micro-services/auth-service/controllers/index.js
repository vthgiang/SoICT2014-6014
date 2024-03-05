const { getLinksThatRoleCanAccess } = require("@/services/getlink");
const { login, logout, logoutAllAccount } = require("@/services/login");
const {
  forgetPassword,
  resetPassword,
  checkLinkValid,
  changeInformation,
  changePassword,
  changePassword2,
  getProfile,
  createPassword2,
  deletePassword2,
  checkPassword2Exists,
} = require("@/services/changeUser");

const { decryptMessage } = require("../../helpers/functionHelper");

const login = async (req, res) => {
  try {
    const fingerprint = decryptMessage(req.header("fgp"));
    const loginUser = await login(fingerprint, req.body);

    await Logger.info(req.body.email, "login_success", req.body.portal);
    res.status(200).json({
      success: true,
      messages: ["login_success"],
      content: loginUser,
    });
  } catch (error) {
    console.log("errorLogIn", error);
    await Logger.error(req.body.email, "login_faile", req.body.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["login_faile"],
      content: error,
    });
  }
};

const logout = async (req, res) => {
  try {
    const logout = await logout(
      req.portal,
      req.user._id,
      req.token
    );

    await Logger.info(req.user.email, "logout_suscess", req.portal);
    res.status(200).json({
      success: true,
      messages: ["logout_success"],
      content: logout,
    });
  } catch (error) {
    console.log("errorLogOut", error);
    await Logger.error(req.user.email, "logout_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["logout_faile"],
      content: error,
    });
  }
};

const logoutAllAccount = async (req, res) => {
  try {
    const logout = await logoutAllAccount(req.portal, req.user._id);

    await Logger.info(req.user.email, "logout_all_success", req.portal);
    res.status(200).json({
      success: true,
      messages: ["logout_all_success"],
      content: logout,
    });
  } catch (error) {
    console.log("errorLogOutALl", error);
    await Logger.error(req.user.email, "logout_all_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["logout_all_faile"],
      content: error,
    });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { portal, email, password2 } = req.body;
    const forgetPassword = await forgetPassword(
      portal,
      email,
      password2
    );

    await Logger.info(req.body.email, "request_forgot_password_success");
    res.status(200).json({
      success: true,
      messages: ["request_forgot_password_success"],
      content: forgetPassword,
    });
  } catch (error) {
    console.log(error);
    await Logger.error(req.body.email, "request_forgot_password_faile");
    res.status(400).json({
      success: false,
      messages: Array.isArray(error)
        ? error
        : ["request_forgot_password_faile"],
      content: error,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    console.log("req", req.rateLimit);
    const resetPassword = await resetPassword(req.body);
    await Logger.info(req.body.email, "reset_password_success");
    res.status(200).json({
      success: true,
      messages: ["reset_password_success"],
      content: resetPassword,
    });
  } catch (error) {
    console.log("error", error);
    await Logger.error(req.body.email, "reset_password_faile");
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["reset_password_faile"],
      content: error,
    });
  }
};

const checkLinkValid = async (req, res) => {
  try {
    await checkLinkValid(req.query);
    await Logger.info(req.body.email, "check_url_reset_password_success");
    res.status(200).json({
      success: true,
      messages: ["check_url_reset_password_success"],
      content: "",
    });
  } catch (error) {
    console.log("errorCheckURL", error);
    await Logger.error(req.body.email, "check_url_reset_password_faile");
    res.status(400).json({
      success: false,
      messages: Array.isArray(error)
        ? error
        : ["check_url_reset_password_faile"],
      content: error,
    });
  }
};

const changeInformation = async (req, res) => {
  try {
    let avatar;
    if (req.file) {
      let path = req.file.destination + "/" + req.file.filename;
      avatar = path.substr(1, path.length);
    }
    const profile = await changeInformation(
      req.portal,
      req.params.userId,
      req.body.name,
      req.body.email,
      req.body.password2,
      avatar
    );

    await Logger.info(
      req.user.email,
      "change_user_information_success",
      req.portal
    );
    res.status(200).json({
      success: true,
      messages: ["change_user_information_success"],
      content: profile,
    });
  } catch (error) {
    console.log("change error", error);
    await Logger.error(
      req.user.email,
      "change_user_information_faile",
      req.portal
    );
    res.status(400).json({
      success: false,
      messages: Array.isArray(error)
        ? error
        : ["change_user_information_faile"],
      content: error,
    });
  }
};

const changePassword = async (req, res) => {
  if (req.query.type === "pwd2") {
    changePassword2(req, res);
  } else {
    changePassword1(req, res);
  }
};

const changePassword1 = async (req, res) => {
  try {
    const user = await changePassword(
      req.portal,
      req.params.userId,
      req.body.password,
      req.body.new_password,
      req.body.confirmPassword,
      req.body.password2
    );

    await Logger.info(
      req.user.email,
      "change_user_password_success",
      req.portal
    );
    res.status(200).json({
      success: true,
      messages: ["change_user_password_success"],
      content: user,
    });
  } catch (error) {
    console.log(error);
    await Logger.error(
      req.user.email,
      "change_user_password_faile",
      req.portal
    );
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["change_user_password_faile"],
      content: error,
    });
  }
};

const changePassword2 = async (req, res) => {
  try {
    const user = await changePassword2(
      req.portal,
      req.params.userId,
      req.body
    );

    await Logger.info(
      req.user.email,
      "change_user_password2_success",
      req.portal
    );
    res.status(200).json({
      success: true,
      messages: ["change_user_password2_success"],
      content: user,
    });
  } catch (error) {
    console.log(error);
    await Logger.error(
      req.user.email,
      "change_user_password2_faile",
      req.portal
    );
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["change_user_password2_faile"],
      content: error,
    });
  }
};

const getLinksThatRoleCanAccess = async (req, res) => {
  try {
    const data = await getLinksThatRoleCanAccess(
      req.portal,
      req.params.roleId,
      req.query.userId
    );

    await Logger.info(req.user.email, "get_links_of_role_success", req.portal);
    res.status(200).json({
      success: true,
      messages: ["get_links_of_role_success"],
      content: data,
    });
  } catch (error) {
    console.log(error);
    await Logger.error(req.user.email, "get_links_of_role_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["get_links_of_role_faile"],
      content: error,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await getProfile(req.portal, req.params.userId);

    await Logger.info(req.user.email, "show_profile_success", req.portal);
    res.status(200).json({
      success: true,
      messages: ["show_profile_success"],
      content: profile,
    });
  } catch (error) {
    await Logger.info(req.user.email, "show_profile_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["show_profile_faile"],
      content: error,
    });
  }
};

const downloadFile = async (req, res) => {
  try {
    const { path } = req.query;
    res.download(path);
  } catch (error) {
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["download_file_faile"],
      content: error,
    });
  }
};

const createPassword2 = async (req, res) => {
  try {
    const answer = await createPassword2(
      req.portal,
      req.user._id,
      req.body
    );
    await Logger.info(req.user.email, "create_password2_success", req.portal);
    res.status(200).json({
      success: true,
      messages: ["create_password2_success"],
      content: answer,
    });
  } catch (error) {
    await Logger.info(req.user.email, "create_password2_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["create_password2_faile"],
      content: error,
    });
  }
};

const deletePassword2 = async (req, res) => {
  try {
    const result = await deletePassword2(
      req.portal,
      req.body,
      req.params.userId
    );
    await Logger.info(req.user.email, "delete_password2_success", req.portal);
    res.status(200).json({
      success: true,
      messages: ["delete_password2_success"],
      content: result,
    });
  } catch (error) {
    await Logger.info(req.user.email, "delete_password2_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["delete_password2_faile"],
      content: error,
    });
  }
};

const checkPassword2Exists = async (req, res) => {
  try {
    const result = await checkPassword2Exists(
      req.portal,
      req.user._id
    );
    await Logger.info(req.user.email, "check_password2_success", req.portal);
    res.status(200).json({
      success: true,
      messages: ["check_password2_success"],
      content: result,
    });
  } catch (error) {
    await Logger.info(req.user.email, "check_password2_faile", req.portal);
    res.status(400).json({
      success: false,
      messages: Array.isArray(error) ? error : ["check_password2_faile"],
      content: error,
    });
  }
};

module.exports = {
  login,
  logout,
  logoutAllAccount,
  forgetPassword,
  resetPassword,
  checkLinkValid,
  changeInformation,
  changePassword,
  getLinksThatRoleCanAccess,
  getProfile,
  downloadFile,
  createPassword2,
  deletePassword2,
  checkPassword2Exists,
};
