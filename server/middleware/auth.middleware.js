const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const UserRole = require('../models/user_role.model');
const Privilege = require('../models/privilege.model');
const Link = require('../models/link.model');
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

exports.acccess_department = async (req, res, next) => {
    /*
     * Kiểm tra xem user có được phép truy cập vào page department hay không
     * Lấy id của user và tìm role tương ứng của user với page này
     * check trong privilege nếu tồn tại quyền truy cập của user với page thì cho phép truy cập
    */
    try {
        const roleId = req.header('current-role');//lấy role hiên tại của user
        const userId = req.user._id; //lấy id của user
        const userrole = await UserRole.findOne({userId, roleId}); //kiểm tra xem user này có role này thật hay không?
        if(userrole === null) throw {msg: 'USER_ROLE_INVALID'}; //không có thì báo lỗi

        const link = await Link.findOne({ url: '/manage-department' }); //lấy thông tin về link của trang quản lý đơn vị/phòng ban
        
        const privilege = await Privilege.find({
            resourceId: link._id,
            resourceType: 'Link',
            roleId
        });

        if(privilege === null) throw { msg: 'PRIVILEGE_DENIED!' };
        next();
    } catch (error) {
        res.status(400).json(error);
    }   
}   