const mongoose = require("mongoose");
const {
    OrganizationalUnit,
    User,
    UserRole,
    Role,
    Company,
    Employee
} = require(`../../../models`);
const bcrypt = require("bcryptjs");
const generator = require("generate-password");
const OrganizationalUnitService = require(`../../super-admin/organizational-unit/organizationalUnit.service`);
const { connect } = require(`../../../helpers/dbHelper`);
const { sendEmail } = require("../../../helpers/emailHelper");

/**
 * Lấy danh sách tất cả user trong 1 công ty
 * @company id của công ty
 */
exports.getUsers = async (portal, company, query) => {
    var page = query.page;
    var limit = query.limit;
    var name = query.name;
    var userRole = query.userRole;
    var departmentIds = query.departmentIds;
    var departmentIds = query.departmentIds;
    var unitId = query.unitId;

    var keySearch = {};
    if (!page && !limit && !userRole && !departmentIds && !unitId) {
        if (name) {
            keySearch = {
                ...keySearch,
                name: {
                    $regex: name,
                    $options: "i",
                },
            };

            let searchUses = await User(connect(DB_CONNECTION, portal))
                .find(keySearch)
                .select("-password -password2 -status -deleteSoft -tokens")
                .populate([
                    {
                        path: "roles",
                        populate: {
                            path: "roleId",
                        },
                    },
                ]);

            return {
                searchUses,
            };
        } else {
            return await User(connect(DB_CONNECTION, portal))
                .find()
                .select("-password -password2 -status -deleteSoft -tokens")
                .populate([
                    {
                        path: "roles",
                        populate: {
                            path: "roleId",
                        },
                    },
                ]);
        }
    } else if (page && limit && !userRole && !departmentIds && !unitId) {
        const option =
            query.key && query.value
                ? Object.assign(
                    {},
                    {
                        [`${query.key}`]: new RegExp(query.value, "i"),
                    }
                )
                : {};

        return await User(connect(DB_CONNECTION, portal)).paginate(option, {
            page,
            limit,
            select: "-tokens -status -password -deleteSoft",
            populate: [
                {
                    path: "roles",
                    populate: {
                        path: "roleId",
                    },
                },
            ],
        });
    } else if (!page && !limit && (userRole || departmentIds) && !unitId) {
        if (userRole) {
            let department = await OrganizationalUnit(
                connect(DB_CONNECTION, portal)
            ).findOne({
                $or: [
                    {
                        managers: userRole,
                    },
                    {
                        deputyManagers: userRole,
                    },
                    {
                        employees: userRole,
                    },
                ],
            });
            if (department) {
                return _getAllUsersInOrganizationalUnit(portal, department);
            }
        } else {
            let departments = await OrganizationalUnit(
                connect(DB_CONNECTION, portal)
            ).find({
                _id: {
                    $in: departmentIds,
                },
            });

            let users = await _getAllUsersInOrganizationalUnits(
                portal,
                departments
            );

            return users;
        }
    } else if (unitId) {
        return getAllUserInUnitAndItsSubUnits(portal, unitId);
    }
};

exports.getAllEmployeeOfUnitByRole = async (portal, role) => {
    let organizationalUnit = await OrganizationalUnit(
        connect(DB_CONNECTION, portal)
    ).findOne({
        $or: [
            {
                managers: {
                    $in: role,
                },
            },
            {
                deputyManagers: {
                    $in: role,
                },
            },
            {
                employees: {
                    $in: role,
                },
            },
        ],
    });

    let employees;
    if (organizationalUnit) {
        employees = await UserRole(connect(DB_CONNECTION, portal))
            .find({
                roleId: {
                    $in: organizationalUnit.employees,
                },
            })
            .populate("userId roleId");
    }

    return employees;
};

/**
 * Lấy tất cả nhân viên theo mảng id đơn vị
 * @id Mảng id các đơn vị
 */
