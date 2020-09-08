const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MaterialSchema = new Schema({

    code: { //1. mã vật tư
        type: String,
        required: true
    },

    materialName: { //3.tên tài sản
        type: String,
        required: true
    },

    serial: { //4. số serial 
        type: String,
    },
    
   location: { //15.vị trí tài sản
       type: String,
   },

   description: { //17.mô tả
       type: String,
   },
   
    cost: { //8. Nguyên giá
        type: Number
    },

});

module.exports = Material = (db) => db.model("materials", MaterialSchema);
