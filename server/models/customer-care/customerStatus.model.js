const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerStatusSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name: { // Tên trạng thái
        type: String,
        required: true
    },
    description: { // Mô tả trạng thái
        type: String
    },
    active: {
        type:Boolean,
        default: false,  
    },
    
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    customerCareUnit: {// đơn vị CSKH
        type: Schema.Types.ObjectId,
        ref: "CustomerCareUnit",
    },
}, {
    timestamps: true,
});

CustomerStatusSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CustomerStatus)
        return db.model('CustomerStatus', CustomerStatusSchema);
    return db.models.CustomerStatus;
}
