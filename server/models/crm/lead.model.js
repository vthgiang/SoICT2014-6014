const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LeadSchema = new Schema({
    code: { // Mã khách hàng
        type: String,
        required: true,
    },
    name: { // Tên khách hàng
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    gender: { // Giới tính
        type: String,
        enum: ['male', 'female'],
    },
    avatar: { // Ảnh đại diện khách hàng
        type: String,
    },
    company: {// Tên công ty
        type: String,
    },
    taxNumber: { // Mã số thuế
        type: Number,
    },
    leadSource: { // nguồn tìm thấy khách hàng
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
    status: { // Trạng thái khách hàng
        type: Schema.Types.ObjectId,
        ref: 'Status'
    },
    isDeleted: { // Trạng thái kích hoạt khách hàng
        type: Boolean,
        required: true,
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
    }]

}, {
    timestamps: true,
});

LeadSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Lead)
        return db.model('Lead', LeadSchema);
    return db.models.Lead;
}
