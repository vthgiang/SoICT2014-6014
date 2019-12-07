const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const user = require('./app/user/user.route');
const auth = require('./app/auth/auth.route');
const company = require('./app/company/company.route');
const role = require('./app/role/role.route');
const link = require('./app/link/link.route');
const department = require('./app/department/department.route');

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

// DB Config
const db = process.env.DATABASE;

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

app.use("/user", user);
app.use("/auth", auth);
app.use("/company", company);
app.use("/role", role);
app.use("/link", link);
app.use("/department", department);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));