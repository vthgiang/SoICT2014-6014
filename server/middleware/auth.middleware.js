const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const UserRole = require('../models/user_role.model');
const Privilege = require('../models/privilege.model');
const Link = require('../models/link.model');
const Company = require('../models/company.model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('auth-token');//JWT nhận từ người dùng
        const fingerprint = req.header('fingerprint'); //chữ ký của trình duyệt người dùng - fingerprint
        const currentRole = req.header('current-role');
        if(!ObjectId.isValid(currentRole)) throw ({ msg: "ROLE_INVALID"}); //trả về lỗi nếu current role là một giá trị không xác định

        const role = await Role.findById(currentRole); //current role của người dùng

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
        if(verified.fingerprint !== fingerprint) throw ({ msg: 'FINGERPRINT_INVALID' }); // phát hiện lỗi client copy jwt và paste vào localstorage của trình duyệt để không phải đăng nhập

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
            if(!company.active){ //dịch vụ của công ty người dùng đã tạm dừng
                const resetUser = await User.findById(req.user._id);
                resetUser.token = []; //đăng xuất tất cả các phiên đăng nhập của người dùng khỏi hệ thống
                await resetUser.save();
                throw ({msg: 'SERVICE_OFF'});
            };
            
            /**
             * Kiểm tra xem current-role của người dùng có được phép truy cập vào trang này hay không?
             * Lấy đường link mà người dùng đã truy cập 
             * Sau đó check trong bảng privilege xem có tồn tại cặp value tương ứng giữa current-role của user với đường link của trang 
             * Nếu tìm thấy dữ liệu -> Cho phép truy cập tiếp
             * Ngược lại thì trả về thông báo lỗi không có quyền truy cập vào trang này
             */
            var origin = JSON.stringify(req.headers.origin);//host của bên client VD: http://localhost:3000
            var referer = JSON.stringify(req.headers.referer);//đường dẫn mà client đang truy cập VD: http://localhost:3000/manage-user
            var url = referer.substr(origin.length - 1, referer.length - origin.length);
            const link = await Link.findOne({
                url,
                company: req.user.company._id 
            });
            const roleArr = [roleId].concat(role.parents);
            const privilege = await Privilege.findOne({
                resourceId: link._id,
                resourceType: 'Link',
                roleId: { $in: roleArr }
            });
            if(privilege === null) throw ({ msg: 'PAGE_ACCESS_DENIED' });
        }

        next();
        
    } catch (error) {
        console.log("ERROR: ",error);   
        res.status(400).json(error);
    }   
}
