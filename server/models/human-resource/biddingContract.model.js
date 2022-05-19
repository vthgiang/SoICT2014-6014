const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tạo bảng hợp đồng dùng để lưu lại thông tin hợp đồng đươc kí khi gói thầu trúng thầu
const BiddingContractSchema = new Schema(
    {
        code: {
            type: String, // mã hợp đồng
        },
        name: {
            type: String, // tên hợp đồng
        },
        createdDate: {
            type: Date,
            defaut: Date.now, // ngày tạo hợp đồng
        },
        effectiveDate: {
            type: Date, // ngày hợp đồng bắt đầu có hiệu lực
        },
        endDate: {
            type: Date, // ngày kết thúc hợp đồng
        },
        // Đơn vị thời gian của hợp đồng
        unitOfTime: {
            // có 2 đơn vị thời gian: Giờ, Ngày, Tháng
            type: String,
            default: "days",
            enum: [
                "hours",
                "days",
                "months",
            ],
        },
        // Ngân sách
        budget: {
            type: Number,
        },
        // Đơn vị tiền tệ của hợp đồng
        currenceUnit: {
            // có 2 đơn vị chi phÍ: VND, USD
            type: String,
            default: "VND",
            enum: [
                "VND",
                "USD",
            ],
        },

        // người tạo
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        // bên A - nhà đầu tư
        partyA: {
            // công ty
            company: {
                type: String,
            },
            // địa chỉ 
            address: {
                type: String,
            },
            // địa chỉ email 
            email: {
                type: String,
            },
            // số đth
            phone: {
                type: String,
            },
            // mã số thuế
            taxCode: {
                type: String,
            },
            // người đại diện
            representative: {
                name: { // tên
                    type: String,
                },
                role: { // chức vụ
                    type: String,
                },
            },
            bank: { // Tài khoản ngân hàng
                name: { // tên ngân hàng
                    type: String,
                },
                accountNumber: { // số tài khoản 
                    type: String,
                },
            },
        },

        // bên B - người trúng thầu
        partyB: {
            // công ty
            company: {
                type: String,
            },
            // địa chỉ 
            address: {
                type: String,
            },
            // địa chỉ email 
            email: {
                type: String,
            },
            // số đth
            phone: {
                type: String,
            },
            // mã số thuế
            taxCode: {
                type: String,
            },
            // người đại diện
            representative: {
                name: { // tên
                    type: String,
                },
                role: { // chức vụ
                    type: String,
                },
            },
            bank: { // Tài khoản ngân hàng
                name: { // tên ngân hàng
                    type: String,
                },
                accountNumber: { // số tài khoản 
                    type: String,
                },
            },
        },

        // gói thầu trúng thầu
        biddingPackage: {
            type: Schema.Types.ObjectId,
            ref: "BiddingPackage",
        },
        // dự án được tạo sau khi trúng thầu
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        // file hợp đồng đính kèm
        files: [{
            name: {
                type: String,
            },
            url: {
                type: String,
            },
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = (db) => {
    if (!db.models.BiddingContract)
        return db.model("BiddingContract", BiddingContractSchema);
    return db.models.BiddingContract;
};