exports.getAllEmployeeOfUnitByIds = async (portal, query) => {
    let { ids, page, perPage } = query;

    let employees = [], roles = [], countDocument;
    let organizationalUnits = await OrganizationalUnit(connect(DB_CONNECTION, portal))
        .find({
            '_id': { $in: ids.map(item => mongoose.Types.ObjectId(item)) }
        })

    for(let i = 0; i < organizationalUnits.length; i++) {
        roles = [
            ...roles,
            ...organizationalUnits[i].employees,
            ...organizationalUnits[i].managers,
            ...organizationalUnits[i].deputyManagers
        ]
    }

    let keyQuery = [
        { $match: {
            'roleId': { $in: roles }
        }},

        { $group: { 
            '_id': '$userId',
            'user': { $push: "$$ROOT" }
        }},

        { $lookup: {
            "from": "organizationalunits",
            "let": { "roleId": "$user.roleId" },
            "pipeline": [
                { $match: {
                    $expr: {
                        $or: [
                            { $eq: [ "$managers",  "$$roleId" ] },
                            { $eq: [ "$deputyManagers",  "$$roleId" ] },
                            { $eq: [ "$employees",  "$$roleId" ] }
                        ]
                    }
                }},
            ],
            "as": "organizationalUnit"
        }}
    ]
    let keyCountDocument = [
        ...keyQuery, 
        {
            $count: "totalEmployee"
        }
    ];

    if (perPage >= 0) {
        perPage = Number(perPage);
        if (page) {
            page = Number(page);
            keyQuery = [
                ...keyQuery,
                { $skip: perPage * (page - 1) },
                { $limit: perPage }
            ]
        } else {
            keyQuery = [
                ...keyQuery,
                { $limit: perPage }
            ]
        }
    }

    employees = await UserRole(connect(DB_CONNECTION, portal)).aggregate(keyQuery)

    employees = employees.map(item => {
        let roleId = item?.user?.map(item => item?.roleId)

        if (item?.user?.[0]) {
            item.user[0].idUnit = item?.organizationalUnit?.[0]?._id
            item.user[0].roleId = roleId
            return item.user[0]
        }
    });
    await User(connect(DB_CONNECTION, portal)).populate(employees, { path: "userId" });
    await Role(connect(DB_CONNECTION, portal)).populate(employees, { path: 'roleId', populate: { path: "parents" } });
    countDocument = await UserRole(connect(DB_CONNECTION, portal)).aggregate(keyCountDocument);
    let totalEmployee = countDocument?.[0]?.totalEmployee;
    let totalPage = totalEmployee && perPage ? Math.ceil(totalEmployee / perPage) : 1;

    return {
        employees,
        totalEmployee,
        totalPage
    };
};

/**
 * Lấy tất cả các người dùng trong  đơn vị và trong các đơn vị con của nó
 * @getAllUserInCompany = true khi muốn lấy tất cả người dùng trong tất cả đơn vị của 1 công ty
 * @id Id công ty
 * @unitID Id của của đơn vị cần lấy đơn vị con
 */
getAllUserInUnitAndItsSubUnits = async (portal, unitId) => {
    //Lấy tất cả các đơn vị con của 1 đơn vị
    var data;

    if (unitId !== "-1") {
        var organizationalUnit = await OrganizationalUnit(
            connect(DB_CONNECTION, portal)
        ).findById(unitId);
        // TODO: tối ưu hóa OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree

        data = await OrganizationalUnitService.getChildrenOfOrganizationalUnitsAsTree(
            portal,
            organizationalUnit.managers[0]
        );

        var queue = [];
        var departments = [];
        //BFS tìm tât cả đơn vị con-hàm của Đức
        departments.push(data);
        queue.push(data);

        while (queue.length > 0) {
            var v = queue.shift();
            if (v && v.children) {
                for (var i = 0; i < v.children.length; i++) {
                    var u = v.children[i];
                    queue.push(u);
                    departments.push(u);
                }
            }
        }
        //Lấy tất cả user của từng đơn vị
        var userArray = [];
        userArray = await _getAllUsersInOrganizationalUnits(
            portal,
            departments
        );
        return userArray;
    } else {
        //Lấy tất nhan vien trong moi đơn vị trong công ty
        const allUnits = await OrganizationalUnit(
            connect(DB_CONNECTION, portal)
        ).find(); // { company: id }
        const newData = allUnits.map((department) => {
            return {
                id: department._id.toString(),
                name: department.name,
                description: department.description,
                managers: department.managers.map((item) => item.toString()),
                deputyManagers: department.deputyManagers.map((item) => item.toString()),
                employees: department.employees.map((item) => item.toString()),
                parent_id:
                    department.parent !== null && department.parent !== undefined
                        ? department.parent.toString()
                        : null,
            };
        });

        let tmp = await _getAllUsersInOrganizationalUnits(portal, newData);
        return tmp;
    }
};

/**
 * Lấy thông tin user theo id
 * @id id của user
 */
