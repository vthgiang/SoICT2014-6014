const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerCareSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,//người tạo hoạt động
        ref: 'User',
    },
    name: { //tên công việc chăm sóc khách hàng
        type: String,
        required: true
    },
    description: { // Mô tả công việc chăm sóc khách hàng
        type: String,  
    },
    customer: { // khách hàng được chăm sóc
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    customerCareStaffs : [{ //nhân viên chăm sóc khách hàng
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    customerCareTypes: [{
        type: Schema.Types.ObjectId,//loại hình cskh
        ref: 'CareType',
        required: true,
    }],
    status: { //trạng thái công việc 1: chưa thực hiện, 2: đang thực hiện, 3: Hoàn thành, 4: quá hạn, 5: hoàn thành quá hạn
        type: Number,
        default: 2,
    },
    priority:{// độ ưu tiên
        type: Number,
    },
    startDate: {// ngày bắt đầu
        type: Date,
        required: true,
    },
    endDate: {// ngày kết thúc
        type: Date,
    },
    completeDate: {// ngày hoàn thành
        type: Date,
    },
    evaluation :{// đánh giá hoạt động CSKH
        result :{// kết quả 1 : thành công, 2: thất bại
            type : Number 
        },
        point :{// điểm số
            type : Number
        },
        comment : {// nhận xét
            type : String
        }
        

    },
    notes: { // Ghi chu
        type: String,
    },
   
}, {
    timestamps: true,
});

CustomerCareSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Care)
        return db.model('CustomerCare', CustomerCareSchema);
    return db.models.Care;
}