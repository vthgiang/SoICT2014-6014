const jwt = require("jsonwebtoken");
const Models = require('../models');
const { User, Role, UserRole, Privilege, Link, Company, PrivilegeApi, SystemApi, Delegation } = Models;
const ObjectId = require("mongoose").Types.ObjectId;
const { links } = require("./servicesPermission");
const multer = require("multer");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const { initModels, connect } = require(`../helpers/dbHelper`);
const { decryptMessage } = require('../helpers/functionHelper');
const { compareDate } = require('../helpers/functionHelper');
const rateLimit = require("express-rate-limit");
const DelegationService = require("../modules/delegation/delegation.service");
const pushLog = false;

/**
 * ****************************************
 * Middleware xác thực truy cập người dùng
 * 1.Kiểm tra người dùng đã xác thực
 * 2.Kiểm tra xem JWT của người dùng có hợp lệ hay không? (đang được sử dụng, cùng fingerprint?...)
 * 3.Kiểm tra xem người dùng có role hợp lệ hay không?
 * 4.Kiểm tra người dùng có được phép truy cập vào link hay không?
 * ****************************************
 */

exports.authFunc = (checkPage = true) => {
    return async (req, res, next) => {
        try {
            /**
             * 2 types of utk:
             * - token được tạo cho phiên đăng nhập của người dùng
             * - token cho phép người dùng dùng previlegeAPI
             */

            const token = req.header("utk"); //JWT nhận từ người dùng
            if (!token) throw ["access_denied_4001"];

            /**
             * Giải mã token gửi lên để check dữ liệu trong token
             */
            let verified;
            try {
                verified = await jwt.verify(token, process.env.TOKEN_SECRET);
            } catch (error) {
                throw ["access_denied_4002"];
            }

            req.user = verified;
            req.token = token;
            req.thirdParty = verified.thirdParty;
            req.portal = req.thirdParty ? verified.portal : (!req.user.company
                ? process.env.DB_NAME
                : req.user.company.shortName);

            /**
             * Check service được gọi từ bên thứ 3 hay từ ứng dụng dxclan
             * Nếu được gọi từ bên thứ 3: thirdParty = true
             */

            if (!req.thirdParty) {
                /**
                 * 1. Trường hợp service được gọi từ ứng dụng dxclan
                 */

                // Kiểm tra xem token có nằm trong mảng tokens model User
                if (req.user) {
                    const user = await User(
                        connect(DB_CONNECTION, req.portal)
                    ).findById(req.user._id).select("tokens");
                    let userParse = user.toObject();

                    const checkToken = userParse?.tokens?.find(element => element === req.token);
                    if (!checkToken)
                        throw ['access_denied_4003']
                }

                let crtp, crtr, fgp;

                if (process.env.DEVELOPMENT === "true") {
                    crtp = req.header("crtp");
                    crtr = req.header("crtr");
                    fgp = req.header("fgp");
                } else {
                    crtp = decryptMessage(req.header("crtp")); // trang hiện tại
                    crtr = decryptMessage(req.header("crtr")); // role hiện tại
                    fgp = decryptMessage(req.header("fgp")); // fingerprint
                }

                /**
                 * Xác định db truy vấn cho request
                 */
                initModels(connect(DB_CONNECTION, req.portal), Models);

                if (crtp !== "/") {
                    const fingerprint = fgp; //chữ ký của trình duyệt người dùng - fingerprint
                    const currentRole = crtr; // role hiện tại của người dùng
                    if (!ObjectId.isValid(currentRole)) {
                        throw ["role_invalid"]; //trả về lỗi nếu current role là một giá trị không xác định
                    }
                    req.currentRole = currentRole;

                    const role = await Role(connect(DB_CONNECTION, req.portal))
                        .findById(currentRole); //current role của người dùng
                    if (role === null) throw ["role_invalid"];

                    /**
                     * So sánh  fingerprint trong token với fingerprint được gửi lên từ máy của người dùng
                     * Nếu hai fingerprint này giống nhau -> token được tạo ra và gửi đi từ cùng một trình duyệt trên cùng 1 thiết bị
                     * Nếu hai fingerprint này khác nhau -> token đã bị lấy cắp và gửi từ một trình duyệt trên thiết bị khác
                     */
                    // if (verified.fingerprint !== fingerprint)
                    //     throw ["fingerprint_invalid"]; // phát hiện lỗi client copy jwt và paste vào localstorage của trình duyệt để không phải đăng nhập

                    /**
                     * Kiểm tra xem current role có đúng với người dùng hay không?
                     */
                    const userId = req.user._id;
                    const userrole = await UserRole(connect(DB_CONNECTION, req.portal)).findOne({ userId, roleId: role._id });
                    if (userrole === null) throw ["user_role_invalid"];

                    /**
                     * Kiểm tra công ty của người dùng có đang được kích hoạt hay không?
                     */
                    /**
                     * Riêng đối với system admin của hệ thống thì bỏ qua bước này
                     */
                    if (role.name !== "System Admin") {
                        const company = await Company(connect(DB_CONNECTION, process.env.DB_NAME)).findById(req.user.company._id);
                        if (!company.active) {
                            //dịch vụ của công ty người dùng đã tạm dừng
                            const resetUser = await User(
                                connect(DB_CONNECTION, req.portal)
                            ).findById(req.user._id);
                            resetUser.tokens = []; //đăng xuất tất cả các phiên đăng nhập của người dùng khỏi hệ thống
                            await resetUser.save();
                            throw ["service_off"];
                        }
                    }

                    /**
                     * Kiểm tra xem current-role của người dùng có được phép truy cập vào trang này hay không?
                     * 1. Kiểm tra xem thông tin 
                     * 2. Lấy đường link mà người dùng đã truy cập
                     * 3. Sau đó check trong bảng privilege xem có tồn tại cặp value tương ứng giữa current-role của user với đường link của trang
                     * 4. Nếu tìm thấy dữ liệu -> Cho phép truy cập tiếp
                     * 5. Ngược lại thì trả về thông báo lỗi không có quyền truy cập vào trang này
                     */

                    //const url = req.headers.referer.substr(req.headers.origin.length, req.headers.referer.length - req.headers.origin.length);
                    const url = crtp;
                    const device = req.header("device");

                    if (!device) {
                        if (checkPage) {
                            const link = role.name !== "System Admin" ?
                                await Link(connect(DB_CONNECTION, req.portal)).findOne({ url, deleteSoft: false }) :
                                await Link(connect(DB_CONNECTION, req.portal)).findOne({ url });

                            if (link === null) throw ["url_invalid"];
                            const roleArr = [role._id].concat(role.parents);
                            const privilege = await Privilege(connect(DB_CONNECTION, req.portal)).findOne({
                                resourceId: link._id,
                                resourceType: "Link",
                                roleId: {
                                    $in: roleArr,
                                }
                            });
                            // Kiểm tra nếu privilege có policy thì phải có policy map ở bên userrole thì mới được phép truy cập trang đó
                            // Nếu không tồn tại map thì không được truy cập
                            if (privilege.policies.length > 0) {
                                if (userrole.policies.length > 0) {
                                    if (!privilege.policies.some(policy => userrole.policies.includes(policy))) throw ["page_access_denied"]
                                }
                                else throw ["page_access_denied"]
                            }
                            if (userrole.delegation) {

                                // Nếu tồn tại ủy quyền đang hoạt động có endDate < now, re login

                                const delegation = await Delegation(connect(DB_CONNECTION, req.portal)).findOne({ _id: userrole.delegation, status: 'activated', delegateType: "Role" })
                                if (delegation.endDate != null && compareDate(delegation.endDate, new Date()) < 0) {
                                    throw ["page_access_denied"]
                                }


                                // Log delegation truy cập trang
                                if (delegation) {
                                    // Log nếu mỗi lần truy cập cách nhau > 5s
                                    if ((!delegation.logs || delegation.logs.length == 0) || (delegation.logs.length > 0 && ((new Date()).getTime() - (new Date(delegation.logs[delegation.logs.length - 1].createdAt)).getTime()) / 1000 > 5)) {

                                        await Delegation(connect(DB_CONNECTION, req.portal)).updateOne({ _id: delegation._id }, {
                                            logs: [
                                                ...delegation.logs,
                                                {
                                                    createdAt: new Date(),
                                                    user: userId,
                                                    content: link.url + " - " + link.description,
                                                    time: new Date(),
                                                    category: "page_access"
                                                }
                                            ]
                                        })
                                    }


                                }

                                if (privilege.delegations.length > 0) {
                                    if (!privilege.delegations.some(delegation => userrole.delegation.toString() == delegation.toString())) {
                                        throw ["page_access_denied"]
                                    }


                                }
                            }

                            // Nếu tồn tại ủy quyền chờ xác nhận có startDate < now, re login
                            const delegationPending = await Delegation(connect(DB_CONNECTION, req.portal)).find({ delegatee: req.user._id, status: 'pending', delegateType: "Role" })
                            delegationPending.every(delegation => {
                                if (delegation.startDate != null && compareDate(delegation.startDate, new Date()) < 0) {
                                    throw ["page_access_denied"]
                                }
                            })


                            if (privilege === null) throw ["page_access_denied"];
                        }

                        /**
                        * Kiểm tra xem với trang truy cập là như trên thì trang này có được truy cập vào API này không
                        */
                        const apiCalled = req.route.path !== "/" ? req.baseUrl + req.route.path : req.baseUrl;
                        const perLink = links.find(l => l.url === url);
                        if (!perLink) throw ['url_invalid_permission']
                        if (perLink.apis[0] !== '@all') {
                            const perAPI = perLink.apis.some(api => api.path === apiCalled && api.method === req.method);
                            if (!perAPI) throw ['api_permission_invalid'];
                        }
                    }
                }
            } else {
                /**
                 * 2. Trường hợp service được gọi từ bên thứ 3
                 */
                console.log('### API ARE CALLED FROM THIRD PARTY');

                const apiCalled = req.route.path !== "/" ? req.baseUrl + req.route.path : req.baseUrl;

                let systemApi = await SystemApi(connect(DB_CONNECTION, process.env.DB_NAME))
                    .findOne({
                        path: apiCalled.toString(),
                        method: req.method.toString()
                    })
                if (!systemApi) throw ['api_invalid']

                // Kiểm tra quyền truy cập api của bên thứ 3
                let privilegeApi = await PrivilegeApi(connect(DB_CONNECTION, req.portal))
                    .findOne({
                        token,
                        // email: verified.email,
                        apis: {
                            $elemMatch: {
                                path: apiCalled.toString(),
                                method: req.method.toString()
                            }
                        },
                        // company: verified.company,
                        status: 3
                    })

                if (!privilegeApi) {
                    throw ['api_permission_invalid']
                }

                // Kiểm tra phân quyền api cho 1 cty
                // let apiInCompany = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
                //     .findOne({
                //         apis: {
                //             $in: [systemApi?._id]
                //         },
                //         shortName: req.portal,
                //         // company: verified.company
                //     })

                //     if (!apiInCompany) {
                //     throw ['api_permission_to_company_invalid']
                // };

                req.user.company = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
                    .findOne({ company: verified.company });

                console.log('### THIRD PARTY ARE AUTHORIZED');
            }

            next();
        } catch (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                messages: Array.isArray(error) ? error : ['auth_error'],
                content: error
            });
        }
    };
};
exports.auth = this.authFunc();