exports.getUser = async (portal, id) => {
    var user = await User(connect(DB_CONNECTION, portal))
        .findById(id)
        .select("-password -password2 -status -deleteSoft -tokens")
        .populate([
            {
                path: "roles",
                populate: {
                    path: "roleId",
                },
            },
            {
                path: "company",
            },
        ]);

    if (!user) {
        throw ["user_not_found"];
    }

    return user;
};

/**
 * Lấy tất cả các đơn vị tổ chức một user thuộc về
 * @userId id của user
 */
exports.getOrganizationalUnitsOfUser = async (portal, userId) => {
    const roles = await UserRole(connect(DB_CONNECTION, portal)).find({
        userId,
    });
    const newRoles = roles.map((role) => role.roleId.toString());
    const departments = await OrganizationalUnit(
        connect(DB_CONNECTION, portal)
    ).find({
        $or: [
            {
                managers: {
                    $in: newRoles,
                },
            },
            {
                deputyManagers: {
                    $in: newRoles,
                },
            },
            {
                employees: {
                    $in: newRoles,
                },
            },
        ],
    });

    return departments;
};

/**
 * Tạo tài khoản cho user
 * @data dữ liệu về user
 * @portal portal của db
 */
exports.createUser = async (portal, data, company) => {
    var salt = bcrypt.genSaltSync(10);
    var password = generator.generate({
        length: 10,
        numbers: true,
    });
    var hash = bcrypt.hashSync(password, salt);

    if (!data.email)
        throw ['email_empty'];
    
    if (!data.name)
        throw ['username_empty'];
    
    var checkUser = await User(connect(DB_CONNECTION, portal)).findOne({
        email: data.email.trim(),
    });

    if (checkUser) {
        throw ["email_exist"];
    }

    var user = await User(connect(DB_CONNECTION, portal)).create({
        name: data.name.trim(),
        email: data.email.trim(),
        password: hash,
        company: company,
    });

    await this.sendMailAboutCreatedAccount(data.email, password, portal);

    return user;
};

/**
 * Gửi email thông báo đã tạo tài khoản thành công
 * @email người nhận
 * @password của tài khoản đó
 */
exports.sendMailAboutCreatedAccount = async (email, password, portal) => {
    let subject = "Xác thực tạo tài khoản trên hệ thống quản lý công việc";
    let text = "Yêu cầu xác thực tài khoản đã đăng kí trên hệ thống với email là : " + email;
    let html = `<html>
                <head>
                    <style>
                        .wrapper {
                            width: 100%;
                            min-width: 580px;
                            background-color: #FAFAFA;
                            padding: 10px 0;
                        }
                
                        .info {
                            list-style-type: none;
                        }
                
                        @media screen and (max-width: 600px) {
                            .form {
                                border: solid 1px #dddddd;
                                padding: 50px 30px;
                                border-radius: 3px;
                                margin: 0px 5%;
                                background-color: #FFFFFF;
                            }
                        }
                
                        .form {
                            border: solid 1px #dddddd;
                            padding: 50px 30px;
                            border-radius: 3px;
                            margin: 0px 25%;
                            background-color: #FFFFFF;
                        }
                
                        .title {
                            text-align: center;
                        }
                
                        .footer {
                            margin: 0px 25%;
                            text-align: center;
                
                        }
                    </style>
                </head>
                
                <body>
                    <div class="wrapper">
                        <div class="title">
                            <h1>${process.env.WEB_NAME}</h1>
                        </div>
                        <div class="form">
                            <p><b>Thông tin tài khoản đăng nhập của bạn: </b></p>
                            <div class="info">
                                <li>Portal: ${portal}</li>
                                <li>Tài khoản: ${email}</li>
                                <li>Mật khẩu: <b>${password}</b></li>
                            </div>
                            <p>Đăng nhập ngay tại: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p><br />
                
                            <p><b>Your account information: </b></p>
                            <div class="info">
                                <li>Portal: ${portal}</li>
                                <li>Account: ${email}</li>
                                <li>Password: <b>${password}</b></li>
                            </div>
                            <p>Login in: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>
                        </div>
                        <div class="footer">
                            <p>Copyright by
                                <i>Công ty Cổ phần Công nghệ
                                    <br />
                                    An toàn thông tin và Truyền thông Việt Nam</i>
                            </p>
                        </div>
                    </div>
                </body>
        </html>`;
    return await sendEmail(email, subject, text, html);
};

/**
 * Gửi email thông báo thay đổi email tài khoản hiện tại
 * @oldEmail email cũ
 * @newEmail email mới
 */
