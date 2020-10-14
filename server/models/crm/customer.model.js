const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerSchema = new Schema({
    creator: {// Người thêm khách hàng
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    code: { // Mã khách hàng
        type: String,
        required: true,
    },
    name: { // Tên khách hàng
        type: String,
        required: true,
    },
    owner: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    gender: { // Giới tính
        type: String,
    },
    avatar: { // Ảnh đại diện khách hàng
        type: String,
    },
    company: {// Tên công ty
        type: String,
    },
    taxNumber: { // Mã số thuế
        type: String,
    },
    customerSource: { // nguồn tìm thấy khách hàng
        type: String,
    },
    companyEstablishmentDate: { // Ngày thành lập công ty
        type: Date,
    },
    birthDate: { //Ngày sinh nhật
        type: Date,
    },
    telephoneNumber: { // Số điện thoại bàn 
        type: Number,
    },
    mobilephoneNumber: { // Số điện thoại di động
        type: Number,
    },
    email: { // Địa chỉ email
        type: String,
    },
    email2: {
        type: String,
    },
    address: { // Địa chỉ thứ 1 của khách hàng
        type: String
    },
    address2: { // Địa chỉ thứ 2 của khách hàng nếu có
        type: String
    },
    location: { // 0: Miền bắc, 1: Miền trung,  2: Miền nam
        type: Number,
    },
    website: { // Địa chỉ khách hàng
        type: String,
    },
    linkedIn: { // Địa chỉ linkedIn
        type: String,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
    },
    status: [{
        type: Schema.Types.ObjectId,
        ref: 'Status'
    }],
    isDeleted: { // Trạng thái kích hoạt khách hàng
        type: Boolean,
        // required: true,
        default: false,
    },
    files: [{ // Tài liệu liên quan tới khách hàng
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        description: {
            type: String
        },
        name: {
            type: String
        },
        url: {
            type: String
        }
    }],
    history: [{
        oldValue: {
            type: String
        },
        newValue: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    }],
    // company: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Company',
    // }

}, {
    timestamps: true,
});

CustomerSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Customer)
        return db.model('Customer', CustomerSchema);
    return db.models.Customer;
}
