const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CrmUnitKPISchema = new Schema({
    completionRate: { //tên loại hình chăm sóc khách hàng
        weight: {
            type: String
        },
        value: {
            type: Number,
        }
    },
    solutionRate: { // Mô tả loại hình chăm sóc
        weight: {
            type: String
        },
        value: {
            type: Number,
        }
    },
    customerRetentionRate: { // Mô tả loại hình chăm sóc
        weight: {
            type: String
        },
        value: {
            type: Number,
        }
    },
    numberOfNewCustomers: { // Mô tả loại hình chăm sóc
        weight: {
            type: String
        },
        value: {
            type: Number,
        }
    },
    newCustomerBuyingRate: { // Mô tả loại hình chăm sóc
        weight: {
            type: String
        },
        value: {
            type: Number,
        }
    },

    totalActions: { // Mô tả loại hình chăm sóc
        weight: {
            type: String
        },
        value: {
            type: Number,
        }
    },


    createdAt: { // ngày tạo loại CSKH
        type: Date,
    },
    creator: {// người tạo loại CSKH
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedAt: { // ngày cập nhật
        type: Date,
    },
    updatedBy: {// người cập nhật
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    crmUnit: {// đơn vị CSKH
        type: Schema.Types.ObjectId,
        ref: "CrmUnit",
    },
}, {
    timestamps: true,
});

CrmUnitKPISchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.CrmUnitKPI)
        return db.model('CrmUnitKPI', CrmUnitKPISchema);
    return db.models.CrmUnitKPI;
}