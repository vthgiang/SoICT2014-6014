const AuthService = require('./auth.service');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req, res);
        
        res.header('VNIST-Authentication-Token', loginUser.token).status(200).json(loginUser);
    } catch (error) {

        res.status(400).json(error);
    }
};
