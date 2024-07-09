const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng datatable ngành nghề/lĩnh vực
const FieldsSchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company"
    },
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
    }
}, {
    timestamps: true,
});

module.exports = (db) => {
    if (!db.models.Field)
        return db.model('Field', FieldsSchema);
    return db.models.Field;
}