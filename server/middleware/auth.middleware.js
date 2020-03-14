const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const UserRole = require('../models/user_role.model');
const Privilege = require('../models/privilege.model');
const Link = require('../models/link.model');
const Company = require('../models/company.model');

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('auth-token');//JWT nhận từ người dùng
        const browserFinger = req.header('browser-finger'); //chữ ký của trình duyệt người dùng - fingerprint
        const role = await Role.findById(req.header('current-role')); //current role của người dùng

        /**
         * Nếu không có JWT được gửi lên -> người dùng chưa đăng nhập
         */
        if(!token) throw ({ msg: 'ACCESS_DENIED' });

        /**
         * Giải mã token gửi lên để check dữ liệu trong token
         */
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        /**
         * So sánh  fingerprint trong token với fingerprint được gửi lên từ máy của người dùng
         * Nếu hai fingerprint này giống nhau -> token được tạo ra và gửi đi từ cùng một trình duyệt trên cùng 1 thiết bị
         * Nếu hai fingerprint này khác nhau -> token đã bị lấy cắp và gửi từ một trình duyệt trên thiết bị khác
         */
        if(verified.browserFinger !== browserFinger) throw ({ msg: 'ACCESS_DENIED' });

        req.user = verified; 
        req.token = token;

        /**
         * Kiểm tra xem token có còn hoạt động hay không ?
         * Nghĩa là JWT chỉ được coi là hoạt động nếu như nó vẫn còn được lưu lại trong CSDL của người dùng.
         * Nếu như người tạo ra JWT này đã đăng xuất thì JWT này sẽ được xóa đi khỏi CSDL của người dùng.
         * Lần đăng nhập sau server sẽ tạo ra một JWT mới khác cho người dùng
         */
        var logged = await User.findOne({ _id: req.user._id,  token: token });
        if(logged === null) throw ({ msg: 'ACC_LOGGED_OUT'});

        if(role !== null) //Kiểm tra current role của user có tồn tại hay không?
        {
            /**
             * Kiểm tra xem current role có đúng với người dùng hay không?
             */
            const roleId = role._id;
            const userId = req.user._id;
            const userrole = await UserRole.findOne({userId, roleId});
            if(userrole === null) throw ({msg: 'USER_ROLE_INVALID'});

            /**
             * Riêng đối với system admin của hệ thống thì bỏ qua bước này
             */
            if(role.name !== 'System Admin'){
                /**
                 * Kiểm tra công ty của người dùng có đang được kích hoạt hay không?
                 */
                const company = await Company.findById(req.user.company._id);
                if(company === null || company.active === false) throw ({msg: 'ACCESS_DENIED'});
                
                /**
                 * Kiểm tra xem current-role của người dùng có được phép truy cập vào trang này hay không?
                 * Lấy đường link mà người dùng đã truy cập 
                 * Sau đó check trong bảng privilege xem có tồn tại cặp value tương ứng giữa current-role của user với đường link của trang 
                 * Nếu tìm thấy dữ liệu -> Cho phép truy cập tiếp
                 * Ngược lại thì trả về thông báo lỗi không có quyền truy cập vào trang này
                 */
                var origin = JSON.stringify(req.headers.origin);
                var referer = JSON.stringify(req.headers.referer);
                var url = referer.substr(origin.length - 1, referer.length - origin.length);
                const link = await Link.findOne({
                    url,
                    company: req.user.company._id 
                });
                const roleArr = [roleId].concat(role.parents);
                console.log("ORIGIN :", origin);
                console.log("REFERER :", referer);
                console.log("URL :", url);
                console.log("LINK :", link);
                console.log("roleArr :", roleArr);
                console.log("link, role: ",link._id, roleArr)
                const privilege = await Privilege.findOne({
                    resourceId: link._id,
                    resourceType: 'Link',
                    roleId: { $in: roleArr }
                });
                console.log("PRI :", privilege);
                if(privilege === null) throw ({ msg: 'PAGE_ACCESS_DENIED' });
            }

            next();
        }else{ //Không có dữ liệu về current role của user trên hệ thống
            throw ({ msg: "ROLE_INVALID"});
        }
        
    } catch (error) {
        res.status(400).json(error);
    }   
}
