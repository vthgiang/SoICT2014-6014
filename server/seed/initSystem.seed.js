const Role = require('../models/role.model');
const User = require('../models/user.model');
const Link = require('../models/link.model');
const Company = require('../models/company.model');
const Privilege = require('../models/privilege.model');
const UserRole = require('../models/user_role.model');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// DB Config
const db = 'mongodb+srv://qlcv:thai135@cluster0-zqzcq.mongodb.net/test?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(
    db,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

initSystem = async () => {
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
    var role = await Role.create({
        name: "System Admin",
        company: company._id,
    });

    //phan quyen system admin cho tai khoan
    var user_role = await UserRole.create({
        userId: user._id,
        roleId: role._id
    });

    //Tao link quan ly thong tin cac cong ty
    var link = await Link.create({
        url: '/manage-company',
        description: 'Manage companies information',
        company:company._id
    });

    //Gan link quan ly thong tin cac cong ty cho system admin
    var privilege = await Privilege.create({
        resourceId: link._id,
        resourceType: 'Link',
        roleId: role._id
    });

    console.log("success: ", user, role, user_role, link, privilege );
}

try {
    initSystem();
} catch (error) {
    console.log(error);
}