exports.sendMailAboutChangeEmailOfUserAccount = async (oldEmail, newEmail) => {
    let subject = "Xác thực thay đổi email";
    let text = `Chuyển đổi email từ [${oldEmail}] => [${newEmail}] `;
    let html = "<p>Tài khoản dùng để đăng nhập của bạn là : </p>" +
        "<ul>" +
        "<li>Email cũ :" +
        oldEmail +
        "</li>" +
        "<li>Email mới :" +
        newEmail +
        "</li>" +
        "</ul>" +
        "<p>Your account use to login in system : </p>" +
        "<ul>" +
        "<li>Old email :" +
        oldEmail +
        "</li>" +
        "<li>New email :" +
        newEmail +
        "</li>" +
        "</ul>";
    
    return await sendEmail(newEmail, subject, text, html);
};

/**
 * Kiểm tra sự tồn tại của tài khoản
 * @email : email người dung
 */
exports.checkUserExited = async (portal, email) => {
    var user = await User(connect(DB_CONNECTION, portal)).findOne(
        {
            email: email,
        },
        {
            field1: 1,
        }
    );
    var checkUser = false;
    if (user) {
        checkUser = true;
    }
    return checkUser;
};

/**
 * Chỉnh sửa thông tin tài khoản người dùng
 * @id id tài khoản
 * @data dữ liệu chỉnh sửa
 */
exports.editUser = async (portal, id, data) => {
    if (!data.email)
        throw ['email_empty'];
    if (!data.name)
        throw ['username_empty'];
    var user = await User(connect(DB_CONNECTION, portal))
        .findById(id)
        .select("-password -password2 -status -deleteSoft")
        .populate([
            {
                path: "roles",
                populate: {
                    path: "roleId",
                },
            },
            {
                path: "company",
            },
        ]);

    const name = data.name.trim();
    const email = data.email.trim();
    if (!user) {
        throw ["user_not_found"];
    }

    if (user.email !== email) {
        const checkEmail = await User(connect(DB_CONNECTION, portal)).findOne({
            email: data.email,
        });
        if (checkEmail !== null) throw ["email_exist"];
        await this.sendMailAboutChangeEmailOfUserAccount(
            user.email,
            data.email
        );
    }
    user.name = name;

    if (data.password) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(data.password, salt);
        user.password = hash;
    }

    if (data.active) {
        user.active = data.active;
    }

    if (user.active === false) {
        user.tokens = [];
    }

    const oldEmail = user.email;
    user.email = email;
    await user.save();

    // Tìm user trong bảng employees và cập nhật lại email
    // Kiểm tra email mới đã có trong bảng Employees hay chưa.
    const employees = await Employee(connect(DB_CONNECTION, portal)).findOne({ emailInCompany: data.email });
    if (!employees)
        await Employee(connect(DB_CONNECTION, portal)).findOneAndUpdate({ emailInCompany: oldEmail }, { $set: { emailInCompany: data.email } });
    
    return user;
};

/**
 * Chỉnh sửa các role - phân quyền cho 1 user
 * @userId id user
 * @roleIdArr mảng id các role
 */
exports.editRolesForUser = async (portal, userId, roleIdArr) => {
    await UserRole(connect(DB_CONNECTION, portal)).deleteMany({
        userId,
    });
    var data = await roleIdArr.map((roleId) => {
        return {
            userId,
            roleId,
        };
    });
    var relationship = await UserRole(
        connect(DB_CONNECTION, portal)
    ).insertMany(data);

    return relationship;
};

/**
 * Xóa tài khoản người dùng
 * @id id tài khoản người dùng
 */
exports.deleteUser = async (portal, id) => {
    var deleteUser = await User(connect(DB_CONNECTION, portal)).deleteOne({
        _id: id,
    });
    await UserRole(connect(DB_CONNECTION, portal)).deleteOne({
        userId: id,
    });

    return deleteUser;
};

/**
 * Xóa tài khoản người dùng theo email
 * @email email tài khoản người dùng
 */
exports.deleteUserByEmail = async (portal, email) => {
    var deleteUser = await User(connect(DB_CONNECTION, portal)).findOneAndDelete({
        email: email,
    }, { $new: true });

    if (deleteUser)
        await UserRole(connect(DB_CONNECTION, portal)).deleteOne({
            userId: deleteUser._id,
        });

    return deleteUser;
};

/**
 * Thêm 1 hoặc nhiều role - phân quyền cho user
 * @userId id của user
 * @roleIdArr mảng id các role
 */
