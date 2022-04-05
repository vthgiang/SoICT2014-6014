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
    gender: { // Giới tính 1: Name, 2: Nữ
        type: Number,
    },
    avatar: { // Ảnh đại diện khách hàng
        type: String,
    },
    customerType: { // 1: Cá nhân, 2: Công ty/tổ chức
        type: Number,
    },
    company: { // Tên công ty
        type: String,
    },
    represent: { // Người đại diện
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
    location: { // 1: Miền bắc, 2: Miền trung,  3: Miền nam
        type: Number,
    },
    website: { // Địa chỉ khách hàng
        type: String,
    },
    linkedIn: { // Địa chỉ linkedIn
        type: String,
    },
    customerGroup: {
        type: Schema.Types.ObjectId,
        ref: 'CustomerGroup',
    },
    customerStatus: [{
        type: Schema.Types.ObjectId,
        ref: 'CustomerStatus'
    }],
    point: {
        type: Number,
        default: 0
    },
    isDeleted: { // Trạng thái kích hoạt khách hàng
        type: Boolean,
        // required: true,
        default: false,
    },
    // diem xep hang khach hang
    rankPoints: [
        {
            point: {
                type: Number
            },
            expirationDate: {
                type: Date
            },
            
          
        }
    ],

    
    files: [{ // Tài liệu liên quan tới khách hàng
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String
        },
        description: {
            type: String
        },
        fileName: {
            type: String,
        },
        url: {
            type: String
        }
    }],
    statusHistories: [{// lịch sử thay đổi trạng thái
        oldValue: {
            type: Schema.Types.ObjectId,
            ref: 'CustomerStatus'
        },
        newValue: {
            type: Schema.Types.ObjectId,
            ref: 'CustomerStatus'
        },
        createdAt: { // ngày cập nhật
            type: Date,
        },
        createdAt: {// ngày cập nhật
            type: Date,
        },
        createdBy: {// người cập nhật
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        description: {
            type: String
        }
    }],

    updatedAt: { // ngày cập nhật
        type: Date,
    },
    updatedBy: {// người cập nhật
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    note: { // ghi chú
        type: String,
    }
    ,
    promotions: [{// tat ca danh sach khuyen mai cua khach hang 
        code: { // Mã ưu đãi, cái này mới thêm khi làm chức năng thêm mã khuyến mãi cho nhóm KH, vì liên quan đến nhiều phần khác chưa sửa nên tạm thời để require = false
            type: String,
            require: false 
        },
        value: { type: Number },
        description: { type: String },
        minimumOrderValue: { type: Number },
        promotionalValueMax: { type: Number },
        expirationDate:{type:Date},
        status:{type:Number}
    }],
    canUsedPromotions: [{// danh sach khuyen mai con hieu luc, chua su dung cua khach hang 
        code: { 
            type: String,
            require: false 
        },
        value: { type: Number },
        description: { type: String },
        minimumOrderValue: { type: Number },
        promotionalValueMax: { type: Number },
        expirationDate:{type:Date},
        exceptCustomer: [{
            type: Schema.Types.ObjectId,
            ref: "Customer"
        }],
        status:{type:Number},
        customerUsed: [{
            type: Schema.Types.ObjectId,
            ref: "Customer"
        }]
    }],
    customerCareUnit: {// đơn vị CSKH
        type: Schema.Types.ObjectId,
        ref: "CustomerCareUnit",
    },

}

, {
    timestamps: true,
});

CustomerSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Customer)
        return db.model('Customer', CustomerSchema);
    return db.models.Customer;
}
