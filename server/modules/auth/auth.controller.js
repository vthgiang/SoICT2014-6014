const AuthService = require('./auth.service');
const { LogInfo, LogError } = require('../../logs');

exports.login = async (req, res) => {
    try {
        const loginUser = await AuthService.login(req.header('fingerprint'), req.body);

        await LogInfo(loginUser.user.email, 'LOGIN', loginUser.user.company);
        res.status(200).json({
            success: true,
            messages: ['login_success'],
            content: loginUser
        });
    } catch (error) {

        await LogError(req.body.email, 'LOGIN');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['login_faile'],
            content: error
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const logout = await AuthService.logout(req.user._id, req.token);

        await LogInfo(req.user.email, 'LOG_OUT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['logout_success'],
            content: logout
        });
    } catch (error) {

        await LogError(req.user.email, 'LOG_OUT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['logout_faile'],
            content: error
        });
    }
};

exports.logoutAllAccount = async (req, res) => {
    try {
        const logout = await AuthService.logoutAllAccount(req.user._id);
        
        await LogInfo(req.user.email, 'LOG_OUT_ALL_ACCOUNT', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['logout_all_success'],
            content: logout
        });
    } catch (error) {

        await LogError(req.user.email, 'LOG_OUT_ALL_ACCOUNT', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['logout_all_faile'],
            content: error
        });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const forgetPassword = await AuthService.forgetPassword(req.body.email);

        await LogInfo(req.body.email, 'FORGET_PASSWORD');
        res.status(200).json({
            success: true,
            messages: ['request_forgot_password_success'],
            content: forgetPassword
        });
    } catch (error) {

        await LogError(req.body.email, 'FORGET_PASSWORD');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['request_forgot_password_faile'],
            content: error
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPassword = await AuthService.resetPassword(req.body.otp, req.body.email, req.body.password);

        await LogInfo(req.body.email, 'RESET_PASSWORD');
        res.status(200).json({
            success: true,
            messages: ['reset_password_success'],
            content: resetPassword
        });
    } catch (error) {

        await LogError(req.body.email, 'RESET_PASSWORD');
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['reset_password_faile'],
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
            console.log("file: ", req.files)
        }
        const profile = await AuthService.changeInformation(req.params.id, req.body.name, req.body.email, avatar);

        await LogInfo(req.user.email, 'CHANGE_USER_INFORMATION', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['change_user_information_success'],
            content: profile
        });
    } catch (error) {

        await LogError(req.user.email,'CHANGE_USER_INFORMATION', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_user_information_faile'],
            content: error
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const user = await AuthService.changePassword(req.params.id, req.body.password, req.body.new_password);

        await LogInfo(req.user.email, 'CHANGE_USER_PASSWORD', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['change_user_password_success'],
            content: user
        });
    } catch (error) {

        await LogError(req.user.email,'CHANGE_USER_PASSWORD', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['change_user_password_faile'],
            content: error
        });
    }
};

exports.getLinksThatRoleCanAccess = async (req, res) => {
    try {
        const data = await AuthService.getLinksThatRoleCanAccess(req.params.id);

        await LogInfo(req.user.email,'GET_LINKS_OF_ROLE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['get_links_of_role_success'],
            content: data
        });
    } catch (error) {

        await LogError(req.user.email,'GET_LINKS_OF_ROLE', req.user.company);
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['get_links_of_role_faile'],
            content: error
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const profile = await AuthService.getProfile(req.params.id);

        await LogInfo(req.user.email, 'GET_PROFILE', req.user.company);
        res.status(200).json({
            success: true,
            messages: ['show_profile_success'],
            content: profile
        });
    } catch (error) {

        await LogError(req.user.email, 'GET_PROFILE');
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
        const { path } = req.query;
        res.download(path, "file");
    } catch (error) {
        res.status(400).json({
            success: false,
            messages: Array.isArray(error) ? error : ['download_file_faile'],
            content: error
        });
    }
}