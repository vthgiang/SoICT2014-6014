const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BankAccountSchema = new Schema({
    account: {//Số tài khoản
        type: String,
        required: true
    },
    owner: {//Chủ tài khoản
        type: String,
        required: true
    },
    bankName: {//Ngân hàng
        type: String,
        required: true
    },
    bankAcronym: {//Tên viết tắt ngân hàng
        type: String,
    },
    status: {//Trạng thái sử dụng
        type: Boolean,
        required: true,
        default: false
    },
    creator: {//Người tạo
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
})

BankAccountSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models || !db.models.BankAccount)
        return db.model('BankAccount', BankAccountSchema)
    return db.models.BankAccount
}
