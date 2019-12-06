const Role = require('../models/role.model');
const mongoose = require("mongoose");

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

initRole = async () => {
    var systemAdmin = await Role.create({
        name: "System Admin",
        abstract: []
    });

    var superAdmin = await Role.create({
        name: "Super Admin",
        abstract: []
    });

    var admin = await Role.create({
        name: "Admin",
        abstract: []
    });

    var employee = await Role.create({
        name: "Employee",
        abstract: []
    });

    var vicedean = await Role.create({
        name: "Vice Dean",
        abstract: []
    });

    var dean = await Role.create({
        name: "Dean",
        abstract: []
    });

    console.log("Load success Role Data: ", systemAdmin, superAdmin, admin, dean, vicedean, employee);
}

try {
    initRole();
} catch (error) {
    console.log(error);
}