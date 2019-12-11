const Role = require('../models/role.model');
const User = require('../models/user.model');
const Link = require('../models/link.model');
const Privilege = require('../models/privilege.model');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// DB Config
const db = 'mongodb://localhost/vnist-qlcv';

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
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync('123456', salt);

    //Tao tai khoan system admin cho he thong
    var user = await User.create({
        name: "System Admin",
        email: 'systemAdmin@gmail.com',
        password: hash
    });

    //Tao role System Admin 
    var role = await Role.create({
        name: "System Admin",
        users: [user._id]
    });

    var updateUser = await User.updateOne(
        { _id: user.id },
        { $set: { roles: [role._id] } }
    );

    //Tao link quan ly thong tin cac cong ty
    var link = await Link.create({
        url: '/manage-company',
        description: 'Manage companies information'
    });

    //Gan link quan ly thong tin cac cong ty cho system admin
    var privilege = await Privilege.create({
        resource: link._id,
        resource_type: 'Link',
        role: [role._id]
    });

    console.log("success: ", user, role, link, privilege );
}

try {
    initSystem();
} catch (error) {
    console.log(error);
}