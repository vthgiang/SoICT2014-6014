const Log = require('../models/log.model');
const RoleType = require('../models/role_type.model');
const Role = require('../models/role.model');
const Company = require('../models/company.model');
const Link = require('../models/link.model');
const Privilege = require('../models/privilege.model');
const User = require('../models/user.model');
const Employee = require('../models/employee.model')
const UserRole = require('../models/user_role.model');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('dotenv').config({
    path: '../.env'
});

// DB CONFIG
const db = process.env.DATABASE;

// kẾT NỐI TỚI CSDL MONGODB
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log("Kết nối thành công đến MongoDB!\n");
}).catch(err => console.log("ERROR! :(\n", err));

const fakeData = async () => {
    console.log("Đang fake dữ liệu ...");

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO DỮ LIỆU VỀ CÔNG TY XYZ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Khởi tạo dữ liệu công ty!");
    var xyz = await Company.create({
        name: 'Công ty TNHH XYZ',
        short_name: 'xys',
        description: 'Công ty TNHH XYZ'
    });
    console.log(`Xong! Công ty [${xyz.name}] đã được tạo.`);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC TÀI KHOẢN NGƯỜI DÙNG CHO CÔNG TY XYZ
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log(`Khởi tạo các tài khoản cho công ty [${xyz.name}]`);
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync('123456', salt);

    const users = await User.insertMany([{
        name: 'Super Admin công ty xyz',
        email: 'super.admin.xyz@gmail.com',
        password: hash,
        company: xyz._id
    }, {
        name: 'Nguyễn Văn A',
        email: 'nva.xyz@gmail.com',
        password: hash,
        company: xyz._id
    }, {
        name: 'Trần Văn B',
        email: 'tvb.xyz@gmail.com',
        password: hash,
        company: xyz._id
    }, {
        name: 'Vũ Thị C',
        email: 'vtc.xyz@gmail.com',
        password: hash,
        company: xyz._id
    }, {
        name: 'Nguyễn Văn D',
        email: 'nvd.xyz@gmail.com',
        password: hash,
        company: xyz._id
    }, {
        name: 'Trần Thị E',
        email: 'tte.xyz@gmail.com',
        password: hash,
        company: xyz._id
    }, {
        name: 'Phạm Đình F',
        email: 'pdf.xyz@gmail.com',
        password: hash,
        company: xyz._id
    }, {
        name: 'Trần Hùng Cường',
        email: 'tranhungcuong703@gmail.com',
        password: hash,
        company: xyz._id
    }]);
    console.log("Xong! Đã thêm tài khoản:", users);
    //END


    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO CÁC ROLE MẶC ĐỊNH CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo role mặc định của công ty...");
    const roleAbstract = await RoleType.findOne({
        name: 'abstract'
    });

    const roles = await Role.insertMany([{
        name: "Super Admin",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Admin",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Trưởng đơn vị",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Phó đơn vị",
        company: xyz._id,
        type: roleAbstract._id
    }, {
        name: "Nhân viên đơn vị",
        company: xyz._id,
        type: roleAbstract._id
    }]);
    console.log("Đã tạo xong roles: ", roles);
    //END
    await UserRole.create({
        userId: users[0]._id,
        roleId: roles[0]._id
    });

    /*---------------------------------------------------------------------------------------------
    -----------------------------------------------------------------------------------------------
        TẠO LINK CHO CÁC TRANG WEB CỦA CÔNG TY 
    -----------------------------------------------------------------------------------------------
    ----------------------------------------------------------------------------------------------- */

    console.log("Tạo link cho các trang web của công ty...");
    const links = await Link.insertMany([{
            url: '/',
            description: `Trang chủ công ty ${xyz.name}`,
            company: xyz._id
        }, {
            url: '/manage-department',
            description: 'Quản lý cơ cấu tổ chức',
            company: xyz._id
        }, {
            url: '/manage-user',
            description: 'Quản lý người dùng',
            company: xyz._id
        }, {
            url: '/manage-role',
            description: 'Quản lý phân quyền',
            company: xyz._id
        }, {
            url: '/manage-link',
            description: 'Quản lý trang web của công ty',
            company: xyz._id
        }, {
            url: '/manage-component',
            description: 'Quản lý các thành phần UI trên trang web của công ty',
            company: xyz._id
        }, {
            url: '/manage-form-document',
            description: 'Quản lý tài liệu biểu mẫu',
            company: xyz._id
        },]);
    console.log("Xong! Đã tạo links: ", links);
    //END
    const privileges = await Privilege.insertMany([{
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: roles[0]._id
        }, {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[2]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[3]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[4]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[5]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        }, {
            resourceId: links[6]._id,
            resourceType: 'Link',
            roleId: roles[0]._id._id
        },]);
    console.log("Gán quyền super admin cho các trang: ", privileges);
}

//Khởi chạy hàm tạo dữ liệu mẫu ------------------------------//
fakeData()
    .then(() => {
        console.log("DONE! :)\n")
        process.exit(1);
    }).catch(err => {
        console.log("ERROR! :(\n", err);
        process.exit(1);
    });