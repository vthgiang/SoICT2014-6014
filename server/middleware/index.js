const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const UserRole = require('../models/user_role.model');
const Privilege = require('../models/privilege.model');
const Link = require('../models/link.model');
const Company = require('../models/company.model');
var ObjectId = require('mongoose').Types.ObjectId;
const {data, checkServicePermission} = require('./servicesPermission');


/**
 * ****************************************
 * Middleware xác thực truy cập người dùng
 * 1.Kiểm tra người dùng đã xác thực
 * 2.Kiểm tra xem JWT của người dùng có hợp lệ hay không? (đang được sử dụng, cùng fingerprint?...)
 * 3.Kiểm tra xem người dùng có role hợp lệ hay không?
 * 4.Kiểm tra người dùng có được phép truy cập vào link hay không?
 * ****************************************
 */
exports.auth = async (req, res, next) => {
    try {
        const token = req.header('auth-token');//JWT nhận từ người dùng
        /**
         * Nếu không có JWT được gửi lên -> người dùng chưa đăng nhập
         */
        if(!token) throw ({ message: 'access_denied' });

        /**
         * Giải mã token gửi lên để check dữ liệu trong token
         */
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; 
        req.token = token;

        if(process.env.DEVELOPMENT !== 'true'){
            
            const fingerprint = req.header('fingerprint'); //chữ ký của trình duyệt người dùng - fingerprint
            const currentRole = req.header('current-role');
            if(!ObjectId.isValid(currentRole)){
                throw ({ message: "role_invalid"}); //trả về lỗi nếu current role là một giá trị không xác định
            }

            const role = await Role.findById(currentRole); //current role của người dùng
            if(role === null) throw ({ message: "role_invalid"});
            // console.log("CURRENT ROLE: ", role);
            /**
             * So sánh  fingerprint trong token với fingerprint được gửi lên từ máy của người dùng
             * Nếu hai fingerprint này giống nhau -> token được tạo ra và gửi đi từ cùng một trình duyệt trên cùng 1 thiết bị
             * Nếu hai fingerprint này khác nhau -> token đã bị lấy cắp và gửi từ một trình duyệt trên thiết bị khác
             */
            // console.log("fingerprint 1 : ", verified.fingerprint);
            // console.log("fingerprint 2 : ", fingerprint);
            if(verified.fingerprint !== fingerprint) throw ({ message: 'fingerprint_invalid' }); // phát hiện lỗi client copy jwt và paste vào localstorage của trình duyệt để không phải đăng nhập

            /**
             * Kiểm tra xem token có còn hoạt động hay không ?
             * Nghĩa là JWT chỉ được coi là hoạt động nếu như nó vẫn còn được lưu lại trong CSDL của người dùng.
             * Nếu như người tạo ra JWT này đã đăng xuất thì JWT này sẽ được xóa đi khỏi CSDL của người dùng.
             * Lần đăng nhập sau server sẽ tạo ra một JWT mới khác cho người dùng
             */
            var userToken = await User.findOne({ _id: req.user._id,  token: token });
            if(userToken === null) throw ({ message: 'acc_log_out'});
            // console.log("usertoken: ", userToken);

            /**
             * Kiểm tra xem current role có đúng với người dùng hay không?
             */
            // const roleId = role._id;
            const userId = req.user._id;
            // console.log("userid: ", userId)
            // console.log("userrole1: ", role._id, userId);
            const userrole = await UserRole.findOne({userId, roleId: role._id});
            if(userrole === null) throw ({ message: 'user_role_invalid'});
            // console.log("userrole2: ", userrole);
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
                    throw ({ message: 'service_off'});
                };
            }

            /**
             * Kiểm tra xem current-role của người dùng có được phép truy cập vào trang này hay không?
             * Lấy đường link mà người dùng đã truy cập 
             * Sau đó check trong bảng privilege xem có tồn tại cặp value tương ứng giữa current-role của user với đường link của trang 
             * Nếu tìm thấy dữ liệu -> Cho phép truy cập tiếp
             * Ngược lại thì trả về thông báo lỗi không có quyền truy cập vào trang này
             */

            //var url = req.headers.referer.substr(req.headers.origin.length, req.headers.referer.length - req.headers.origin.length);
            var url = req.header('current-page');
            // console.log("trang web hiện tại người dùng đang truy cập: ", url);
            // console.log("ROLE NAME:", role.name, req.user.company._id);
            const link = role.name !== 'System Admin' ?
                await Link.findOne({
                    url,
                    company: req.user.company._id 
                }) :
                await Link.findOne({
                    url
                });
            // console.log("LINK ACCESS: ", link);
            if(link === null) throw ({ message: 'url_invalid'});
            const roleArr = [currentRole].concat(role.parents);
            // console.log("ROLE ARR: ", roleArr);
            const privilege = await Privilege.findOne({
                resourceId: link._id,
                resourceType: 'Link',
                roleId: { $in: roleArr }
            });
            if(privilege === null) throw ({ message: 'page_access_denied' });

            /**
             * Kiểm tra xem user này có được gọi tới service này hay không?
             */
            const path = req.route.path !== '/' ? req.baseUrl + req.route.path : req.baseUrl;
            const checkSP = await checkServicePermission(data, path, req.method, currentRole);
            if(!checkSP) throw ({ message: 'service_permission_invalid'});

        }

        // console.log("Xác thực qua authmiddle thành công!-> Bắt đầu thực hiện service")
        next();
        
    } catch (error) { 
        res.status(400).json({
            success: false,
            message: error.message !== undefined ? error.message : 'call_api_faile',
            content: error
        });
    }   
}


/**
 * ************************************************************************
 * Middleware bắt các lỗi xảy ra, console trên server và trả về cho client
 * 1. Các lỗi do client thao tác sai với server
 * 2. Các lỗi xảy ngoài ý muốn do khi server chạy 
 * ************************************************************************
 */
// exports.auth = async (err) => {
//     res.status(400).json(err);
// }