exports.verifyTokenFunc = () => {
    return async (req, res, next) => {
        try {
            /**
             * 2 types of utk:
             * - token được tạo cho phiên đăng nhập của người dùng
             * - token cho phép người dùng dùng previlegeAPI
             */

            const token = req.header("utk"); //JWT nhận từ người dùng
            if (!token) throw ["access_denied_4001"];

            /**
             * Giải mã token gửi lên để check dữ liệu trong token
             */
            let verified;
            try {
                verified = jwt.verify(token, process.env.TOKEN_SECRET);
            } catch (error) {
                throw ["access_denied_4002"];
            }

            req.user = verified;
            req.token = token;
            req.thirdParty = verified.thirdParty;
            req.portal = req.thirdParty ? verified.portal : (!req.user.company
                ? process.env.DB_NAME
                : req.user.company.shortName);

            if (!req.thirdParty) {
                /**
                 * 1. Trường hợp service được gọi từ ứng dụng dxclan
                 */

                // Kiểm tra xem token có nằm trong mảng tokens model User
                if (req.user) {
                    const user = await User(
                        connect(DB_CONNECTION, req.portal)
                    ).findById(req.user._id).select("tokens");
                    let userParse = user.toObject();

                    const checkToken = userParse?.tokens?.find(element => element === req.token);
                    if (!checkToken)
                        throw ['access_denied_4003']
                }
            } else {
                /**
                 * 2. Trường hợp service được gọi từ bên thứ 3
                 */
                console.log('### API ARE CALLED FROM THIRD PARTY');

                // Kiểm tra xem token có nằm trong mảng tokens model Service
                if (req.user) {
                    const service = await Service(
                        connect(DB_CONNECTION, req.portal)
                    ).findById(req.user._id).select("tokens");
                    let serviceParse = service.toObject();

                    const checkToken = serviceParse?.tokens?.find(element => element === req.token);
                    if (!checkToken)
                        throw ['access_denied_4003']
                }

                console.log('### THIRD PARTY ARE AUTHORIZED');
            }

            next();
        } catch (error) {
            console.log(error)
            res.status(400).json({
                success: false,
                messages: Array.isArray(error) ? error : ['auth_error'],
                content: error
            });
        }
    };
};
exports.verifyToken = this.verifyTokenFunc();
/**
 * Middleware check và lấy dữ liệu về file mà client người đến
 * @arrData : mảng các đối tượng chứa name - tên của thuộc tính lưu dữ liệu file
 * trong data mà client gửi lên, path - đường dẫn đến thư mục muốn lưu file
 * @type: kiểu upload file (single, array, fields)
 */