exports.addRolesForUser = async (portal, userId, roleIdArr) => {
    if (roleIdArr && roleIdArr.length > 0) {
        var data = await roleIdArr.map((roleId) => {
            return {
                userId,
                roleId,
            };
        });
        var relationship = await UserRole(
            connect(DB_CONNECTION, portal)
        ).insertMany(data);
    }

    return relationship;
};

/**
 * Hàm tiện ích dùng trong 2 service ở trên
 */
_getAllUsersInOrganizationalUnit = async (portal, department) => {
    var userRoles = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: {
                $in: [
                    ...department.managers,
                    ...department.deputyManagers,
                    ...department.employees,
                ],
            },
        })
        .populate({
            path: "userId",
            select: "name",
        });

    var tmp = await Role(connect(DB_CONNECTION, portal)).find(
        {
            _id: {
                $in: [
                    ...department.managers,
                    ...department.deputyManagers,
                    ...department.employees,
                ],
            },
        },
        {
            name: 1,
        }
    );
    var users = {
        managers: {},
        deputyManagers: {},
        employees: {},
        department: department.name,
        _id: department._id,
    };

    tmp.forEach((item) => {
        let obj = {};
        obj._id = item.id;
        obj.name = item.name;
        obj.members = [];

        if (department.managers.includes(item._id.toString())) {
            users.managers[item._id.toString()] = obj;
        } else if (department.deputyManagers.includes(item._id.toString())) {
            users.deputyManagers[item._id.toString()] = obj;
        } else if (department.employees.includes(item._id.toString())) {
            users.employees[item._id.toString()] = obj;
        }
    });

    userRoles.forEach((item) => {
        if (users.managers[item.roleId.toString()] && item.userId) {
            users.managers[item.roleId.toString()].members.push(item.userId);
        } else if (users.deputyManagers[item.roleId.toString()] && item.userId) {
            users.deputyManagers[item.roleId.toString()].members.push(item.userId);
        } else if (users.employees[item.roleId.toString()] && item.userId) {
            users.employees[item.roleId.toString()].members.push(item.userId);
        }
    });

    return users;
};

/**
 * Hàm tiện ích dùng trong service ở trên
 * Khác với hàm bên module User: nhận vào 1 mảng các department và trả về 1 mảng với mỗi ptu là tất cả các nhân viên trong từng 1 phòng ban
 */
_getAllUsersInOrganizationalUnits = async (portal, data) => {
    var userArray = [];
    for (let i = 0; i < data.length; i++) {
        var department = data[i];
        if(department) {
            var userRoles = await UserRole(connect(DB_CONNECTION, portal))
                .find({
                    roleId: {
                        $in: [
                            ...department.managers,
                            ...department.deputyManagers,
                            ...department.employees,
                        ],
                    },
                })
                .populate({
                    path: "userId",
                    select: "name",
                });

            var tmp = await Role(connect(DB_CONNECTION, portal)).find(
                {
                    _id: {
                        $in: [
                            ...department.managers,
                            ...department.deputyManagers,
                            ...department.employees,
                        ],
                    },
                },
                {
                    name: 1,
                }
            );
            var users = {
                managers: {},
                deputyManagers: {},
                employees: {},
                department: department.name,
                id: department.id,
            };
            tmp.forEach((item) => {
                let obj = {};
                obj._id = item.id;
                obj.name = item.name;
                obj.members = [];

                if (department.managers.includes(item._id.toString())) {
                    users.managers[item._id.toString()] = obj;
                } else if (department.deputyManagers.includes(item._id.toString())) {
                    users.deputyManagers[item._id.toString()] = obj;
                } else if (department.employees.includes(item._id.toString())) {
                    users.employees[item._id.toString()] = obj;
                }
            });

            userRoles.forEach((item) => {
                if (users.managers[item.roleId.toString()] && item.userId) {
                    users.managers[item.roleId.toString()].members.push(item.userId);
                } else if (users.deputyManagers[item.roleId.toString()] && item.userId) {
                    users.deputyManagers[item.roleId.toString()].members.push(
                        item.userId
                    );
                } else if (users.employees[item.roleId.toString()] && item.userId) {
                    users.employees[item.roleId.toString()].members.push(
                        item.userId
                    );
                }
            });

            userArray.push(users);
        }
    }
    return userArray;
};

exports.getAllUsersWithRole = async (portal) => {
    let users = await UserRole(connect(DB_CONNECTION, portal)).find().populate({
        path: "userId",
        select: "name email avatar",
    });

    return users;
};

