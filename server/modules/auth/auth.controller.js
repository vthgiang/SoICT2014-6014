const AuthService = require('./auth.service');

exports.login = async (req, res) => {
    try {
        var loginUser = await AuthService.login(req.body);
        
        res.header('VNIST-Authentication-Token', loginUser.token).status(200).json(loginUser);
    } catch (error) {

        res.status(400).json(error);
    }
};

exports.logout = async (req, res) => {
    try {
        var logout = await AuthService.logout(req, res);
        
        res.status(200).json(logout);
    } catch (error) {

        res.status(400).json(error);
    }
};

