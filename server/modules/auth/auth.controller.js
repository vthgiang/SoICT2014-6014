const AuthService = require('./auth.service');
const Logger = require(`../../logs`);
const { decryptMessage } = require('../../helpers/functionHelper');

exports.login = async (req, res) => {
    try {
        const fingerprint = decryptMessage(req.header('fgp'));
        const loginUser = await AuthService.login(fingerprint, req.body);

        await Logger.info(req.body.email, 'login_success', req.body.portal);
        res.status(200).json({
            success: true,
            messages: ['login_success'],
            content: loginUser
        });
    } catch (error) {

        await Logger.error(req.body.email, 'login_faile', req.body.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['login_faile'],
            content: error
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const logout = await AuthService.logout(req.portal, req.user._id);

        await Logger.info(req.user.email, 'logout_suscess', req.portal);
        res.status(200).json({
            success: true,
            messages: ['logout_success'],
            content: logout
        });
    } catch (error) {

        await Logger.error(req.user.email, 'logout_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['logout_faile'],
            content: error
        });
    }
};

exports.logoutAllAccount = async (req, res) => {
    try {
        const logout = await AuthService.logoutAllAccount(req.portal, req.user._id);
        
        await Logger.info(req.user.email, 'logout_all_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['logout_all_success'],
            content: logout
        });
    } catch (error) {

        await Logger.error(req.user.email, 'logout_all_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['logout_all_faile'],
            content: error
        });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { portal, email, password2 } = req.body;
        const forgetPassword = await AuthService.forgetPassword(portal, email, password2);

        await Logger.info(req.body.email, 'request_forgot_password_success');
        res.status(200).json({
            success: true,
            messages: ['request_forgot_password_success'],
            content: forgetPassword
        });
    } catch (error) {
        console.log(error)
        await Logger.error(req.body.email, 'request_forgot_password_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['request_forgot_password_faile'],
            content: error
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        console.log('req', req.rateLimit)
        const resetPassword = await AuthService.resetPassword(req.body);
        await Logger.info(req.body.email, 'reset_password_success');
        res.status(200).json({
            success: true,
            messages: ['reset_password_success'],
            content: resetPassword
        });
    } catch (error) {
        console.log('error', error)
        await Logger.error(req.body.email, 'reset_password_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['reset_password_faile'],
            content: error
        });
    }
};

exports.checkLinkValid = async (req, res) => {
    try {
        await AuthService.checkLinkValid(req.query);
        await Logger.info(req.body.email, 'check_url_reset_password_success');
        res.status(200).json({
            success: true,
            messages: ['check_url_reset_password_success'],
            content: ""
        });
    } catch (error) {
        console.log('errorCheckURL', error)
        await Logger.error(req.body.email, 'check_url_reset_password_faile');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['check_url_reset_password_faile'],
            content: error
        });
    }
};

exports.changeInformation = async (req, res) => {
    try {
        let avatar;
        if(req.file){
            let path = req.file.destination +'/'+ req.file.filename;
            avatar = path.substr(1, path.length)
        }
        const profile = await AuthService.changeInformation(req.portal, req.params.id, req.body.name, req.body.email, req.body.password2, avatar);

        await Logger.info(req.user.email, 'change_user_information_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['change_user_information_success'],
            content: profile
        });
    } catch (error) {
        console.log("change error", error);
        await Logger.error(req.user.email, 'change_user_information_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_user_information_faile'],
            content: error
        });
    }
};

exports.changePassword = async (req, res) => {
    if (req.query.type === "pwd2") {
        changePassword2(req, res);
    } else {
        changePassword1(req, res);
    }
};

changePassword1 = async (req, res) => {
    try {
        const user = await AuthService.changePassword(req.portal, req.params.id, req.body.password, req.body.new_password, req.body.confirmPassword, req.body.password2);

        await Logger.info(req.user.email, 'change_user_password_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['change_user_password_success'],
            content: user
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'change_user_password_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_user_password_faile'],
            content: error
        });
    }
}


changePassword2 = async(req, res) => {
    try {
        const user = await AuthService.changePassword2(req.portal, req.params.id, req.body);

        await Logger.info(req.user.email, 'change_user_password2_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['change_user_password2_success'],
            content: user
        });
    } catch (error) {
        console.log(error);
        await Logger.error(req.user.email, 'change_user_password2_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_user_password2_faile'],
            content: error
        });
    }
}
exports.getLinksThatRoleCanAccess = async (req, res) => {
    try {
        const data = await AuthService.getLinksThatRoleCanAccess(req.portal, req.params.id);

        await Logger.info(req.user.email, 'get_links_of_role_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['get_links_of_role_success'],
            content: data
        });
    } catch (error) {

        await Logger.error(req.user.email, 'get_links_of_role_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_links_of_role_faile'],
            content: error
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await AuthService.getProfile(req.portal, req.params.id);

        await Logger.info(req.user.email, 'show_profile_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['show_profile_success'],
            content: profile
        });
    } catch (error) {

        await Logger.info(req.user.email, 'show_profile_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['show_profile_faile'],
            content: error
        });
    }
};
 /**
 * Người dùng download 1 file từ server
 * @path: đường dẫn tương đối về file - được lấy qua trường 'path' của req.query
 * Tham số về đường dẫn tương đối của file đường truyền từ bên client đến server như sau:
 * localhost:8000/auth/download-file?path=duong_dan_tuong_doi_cua_file_can_tai
 */
exports.downloadFile = async (req, res) => {
    try {
        cons
        const { path } = req.query;
        res.download(path);
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_file_faile'],
            content: error
        });
    }
}

exports.createPassword2 = async(req, res) => {
    try {
        const answer = await AuthService.createPassword2(req.portal, req.user._id, req.body);
        await Logger.info(req.user.email, 'create_password2_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['create_password2_success'],
            content: answer
        });
    } catch (error) {

        await Logger.info(req.user.email, 'create_password2_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['create_password2_faile'],
            content: error
        });
    }
}

exports.deletePassword2 = async (req, res) => {
    try {
        const result = await AuthService.deletePassword2(req.portal, req.body, req.params.id);
        await Logger.info(req.user.email, 'delete_password2_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['delete_password2_success'],
            content: result
        });
    } catch (error) {
        await Logger.info(req.user.email, 'delete_password2_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['delete_password2_faile'],
            content: error
        });
    }
}

exports.checkPassword2Exists = async (req, res) => {
    try {
        const result = await AuthService.checkPassword2Exists(req.portal, req.user._id);
        await Logger.info(req.user.email, 'check_password2_success', req.portal);
        res.status(200).json({
            success: true,
            messages: ['check_password2_success'],
            content: result
        });
    } catch (error) {
        await Logger.info(req.user.email, 'check_password2_faile', req.portal);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['check_password2_faile'],
            content: error
        });
    }
}