exports.uploadFile = (arrData, type) => {
    const staticPath = ["/avatars"];
    var name, arrFile;
    // Tạo folder chứa file khi chưa có folder
    const checkExistUploads = async (portal) => {
        if (portal !== undefined)
            return await arrData.forEach((x) => {
                if (staticPath.indexOf(x.path) !== -1) {
                    let dir2 = `./upload/${x.path}/${portal}`;
                    if (!fs.existsSync(dir2)) {
                        fs.mkdirSync(dir2, {
                            recursive: true,
                        });
                    }
                } else {
                    let dir = `./upload/private/${portal}${x.path}`;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, {
                            recursive: true,
                        });
                    }
                }
            });
    };

    const getFile = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                checkExistUploads(req.portal);

                if (type === "single" || type === "array") {
                    if (staticPath.indexOf(arrData[0].path) !== -1) {
                        cb(null, `./upload${arrData[0].path}/${req.portal}`);
                    } else {
                        cb(
                            null,
                            `./upload/private/${req.portal}${arrData[0].path}`
                        );
                    }
                } else if (type === "fields") {
                    for (let n in arrData) {
                        if (file.fieldname === arrData[n].name) {
                            if (staticPath.indexOf(arrData[n].path) !== -1) {
                                cb(
                                    null,
                                    `./upload${arrData[n].path}/${req.portal}`
                                );
                            } else {
                                cb(
                                    null,
                                    `./upload/private/${req.portal}${arrData[n].path}`
                                );
                            }
                            break;
                        }
                    }
                }
            },
            filename: function (req, file, cb) {
                let extend = file.originalname.split(".");
                let oldNameFile = extend.splice(0, extend.length - 1);
                oldNameFile = oldNameFile.join(".");
                let hash =
                    `${req.user._id}_${Date.now()}_` +
                    CryptoJS.MD5(oldNameFile).toString();
                cb(null, `${hash}.${extend[extend.length - 1]}`);
            },
        }),
        limits: { fieldSize: 25 * 1024 * 1024 }
    });

    switch (type) {
        case "single":
            name = arrData[0].name;
            return getFile.single(name);
        case "array":
            name = arrData[0].name;
            return getFile.array(name, 20);
        case "fields":
            arrFile = arrData.map((x) => {
                return {
                    name: x.name,
                    maxCount: 20,
                };
            });
            return getFile.fields(arrFile);
        default:
            break;
    }
};

