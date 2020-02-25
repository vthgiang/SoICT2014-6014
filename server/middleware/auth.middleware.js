const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserRole = require('../models/user_role.model');
const Company = require('../models/company.model');

exports.auth = async (req, res, next) => {
    const token = req.header('auth-token');//token jwt nhận từ người dùng
    const browserFinger = req.header('browser-finger'); //chữ ký của trình duyệt người dùng
      
    if(!token) return res.status(400).json({ msg: 'ACCESS_DENIED' });
    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        if(verified.browserFinger !== browserFinger) return res.status(400).json({ msg: 'ACCESS_DENIED' });
        req.user = verified; 
        req.token = token;
        
        //Kiểm tra công ty của người dùng có được bật dịch vụ hay không?
        const company = await Company.findById(req.user.company._id);
        if(company === null || company.active === false) return res.status(400).json({msg: 'ACCESS_DENIED'});
    
        //Kiểm tra token ngày còn hoạt động được hay không?
        var logged = await User.findOne({ _id: req.user._id,  token: token });
        if(logged === null) return res.status(400).send({ msg: 'ACC_LOGGED_OUT'}) 

        next();
    } catch (error) {
        res.status(400).json({ msg: 'TOKEN_INVALID' });
    }   
}

exports.role = async (req, res, next) => {
    try {
        console.log("GETLINK OF ROLE", req.params, req.user)
        const role = req.params.idRole;
        const user = req.user;
        const check = await UserRole.findOne({
            userId: user._id,
            roleId: role
        });
        console.log("check", check)
        if(check === null) return res.status(400).send({ msg: 'ROLE INVALID WITH USER'}) 
        next();
    } catch (error) {
        res.status(400).json({ msg: 'ACCESS DENIED!' });
    }   
}