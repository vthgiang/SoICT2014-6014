const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserRole = require('../models/user_role.model');

exports.auth = async (req, res, next) => {
    const token = req.header('auth-token');//token jwt nhận từ người dùng
    const browserFinger = req.header('browser-finger'); //chữ ký của trình duyệt người dùng
      
    if(!token) return res.status(400).json({ msg: 'ACCESS_DENIED' });
    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        if(verified.browserFinger !== browserFinger) return res.status(400).json({ msg: 'ACCESS_DENIED' });
        req.user = verified; 
        req.token = token;

        var logged = await User.findOne({ _id: req.user._id,  token: token });
        if(logged === null) return res.status(400).send({ msg: 'ACC_LOGGED_OUT'}) 

        next();
    } catch (error) {
        res.status(400).json({ msg: 'TOKEN_INVALID' });
    }   
}

exports.role = async (req, res, next) => {
    try {
        const role = req.params.idRole;
        const user = req.user;
        const check = await UserRole.findOne({
            userId: user._id,
            roleId: role
        });
        if(check === null) return res.status(400).send({ msg: 'ROLE INVALID WITH USER'}) 
        next();
    } catch (error) {
        res.status(400).json({ msg: 'ACCESS DENIED!' });
    }   
}