exports.uploadBackupFiles = (options) => {
    // 1. Tạo folder backup/all nếu chưa tồn tại -> tạo folder backup/all/'version'/data
    // 2. copy file được gửi lên vào backup/all/'version'/data
    const getFile = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                const time = new Date(),
                    month = time.getMonth() + 1,
                    date = time.getDate(),
                    year = time.getFullYear(),
                    hour = time.getHours(),
                    minute = time.getMinutes(),
                    second = time.getSeconds();

                const version = `${year}.${month}.${date}.${hour}.${minute}.${second}`;
                let path;
                if (options.db) {
                    path = `${SERVER_BACKUP_DIR}/${req.portal}/${version}/data`;
                } else {
                    path = `${SERVER_BACKUP_DIR}/all/${version}/data`;
                }
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path, {
                        recursive: true
                    });
                }
                console.log(`create ${version} in multer`)
                cb(null, path)
            },
            filename: function (req, file, cb) {
                let extend = file.originalname.split(".");
                let oldNameFile = extend.splice(0, extend.length - 1);
                oldNameFile = oldNameFile.join(".");
                let hash =
                    `${req.user._id}_${Date.now()}_` +
                    CryptoJS.MD5(oldNameFile).toString();
                let fileName = `${hash}.${extend[extend.length - 1]}`;
                cb(null, fileName);
            },
        }),
    });

    return getFile.single('files');
}
/**
 * Middleware kiểm tra userId gửi trong param có trùng với userId lưu trong jwt
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authTrueOwner = async (req, res, next) => {
    try {
        const token = req.header("utk"); //JWT nhận từ người dùng
        if (!token) throw ["access_denied_4004"];
        let verified;
        try {
            verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            throw ["access_denied_4005"];
        }

        let userIdJwt = verified._id; // id người dùng lấy từ jwt
        let userIdParam = req.params.userId; // id người dùng trong params

        if (userIdJwt !== userIdParam) { // người gửi yêu cầu không phải chủ nhân thật sự của tài khoản
            throw ['access_denied_4006'];
        }

        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            messages: err,
        });
    }
}

/**
 * Middleware kiểm tra người dùng có là admin/super admin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authAdminSuperAdmin = async (req, res, next) => {
    try {
        const token = req.header("utk"); //JWT nhận từ người dùng
        if (!token) throw ["access_denied_4007"];
        let verified;
        try {
            verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (error) {
            throw ["access_denied_4008"];
        }

        let userId = verified._id; // id người dùng lấy từ jwt

        // check nếu như người gửi yêu cầu là super admin hoặc admin thì cho phép gọi api
        let portal = !verified.company
            ? process.env.DB_NAME
            : verified.company.shortName;
        initModels(connect(DB_CONNECTION, req.portal), Models);

        let ad = await Role(connect(DB_CONNECTION, portal)).find({
            name: { $in: ['Super Admin', 'Admin'] }
        });
        if (ad.length === 0) throw ['access_denied_4009'];

        // Check người gửi request có quyền là SuperAdmin, Admin hay không?
        let userrole = await UserRole(connect(DB_CONNECTION, portal)).find({
            userId,
            roleId: { $in: ad.map(r => r._id) }
        });

        if (userrole.length === 0) throw ['access_denied_4010'];

        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            messages: err,
        });
    }
}

/**
 * Giới hạn số request tới api trong 1 khoang thời gian
 * @param {*} windowMs khoản thời gian (phút)
 * @param {*} maxRequest Số request tối đa
 * @param {*} message 
 * @returns 
 */
exports.rateLimitRequest = (windowMs = 60, maxRequest = 100, message) => { // mặc định trong vòng 1 tiếng chỉ cho phép tối đa 100 request tới api
    const createAccountLimiter = rateLimit({
        windowMs: windowMs * 60 * 1000, //  hour window
        max: maxRequest, // start blocking after maxRequest requests
        message: "Too many accounts created from this IP, please try again after an hour",
        handler: (req, res, next) => res.status(429).json({
            success: false,
            messages: message ? [message] : ["Too many accounts created from this IP, please try again after an hour"]
        }),
    });
    return createAccountLimiter;
}