/**
 * Lấy thông tin user theo email
 * @portal portal của db
 * @param {*} email : email user
 */
exports.getUserInformByEmail = async (portal, email, company) => {
    let user = await User(connect(DB_CONNECTION, portal)).findOne(
        {
            email: email,
            company: company,
        },
        {
            email: 1,
            _id: 1,
        }
    );
    return user;
};

/**
 * Lấy danh sách người dùng là trưởng phòng của đơn vị theo id đơn vị
 * @id : Id đơn vị
 */
exports.getUserIsManagerOfOrganizationalUnit = async (portal, id) => {
    let organizationalUnit = await OrganizationalUnit(
        connect(DB_CONNECTION, portal)
    ).findById(id);
    let managers = organizationalUnit.managers;
    let userIsManager = await UserRole(connect(DB_CONNECTION, portal))
        .find({
            roleId: {
                $in: managers,
            },
        })
        .populate({
            path: "userId",
            select: "email _id",
        });
    userIsManager = userIsManager.map((x) => x.userId);
    return userIsManager;
};

/**
 * Lấy danh sách người dùng theo mảng roles truyền vào
 * @roles : Mảng các roles
 */

exports.getUsersByRolesArray = async (portal, roles) => {
    let users = await UserRole(connect(DB_CONNECTION, portal)).find({
        roleId: {
            $in: roles
        }
    }).populate({
        path: "userId",
        select: "name email avatar",
    });

    return users;
}

exports.sendEmailResetPasswordUser = async(portal, email) => {
    let user = await User(connect(DB_CONNECTION, portal)).findOne({ email });
    // let code = await generator.generate({ length: 6, numbers: true });
    // user.resetPasswordToken = code;
    const salt = bcrypt.genSaltSync(10);
    const password = generator.generate({
        length: 10,
        numbers: true,
    });
    const hash = bcrypt.hashSync(password, salt);

    user.password = hash;

    if (user.password2) {
        user.password2 = ""
        await User(connect(DB_CONNECTION, portal)).updateOne({
            _id: user._id,
        }, { $set: user })
    } else {
        await user.save();
    }
    
    let subject = `${process.env.WEB_NAME} : Thay đổi mật khẩu - Change password`;
    let text = `Yêu cầu cấp lại mật khẩu cho email ${email}`
    let html =  `<html>
                <head>
                    <style>
                        .wrapper {
                            width: 100%;
                            min-width: 580px;
                            background-color: #FAFAFA;
                            padding: 10px 0;
                        }
                
                        .info {
                            list-style-type: none;
                        }
                
                        @media screen and (max-width: 600px) {
                            .form {
                                border: solid 1px #dddddd;
                                padding: 50px 30px;
                                border-radius: 3px;
                                margin: 0px 5%;
                                background-color: #FFFFFF;
                            }
                        }
                
                        .form {
                            border: solid 1px #dddddd;
                            padding: 50px 30px;
                            border-radius: 3px;
                            margin: 0px 25%;
                            background-color: #FFFFFF;
                        }
                
                        .title {
                            text-align: center;
                        }
                
                        .footer {
                            margin: 0px 25%;
                            text-align: center;
                
                        }
                    </style>
                </head>
                
                <body>
                    <div class="wrapper">
                        <div class="title">
                            <h1>${process.env.WEB_NAME}</h1>
                        </div>
                        <div class="form">
                            <p><b>Thông tin tài khoản đăng nhập mới của bạn: </b></p>
                            <div class="info">
                                <li>Portal: ${portal}</li>
                                <li>Tài khoản: ${email}</li>
                                <li>Mật khẩu: <b>${password}</b></li>
                            </div>
                            <p>Đăng nhập ngay tại: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p><br />
                
                            <p><b>Your account information: </b></p>
                            <div class="info">
                                <li>Portal: ${portal}</li>
                                <li>Account: ${email}</li>
                                <li>Password: <b>${password}</b></li>
                            </div>
                            <p>Login in: <a href="${process.env.WEBSITE}/login">${process.env.WEBSITE}/login</a></p>
                        </div>
                        <div class="footer">
                            <p>Copyright by
                                <i>Công ty Cổ phần Công nghệ
                                    <br />
                                    An toàn thông tin và Truyền thông Việt Nam</i>
                            </p>
                        </div>
                    </div>
                </body>
        </html>`
    await sendEmail(email, subject,text, html);

    return {
        portal, email
    }
}