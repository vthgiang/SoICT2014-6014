const Log = require('../models/role_type.model');
const mongoose = require("mongoose");

// DB Config
const db = 'mongodb://localhost/test';

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

RoleType.insertMany([
    {
        name: 'abstract'
    },
    {
        name: 'chucdanh'
    },
    {
        name: 'tutao'
    }
])
.then(data => console.log(data))
.catch(err => console.log(err));