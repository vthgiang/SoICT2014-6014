const Log = require('../models/log.model');
const RoleType = require('../models/role_type.model');
const Role = require('../models/role.model');
const Company = require('../models/company.model');
const Link = require('../models/link.model');
const Privilege = require('../models/privilege.model');
const User = require('../models/user.model');
const UserRole = require('../models/user_role.model');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// DB Config
const db = 'mongodb://localhost/qlcv';

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const initLog = async() => {
    await Log.create({
        name: "log",
        status: true
    });
}

const initRoleType = async() => {
    await RoleType.insertMany([
        {
            name: 'abstract'
        },
        {
            name: 'chucdanh'
        },
        {
            name: 'tutao'
        }
    ]);
}

const initSystemData = async() => {
    var company = await Company.create({
        name: 'VNIST',
        short_name: 'vnist',
        description: 'Cty VNIST'
    });

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync('123456', salt);

    //Tao tai khoan system admin cho he thong
    var user = await User.create({
        name: "System Admin",
        email: 'systemAdmin@gmail.com',
        password: hash,
        company: company._id
    });

    //Tao role System Admin 
    var roleType = await RoleType.findOne({ name: 'abstract' });

    var role = await Role.create({
        name: "System Admin",
        company: company._id,
        type: roleType._id
        //abstract không có
    });

    console.log("ROLE SYSTEM: ", role);

    //phan quyen system admin cho tai khoan
    var user_role = await UserRole.create({
        userId: user._id,
        roleId: role._id
    });

    //Tao link quan ly thong tin cac cong ty
    var links = await Link.insertMany([
        {
            url: '/system',
            description: 'System',
            company:company._id
        },
        {
            url: '/manage-company',
            description: 'Manage companies information',
            company:company._id
        }
    ]);

    //Gan link quan ly thong tin cac cong ty cho system admin
    var privilege = await Privilege.insertMany([
        {
            resourceId: links[0]._id,
            resourceType: 'Link',
            roleId: role._id
        },
        {
            resourceId: links[1]._id,
            resourceType: 'Link',
            roleId: role._id
        }
    ]);

    console.log("success: ", user, role, user_role, links, privilege );
}

initLog()
    .then(() => {
        initRoleType()
            .then(() => {
                initSystemData()
                .then(() => {
                    process.exit(1);
                })
                .catch(err => {
                    console.log(err);
                    process.exit(1);
                });
            })
            .catch(err => {
                console.log(err);
                process.exit(1);
            });
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });

