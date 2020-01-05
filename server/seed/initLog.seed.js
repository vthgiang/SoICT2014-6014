const Log = require('../models/log.model');
const mongoose = require("mongoose");

// DB Config
const db = 'mongodb+srv://qlcv:thai135@cluster0-zqzcq.mongodb.net/test?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

Log.create({
    name: "log",
    status: true
})
.then(data => console.log(data))
.catch(err => console.log(err));