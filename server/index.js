const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const system = require('./modules/system/system.route');
const user = require('./modules/super-admin-management/users-management/user.route');
const auth = require('./modules/auth/auth.route');
const company = require('./modules/system-admin-management/companies-management/company.route');
const role = require('./modules/super-admin-management/roles-management/role.route');
const link = require('./modules/system-admin-management/links-management/link.route');
const department = require('./modules/super-admin-management/departments-management/department.route');
const privilege = require('./modules/super-admin-management/privileges/privilege.route');
const component = require('./modules/system-admin-management/components-management/component.route');
const educationProgram = require('./modules/trainning-Course/education-program/educationProgram.route');
const employee = require('./modules/employees-manager/employee/employee.route');
const document = require('./modules/documents-management/document.route');

require('dotenv').config();

const app = express();

// Bodyparser middleware
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(cookieParser());

// DB Config
const db = process.env.DATABASE;

// Connect to MongoDB
mongoose
    .connect(
        db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

global.isLog = false;
const Logger = require('./models/log.model');
Logger.findOne({name: 'log'})
    .then(result => {
        result.status ? isLog = true : isLog = false;
        console.log("Logger status: ", isLog);
    })
    .catch(err => console.log("msg: ", err));



app.use("/system", system);
app.use("/user", user);
app.use("/auth", auth);
app.use("/company", company);
app.use("/role", role);
app.use("/link", link);
app.use("/department", department);
app.use("/privilege", privilege);
app.use("/educationProgram", educationProgram);
app.use("/employee", employee);
app.use("/document", document);
app.use("/component", component);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));